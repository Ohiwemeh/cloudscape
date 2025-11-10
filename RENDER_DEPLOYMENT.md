# Render Deployment Guide - Flutterwave Setup

## Quick Fix for "Public Key required" Error

This error occurs when Flutterwave environment variables are not set on Render.

## Step-by-Step Solution

### 1. Get Your Flutterwave Credentials

1. Login to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Go to **Settings** → **API Keys**
3. Copy these keys:
   - **Public Key** (FLWPUBK_...)
   - **Secret Key** (FLWSECK_...)
4. Go to **Settings** → **Webhooks** and copy your **Secret Hash**

> ⚠️ **Important:** For production deployment, use **Live Keys**, not Test Keys!

### 2. Add Environment Variables on Render

1. **Login to Render Dashboard**
   - Go to [https://dashboard.render.com](https://dashboard.render.com)

2. **Select Your Backend Service**
   - Click on your server/backend service from the dashboard

3. **Navigate to Environment Tab**
   - Click on **Environment** in the left sidebar

4. **Add Each Variable**
   Click **Add Environment Variable** and add these one by one:

   | Key | Value | Example |
   |-----|-------|---------|
   | `FLW_PUBLIC_KEY` | Your Flutterwave Public Key | `FLWPUBK_LIVE-xxxxx` |
   | `FLW_SECRET_KEY` | Your Flutterwave Secret Key | `FLWSECK_LIVE-xxxxx` |
   | `FLW_SECRET_HASH` | Your Webhook Secret Hash | `your_secret_hash` |
   | `CLIENT_URL` | Your Frontend URL | `https://yourapp.vercel.app` |

5. **Save Changes**
   - Click **Save Changes** button
   - Render will automatically redeploy your service

### 3. Verify Deployment

After redeployment completes:
1. Check the **Logs** tab in Render
2. Look for any error messages
3. Test a payment transaction

## Complete Environment Variables List for Render

Here's the full list of environment variables you need on Render:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cloudscape

# Authentication
JWT_SECRET=your_long_random_jwt_secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com

# Flutterwave Payment
FLW_PUBLIC_KEY=FLWPUBK_LIVE-xxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_SECRET_KEY=FLWSECK_LIVE-xxxxxxxxxxxxxxxxxxxxxxxxxx-X
FLW_SECRET_HASH=your_webhook_secret_hash

# App Configuration
CLIENT_URL=https://your-frontend-url.vercel.app
PORT=5000
NODE_ENV=production
```

## Frontend Environment Variables (Vercel)

Don't forget to add environment variables on Vercel too:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_FLW_PUBLIC_KEY=FLWPUBK_LIVE-xxxxxxxxxxxxxxxxxxxxxxxxxx-X
```

## Webhook Configuration

After deployment, configure your webhook URL on Flutterwave:

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com) → **Settings** → **Webhooks**
2. Set webhook URL to: `https://your-backend-url.onrender.com/api/payment/webhook`
3. Save changes

## Testing After Deployment

### Test Payment Flow:
1. Visit your live site
2. Add items to cart
3. Proceed to checkout
4. Complete payment with a real card (or test card in test mode)
5. Verify order appears in your orders page

### Check Backend Logs:
1. Go to Render Dashboard → Your Service → **Logs**
2. Look for payment-related logs
3. Verify no errors appear

## Common Issues & Solutions

### Issue: "Public Key required"
**Solution:** Environment variables not set on Render. Follow steps above.

### Issue: "Cannot connect to database"
**Solution:** Check `MONGO_URI` is set correctly and MongoDB Atlas allows Render's IP.

### Issue: Webhook not working
**Solution:** 
- Verify webhook URL is correct on Flutterwave Dashboard
- Check `FLW_SECRET_HASH` matches exactly
- Ensure webhook endpoint is public (not behind auth)

### Issue: Payment modal not opening
**Solution:** 
- Verify `VITE_FLW_PUBLIC_KEY` is set on Vercel
- Clear browser cache
- Check browser console for errors

## Security Checklist

Before going live:
- [ ] Using Live Keys (not Test Keys)
- [ ] All environment variables set on Render
- [ ] Frontend environment variables set on Vercel
- [ ] Webhook URL configured on Flutterwave
- [ ] MongoDB Atlas IP whitelist includes Render's IPs (or 0.0.0.0/0)
- [ ] HTTPS enabled (Render does this automatically)
- [ ] Test payment with real card
- [ ] Verify payment appears in Flutterwave Dashboard

## Support

If you continue to have issues:
1. Check Render logs for detailed error messages
2. Verify all environment variables are spelled correctly
3. Contact Flutterwave support: support@flutterwave.com
4. Check [Render Status](https://status.render.com/)
