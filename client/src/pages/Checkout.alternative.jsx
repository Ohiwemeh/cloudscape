import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import initializeFlutterwavePayment from '../utils/flutterwave';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 1500) : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShippingForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitShipping = async (e) => {
    e.preventDefault();
    if (!validateShippingForm()) return;
    
    setIsProcessing(true);
    setServerError('');

    try {
      const token = localStorage.getItem('cloudscape_token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create order first
      const sanitizedItems = cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        selectedSize: item.selectedSize || undefined
      }));

      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };

      const orderData = {
        items: sanitizedItems,
        shippingAddress: shippingAddress,
        totalAmount: total,
      };

      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/create-order`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Immediately trigger Flutterwave payment
      handleFlutterwavePayment(orderResponse.data._id);
      
    } catch (err) {
      console.error('Order creation failed:', err);
      setServerError(err.response?.data?.message || 'Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleFlutterwavePayment = (orderId) => {
    const config = {
      public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
      tx_ref: `CLOUD-${Date.now()}-${orderId}`,
      amount: total,
      currency: 'NGN',
      payment_options: 'card,banktransfer,ussd,account,opay',
      customer: {
        email: formData.email,
        phone_number: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`,
      },
      customizations: {
        title: 'Cloudscape Fashion',
        description: 'Payment for your order',
        logo: 'https://your-logo-url.com/logo.png',
      },
      onClose: () => {
        console.log('Payment modal closed');
        setIsProcessing(false);
      },
    };

    initializeFlutterwavePayment(config, async (response) => {
      console.log('Payment response:', response);
      
      if (response.status === 'successful') {
        try {
          const token = localStorage.getItem('cloudscape_token');
          // Verify payment on backend
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/payment/verify/${response.transaction_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          clearCart();
          navigate('/orders');
        } catch (error) {
          console.error('Payment verification failed:', error);
          setServerError('Payment successful but verification failed. Please contact support.');
          setIsProcessing(false);
        }
      } else {
        setServerError('Payment was not successful. Please try again.');
        setIsProcessing(false);
      }
    });
  };

  const renderInput = (label, name, type = 'text', colSpan = 'full') => (
    <div className={colSpan === 'half' ? '' : 'col-span-2'}>
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} p-3`}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Cart
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-2">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitShipping} className="space-y-6">
              <h2 className="text-xl font-light tracking-wider mb-6">Shipping Information</h2>
              
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {renderInput('First Name', 'firstName', 'text', 'half')}
                {renderInput('Last Name', 'lastName', 'text', 'half')}
              </div>

              {renderInput('Email', 'email', 'email')}
              {renderInput('Phone', 'phone', 'tel')}
              {renderInput('Address', 'address')}
              
              <div className="grid grid-cols-2 gap-4">
                {renderInput('City', 'city', 'text', 'half')}
                {renderInput('State', 'state', 'text', 'half')}
              </div>

              {renderInput('ZIP Code', 'zipCode')}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Next:</strong> You'll be redirected to Flutterwave secure payment page where you can pay with:
                </p>
                <ul className="mt-2 text-sm text-blue-800 list-disc list-inside">
                  <li>Debit/Credit Card</li>
                  <li>Bank Transfer</li>
                  <li>USSD</li>
                  <li>Opay</li>
                  <li>Bank Account</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {isProcessing ? 'Processing...' : `Proceed to Payment - ₦${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-24">
              <h2 className="text-xl font-light tracking-wider mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={item.id || item._id || index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₦{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `₦${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium tracking-wide">Total</span>
                    <span className="font-medium text-lg">₦{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
