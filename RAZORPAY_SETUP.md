# Razorpay Payment Gateway Setup

## Overview
Razorpay payment gateway has been integrated into the checkout flow. Users can now choose between Cash on Delivery (COD) or Online Payment.

## Setup Instructions

### 1. Get Razorpay Credentials

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate API keys (Key ID and Key Secret)
4. Copy both keys

### 2. Configure Environment Variables

Add these to your `backend/.env` file:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Test Mode vs Live Mode

- **Test Mode**: Use test keys from Razorpay dashboard (for development)
- **Live Mode**: Use live keys (for production)

For test payments, use these test card numbers:
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Payment Flow

### Online Payment Flow:
1. User selects "Online Payment" at checkout
2. User fills shipping details and clicks "Proceed to Payment"
3. Order is created in database with "Pending" payment status
4. Razorpay checkout modal opens
5. User completes payment
6. Payment is verified on backend
7. Order status updated to "Paid"
8. User redirected to order success page

### COD Flow:
1. User selects "Cash on Delivery" at checkout
2. User fills shipping details and clicks "Place Order"
3. Order is created with "Pending" payment status
4. User redirected to order success page

## API Endpoints

### Create Payment Order
```
POST /api/payment/create-order
Body: {
  amount: number,
  currency: 'INR',
  receipt: string,
  notes: object
}
```

### Verify Payment
```
POST /api/payment/verify-payment
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  orderId: string
}
```

## Features

- ✅ Payment method selection (COD/Online)
- ✅ Razorpay checkout integration
- ✅ Payment signature verification
- ✅ Order status updates
- ✅ Payment details stored in order
- ✅ Error handling
- ✅ Test mode support

## Security

- Payment signatures are verified on backend
- Sensitive keys stored in environment variables
- Payment details encrypted by Razorpay
- Order linked to authenticated users

## Troubleshooting

### Payment modal not opening
- Check if Razorpay script is loaded
- Verify RAZORPAY_KEY_ID is set correctly
- Check browser console for errors

### Payment verification fails
- Verify RAZORPAY_KEY_SECRET matches the key used
- Check if order ID exists in database
- Verify payment details are correct

### Test payments not working
- Ensure you're using test API keys
- Use test card numbers provided above
- Check Razorpay dashboard for payment logs

## Production Checklist

- [ ] Switch to live API keys
- [ ] Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- [ ] Test payment flow end-to-end
- [ ] Set up webhook for payment status updates (optional)
- [ ] Configure payment success/failure redirect URLs
- [ ] Test with real payment methods

## Webhook Setup (Optional)

For real-time payment status updates, set up Razorpay webhooks:

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Implement webhook handler in backend

## Support

For Razorpay issues, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)

