import express from 'express';
import Flutterwave from 'flutterwave-node-v3';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validate Flutterwave environment variables
if (!process.env.FLW_PUBLIC_KEY || !process.env.FLW_SECRET_KEY) {
  console.error('ERROR: Flutterwave credentials not configured!');
  console.error('Please set FLW_PUBLIC_KEY and FLW_SECRET_KEY in your environment variables.');
}

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

// Initiate payment
router.post('/initiate', protect, async (req, res) => {
  try {
    const { amount, email, name, phone, orderId } = req.body;

    // Validate required fields
    if (!amount || !email || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields: amount, email, and name are required' 
      });
    }

    // Generate a unique transaction reference
    const tx_ref = `CLOUD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const payload = {
      tx_ref,
      amount,
      currency: 'USD', // Change to your preferred currency (NGN, GHS, KES, etc.)
      redirect_url: `${process.env.CLIENT_URL}/payment/callback`,
      payment_options: 'card,banktransfer,ussd,account,opay',
      customer: {
        email,
        phonenumber: phone || '',
        name,
      },
      customizations: {
        title: 'Cloudscape Fashion',
        description: 'Payment for your order',
        logo: 'https://your-logo-url.com/logo.png', // Add your logo URL
      },
      meta: {
        orderId: orderId || '',
        userId: req.user._id.toString(),
      },
    };

    const response = await flw.Charge.card(payload);

    if (response.status === 'success') {
      res.json({
        status: 'success',
        message: 'Payment initiated successfully',
        data: response.data,
        paymentLink: response.data.link,
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Failed to initiate payment',
        error: response.message,
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      message: 'Error initiating payment',
      error: error.message,
    });
  }
});

// Verify payment
router.get('/verify/:transaction_id', protect, async (req, res) => {
  try {
    const { transaction_id } = req.params;

    const response = await flw.Transaction.verify({ id: transaction_id });

    if (
      response.data.status === 'successful' &&
      response.data.amount >= response.data.meta.expectedAmount &&
      response.data.currency === 'USD' // Change to match your currency
    ) {
      // Payment was successful
      // Update order status if orderId is available
      if (response.data.meta && response.data.meta.orderId) {
        await Order.findByIdAndUpdate(
          response.data.meta.orderId,
          {
            paymentStatus: 'completed',
            status: 'processing',
            paymentReference: transaction_id,
            flutterwaveRef: response.data.flw_ref,
          }
        );
      }

      res.json({
        status: 'success',
        message: 'Payment verified successfully',
        data: response.data,
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Payment verification failed',
        data: response.data,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      message: 'Error verifying payment',
      error: error.message,
    });
  }
});

// Webhook endpoint for Flutterwave
router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers['verif-hash'];

    if (!signature || signature !== secretHash) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = req.body;

    // Handle successful payment
    if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
      const { tx_ref, id, amount, customer, meta } = payload.data;

      // Update order if orderId exists in meta
      if (meta && meta.orderId) {
        await Order.findByIdAndUpdate(meta.orderId, {
          paymentStatus: 'completed',
          status: 'processing',
          paymentReference: tx_ref,
          flutterwaveRef: id,
        });
      }

      console.log('Payment completed:', { tx_ref, amount, customer });
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Get payment status
router.get('/status/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      status: order.paymentStatus,
      orderStatus: order.status,
      paymentReference: order.paymentReference,
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      message: 'Error checking payment status',
      error: error.message,
    });
  }
});

export default router;
