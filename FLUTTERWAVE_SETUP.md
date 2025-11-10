# Flutterwave Payment Integration Setup Guide

## What You Need from Flutterwave

To integrate Flutterwave into your Cloudscape e-commerce platform, you need to obtain the following credentials:

### 1. **Public Key** (Client-side)
   - Used for initializing payments on the frontend
   - Safe to expose in your React application

### 2. **Secret Key** (Server-side)
   - Used for server-side API calls and payment verification
   - **MUST BE KEPT SECRET** - Never expose this in your frontend code

### 3. **Secret Hash** (Webhook verification)
   - Used to verify webhook requests from Flutterwave
   - Prevents unauthorized webhook calls

## How to Get Your Flutterwave Credentials

### Step 1: Create a Flutterwave Account
1. Visit [https://flutterwave.com](https://flutterwave.com)
2. Sign up for a free account
3. Complete the business verification process

### Step 2: Get Your API Keys
1. Log in to your [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to **Settings** → **API Keys**
3. You'll see two sets of keys:
   - **Test Keys** (for development)
   - **Live Keys** (for production)

### Step 3: Copy Your Keys
Copy the following from the dashboard:
- **Public Key** (starts with `FLWPUBK_TEST-` for test mode)
- **Secret Key** (starts with `FLWSECK_TEST-` for test mode)
- **Encryption Key** (optional, but recommended)

### Step 4: Generate Webhook Secret Hash
1. In your Flutterwave Dashboard, go to **Settings** → **Webhooks**
2. Set your webhook URL to: `https://your-backend-url.com/api/payment/webhook`
3. Generate or copy your **Secret Hash**

## Environment Variables Setup

### Backend (.env file in server directory)
```env
# Flutterwave Configuration
FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_SECRET_KEY=FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_SECRET_HASH=your_webhook_secret_hash_here
CLIENT_URL=http://localhost:5173
```

### Frontend (.env file in client directory)
```env
VITE_API_URL=http://localhost:5000
VITE_FLW_PUBLIC_KEY=FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

## Testing the Integration

### Test Mode
For development and testing, use the **Test Keys**. Flutterwave provides test cards:

**Test Card Details:**
- **Card Number:** 5531886652142950
- **CVV:** 564
- **Expiry:** 09/32
- **PIN:** 3310
- **OTP:** 12345

### Test the Payment Flow
1. Start your backend server: `cd server && npm run dev`
2. Start your frontend: `cd client && npm run dev`
3. Add items to cart
4. Go through checkout
5. Use the test card details above
6. Verify payment completion

## Production Setup

### Before Going Live:
1. **Switch to Live Keys** in your environment variables
2. **Update webhook URL** in Flutterwave Dashboard to your production URL
3. **Test thoroughly** with real cards in test mode first
4. **Implement proper error handling** for failed payments
5. **Set up email notifications** for successful/failed payments
6. **Verify webhook security** is properly implemented

### Security Checklist:
- [ ] Secret keys are stored in environment variables (never in code)
- [ ] Webhook signature verification is enabled
- [ ] HTTPS is enabled on production
- [ ] Payment amounts are verified on the backend
- [ ] Transaction IDs are stored in the database

## Currency Configuration

The current implementation uses **USD** as the default currency. To change this:

### Backend (server/routes/paymentRoutes.js)
```javascript
// Line 22: Change currency in payload
currency: 'NGN', // Options: NGN, USD, GHS, KES, ZAR, etc.

// Line 82: Change currency verification
response.data.currency === 'NGN'
```

### Frontend (client/src/pages/Checkout.jsx)
```javascript
// Line 135: Change currency in config
currency: 'NGN',
```

## Supported Currencies
- **NGN** - Nigerian Naira
- **USD** - US Dollar
- **GHS** - Ghanaian Cedi
- **KES** - Kenyan Shilling
- **ZAR** - South African Rand
- **GBP** - British Pound
- **EUR** - Euro

## Webhook Configuration

Your webhook endpoint is: `POST /api/payment/webhook`

This endpoint:
1. Verifies the webhook signature
2. Updates order status when payment is completed
3. Logs payment events

**Important:** Make sure this endpoint is publicly accessible (not behind authentication).

## API Endpoints

Your payment integration includes these endpoints:

1. **POST /api/payment/initiate** - Initiate a payment
2. **GET /api/payment/verify/:transaction_id** - Verify a payment
3. **POST /api/payment/webhook** - Handle Flutterwave webhooks
4. **GET /api/payment/status/:orderId** - Check payment status

## Troubleshooting

### Common Issues:

1. **"Public key is required"**
   - Check that `VITE_FLW_PUBLIC_KEY` is set in client/.env
   - Restart your frontend dev server after adding the variable

2. **"Unauthorized webhook"**
   - Verify `FLW_SECRET_HASH` matches the one in Flutterwave Dashboard
   - Check webhook URL is correct

3. **Payment verification fails**
   - Ensure `FLW_SECRET_KEY` is correct
   - Check network connectivity to Flutterwave API

4. **Payment modal doesn't open**
   - Clear browser cache
   - Check browser console for errors
   - Verify Flutterwave package is installed: `npm list flutterwave-react-v3`

## Support

- **Flutterwave Documentation:** [https://developer.flutterwave.com](https://developer.flutterwave.com)
- **Flutterwave Support:** support@flutterwave.com
- **Community:** [Flutterwave Slack Community](https://join.slack.com/t/flutterwave-community)

## Next Steps

1. ✅ Get your API keys from Flutterwave Dashboard
2. ✅ Add environment variables to both server and client
3. ✅ Test with test card in development
4. ✅ Configure webhook URL in Flutterwave Dashboard
5. ✅ Test complete payment flow
6. 🎉 Go live with real keys!
