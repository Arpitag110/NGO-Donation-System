# PayHere Sandbox Integration Setup Guide

## Overview
Complete PayHere sandbox payment integration for your NGO donation system. Payments will go from PENDING → SUCCESS/FAILED based on PayHere payment status.

---

## Backend Changes ✅ COMPLETED

### 1. **Updated: `/backend/controllers/donationController.js`**
- ✅ Added `createPayherePayment()` - Creates donation + returns PayHere params
- ✅ Added `handlePayhereIPN()` - Public webhook to receive payment status from PayHere

### 2. **Updated: `/backend/routes/donationRoutes.js`**
- ✅ Added `POST /create-payment` (protected) - For creating PayHere payments
- ✅ Added `POST /payhere-ipn` (public) - For PayHere webhook callbacks

### 3. **Updated: `/backend/.env`**
```env
PAYHERE_MERCHANT_ID=1228385
PAYHERE_SECRET=your_merchant_secret_key_here
PAYHERE_SANDBOX_URL=https://sandbox.payhere.lk/pay/checkout
PAYHERE_RETURN_URL=http://localhost:5173/donations
PAYHERE_CANCEL_URL=http://localhost:5173/donate
PAYHERE_NOTIFY_URL=http://localhost:5000/api/donations/payhere-ipn
```

---

## Frontend Changes ✅ COMPLETED

### Updated: `/frontend/src/pages/Donate.jsx`
- ✅ Calls `/api/donations/create-payment` to initiate payment
- ✅ Receives PayHere payload
- ✅ Auto-redirects user to PayHere sandbox checkout page
- ✅ User completes payment → PayHere calls backend webhook → Status updates to SUCCESS/FAILED

---

## How It Works (Flow Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER DONATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. User enters amount on Donate page
   ↓
2. Click "Donate Now" → Calls POST /api/donations/create-payment
   ↓
3. Backend creates Donation with status = PENDING
   Returns PayHere payment params (merchant_id, order_id, amount, etc.)
   ↓
4. Frontend creates hidden form with PayHere params
   Form submits to: https://sandbox.payhere.lk/pay/checkout
   ↓
5. User sees PayHere checkout page (sandbox mode)
   Enters test payment details
   ↓
6. PayHere processes payment
   ↓
7. PayHere POSTs IPN callback to: /api/donations/payhere-ipn
   (Backend webhook endpoint)
   ↓
8. Backend verifies signature & updates Donation:
   - If payment successful → status = SUCCESS ✅
   - If payment failed → status = FAILED ❌
   ↓
9. User redirected to /donations page (from return_url)
   Sees donation with updated status
   ↓
10. DonationHistory table shows: Amount, Status (SUCCESS/FAILED), Date
```

---

## Testing Locally (IMPORTANT!)

### Step 1: Get PayHere Sandbox Credentials
1. Go to: https://www.payhere.lk/
2. Create a merchant account (sandbox)
3. Get your:
   - **Merchant ID** (e.g., 1228385)
   - **Merchant Secret** (HMAC key for verification)

### Step 2: Expose Local Backend to PayHere (ngrok)
PayHere needs to call your `/api/donations/payhere-ipn` webhook.
Since you're developing locally, use ngrok:

```bash
# Install ngrok (if not already installed)
# Download from: https://ngrok.com/download

# Run ngrok to expose your backend
ngrok http 5000

