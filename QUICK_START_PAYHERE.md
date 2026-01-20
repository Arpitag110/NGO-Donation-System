# Quick Start: PayHere Testing (5 Minutes)

## Prerequisites
- Node.js running backend & frontend
- ngrok installed (https://ngrok.com/download)

---

## Step-by-Step Setup

### 1️⃣ Start ngrok (Expose Backend)
```bash
# In a new terminal
ngrok http 5000

# You'll see output like:
# Forwarding  https://abc123.ngrok.io -> http://localhost:5000
```
**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

---

### 2️⃣ Update Backend .env
Edit `backend/.env` and update:

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...

# PayHere Sandbox Configuration
PAYHERE_MERCHANT_ID=1228385
PAYHERE_SECRET=your_merchant_secret_key_here
PAYHERE_SANDBOX_URL=https://sandbox.payhere.lk/pay/checkout
PAYHERE_RETURN_URL=http://localhost:5173/donations
PAYHERE_CANCEL_URL=http://localhost:5173/donate
PAYHERE_NOTIFY_URL=https://abc123.ngrok.io/api/donations/payhere-ipn
```

Replace `abc123.ngrok.io` with your actual ngrok URL.

---

### 3️⃣ Start Backend
```bash
cd backend
npm run dev
```

Backend should start on `http://localhost:5000`

---

### 4️⃣ Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

Frontend should start on `http://localhost:5173`

---

## Test Payment Flow

### Step 1: Login
1. Go to http://localhost:5173
2. Click "Login" (or "Donate Now" → redirects to login)
3. Login with test account

### Step 2: Make Donation
1. Click "Donate" in navbar
2. Enter amount: **100**
3. Click "Donate Now"
4. You'll be redirected to PayHere checkout page

### Step 3: Complete Payment (Sandbox)
1. On PayHere checkout page:
   - **Card Number**: `4111111111111111`
   - **Expiry**: `12/25`
   - **CVC**: `123`
2. Click "Pay" or "Confirm"

### Step 4: Check Result
1. You'll be redirected to http://localhost:5173/donations
2. Your donation should show:
   - **Amount**: ₹100
   - **Status**: **SUCCESS** ✅ (or FAILED if you used test failure card)
   - **Date**: Today's date

---

## Test Cards

| Card Type | Card Number | Expiry | CVC |
|-----------|------------|--------|-----|
| ✅ SUCCESS | 4111111111111111 | 12/25 | 123 |
| ❌ FAILURE | 4000000000000002 | 12/25 | 123 |

---

## Verify Everything Works

### ✅ Checklist
- [ ] Backend running on 5000
- [ ] Frontend running on 5173
- [ ] ngrok exposing to PayHere
- [ ] Login successful
- [ ] Donate page loads
- [ ] PayHere checkout page opens when clicking "Donate Now"
- [ ] Payment successful with test card
- [ ] Donation shows "SUCCESS" in DonationHistory

---

## If Payment Doesn't Update to SUCCESS

### Debug Steps:
1. **Check Backend Logs** - Look for "PayHere IPN received"
   ```bash
   # In backend terminal, you should see:
   # PayHere IPN received: { order_id: '...', status: 'captured', ... }
   # Donation ... updated to SUCCESS with payment ...
   ```

2. **Verify ngrok URL** - Is it in `.env`? Run ngrok again if it expired.

3. **Check Donation in MongoDB**
   ```bash
   # See if paymentId and status were updated
   db.donations.findOne({ _id: ObjectId("...") })
   ```

4. **Test IPN Manually** (curl):
   ```bash
   curl -X POST http://localhost:5000/api/donations/payhere-ipn \
     -H "Content-Type: application/json" \
     -d '{
       "order_id": "DONATION_ID_HERE",
       "payment_id": "test_123",
       "amount": "100",
       "status": "captured"
     }'
   ```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "PayHere checkout won't open" | Check PAYHERE_MERCHANT_ID in .env |
| "Donation still PENDING after payment" | Check ngrok is running & URL in .env is correct |
| "ngrok URL expired" | Restart ngrok (you'll get a new URL) and update .env |
| "Invalid signature error" | Verify PAYHERE_SECRET matches your merchant secret |
| "Order not found" | Check donation ID matches donation._id |

---

## Admin Dashboard Verification

After successful payment:
1. Login as ADMIN
2. Go to `/admin`
3. Check "Donations" table → Should show:
   - ✅ Status: SUCCESS (green badge)
   - ✅ Payment ID: (PayHere payment ID)
   - ✅ Filters working (Status, Date Range)
4. Check charts → "Success Rate" should increase

---

## Ready? 

Go test it! 🚀

**Timeline:** ~5 minutes to complete payment from start to finish