# You'll get a URL like: https://abc123.ngrok.io
# Update .env:
PAYHERE_NOTIFY_URL=https://abc123.ngrok.io/api/donations/payhere-ipn
```

### Step 3: Update `.env` with Your Credentials
```env
PAYHERE_MERCHANT_ID=your_sandbox_merchant_id
PAYHERE_SECRET=your_sandbox_merchant_secret
PAYHERE_NOTIFY_URL=https://your-ngrok-url.ngrok.io/api/donations/payhere-ipn
```

### Step 4: Start Backend & Frontend
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Step 5: Test Payment Flow
1. Go to http://localhost:5173 (landing page)
2. Click "Donate Now" → Login
3. Go to /donate
4. Enter amount (e.g., 100)
5. Click "Donate Now" → Redirected to PayHere checkout
6. Use PayHere sandbox test card:
   - **Card Number**: 4111111111111111
   - **CVC**: 123
   - **Expiry**: Any future date
7. Complete payment
8. Check /donations page → Donation status should be **SUCCESS** ✅

---

## Test Payment Cards (PayHere Sandbox)

| Status | Card Number | CVC | Expiry |
|--------|------------|-----|--------|
| SUCCESS | 4111111111111111 | 123 | 12/25 |
| FAILURE | 4000000000000002 | 123 | 12/25 |

---

## Backend API Endpoints

### 1. Create Payment (Protected)
```http
POST /api/donations/create-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 100
}

Response:
{
  "success": true,
  "donationId": "507f1f77bcf86cd799439011",
  "payhere": {
    "merchant_id": "1228385",
    "order_id": "507f1f77bcf86cd799439011",
    "amount": "100",
    "currency": "LKR",
    "items": "NGO Donation",
    "return_url": "http://localhost:5173/donations",
    "cancel_url": "http://localhost:5173/donate",
    "notify_url": "https://abc123.ngrok.io/api/donations/payhere-ipn"
  }
}
```

### 2. PayHere IPN Webhook (Public)
```http
POST /api/donations/payhere-ipn
Content-Type: application/json

{
  "order_id": "507f1f77bcf86cd799439011",
  "payment_id": "12345678",
  "amount": "100",
  "status": "captured",
  "signature": "hash..."
}

Response: 200 OK
```

---

## Troubleshooting

### "Invalid signature" Error
- Make sure `PAYHERE_SECRET` in `.env` matches your PayHere merchant secret
- PayHere signature format may differ; check their latest documentation

### IPN Not Being Called
- Ensure ngrok is running: `ngrok http 5000`
- Update `PAYHERE_NOTIFY_URL` with correct ngrok URL
- Check backend logs: `console.log("PayHere IPN received:", ipn)`

### Donation Status Still PENDING
- Check backend logs for IPN webhook call
- Verify ngrok URL is accessible from PayHere
- Test with curl to simulate PayHere webhook:
```bash
curl -X POST http://localhost:5000/api/donations/payhere-ipn \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "your_donation_id",
    "payment_id": "test_payment",
    "amount": "100",
    "status": "captured",
    "signature": ""
  }'
```

---

## Key Features Implemented

✅ **Secure Payment Flow**
- User amount → Backend creates donation → PayHere redirect
- Payment verification via IPN webhook
- Idempotent webhook processing (no duplicate updates)

✅ **Status Tracking**
- PENDING: Waiting for payment
- SUCCESS: Payment confirmed
- FAILED: Payment declined

✅ **Real-time Updates**
- DonationHistory shows latest status
- AdminDashboard shows payment statistics

✅ **Logging**
- All IPN events logged for debugging
- Payment ID tracked in donation record

---

## Next Steps After Testing

1. **Before College Presentation:**
   - Use real PayHere sandbox credentials
   - Test full flow multiple times
   - Verify payment success/failure handling

2. **For Production (Later):**
   - Switch `PAYHERE_SANDBOX_URL` to live URL
   - Use live merchant credentials
   - Implement HTTPS enforcement
   - Add payment receipt email notifications

---

## Important Notes

⚠️ **NEVER** expose `PAYHERE_SECRET` in frontend code
⚠️ Keep `.env` file in `.gitignore`
⚠️ Test with sandbox credentials before going live
⚠️ Always verify payment signature in webhook
⚠️ Ensure ngrok URL is accessible during testing

---

## Support URLs

- PayHere Sandbox: https://sandbox.payhere.lk/
- PayHere Documentation: https://www.payhere.lk/
- ngrok Documentation: https://ngrok.com/docs

---

**All files have been updated. Ready to test! 🚀**
