# PayHere Sandbox Credentials Template

## Getting Your PayHere Sandbox Credentials

### 1. Create Merchant Account
1. Go to https://www.payhere.lk/
2. Click "Merchant Registration" or "Sign Up"
3. Fill in your details
4. Complete email verification
5. Login to dashboard

### 2. Get Sandbox Credentials
From PayHere Dashboard:
- **Settings** → **API Credentials**
- You'll see:
  - **Merchant ID**: (e.g., 1228385)
  - **Merchant Secret**: (HMAC Key for signature verification)
  - **API Key**: (Optional)
  - **API Secret**: (Optional)

### 3. Update Your .env File

```env
# REPLACE THESE VALUES WITH YOUR ACTUAL CREDENTIALS
PAYHERE_MERCHANT_ID=1228385
PAYHERE_SECRET=your_actual_merchant_secret_here
PAYHERE_SANDBOX_URL=https://sandbox.payhere.lk/pay/checkout
PAYHERE_RETURN_URL=http://localhost:5173/donations
PAYHERE_CANCEL_URL=http://localhost:5173/donate
PAYHERE_NOTIFY_URL=https://your-ngrok-url.ngrok.io/api/donations/payhere-ipn
```

### 4. Test Cards Available

These cards work in sandbox mode only:

#### ✅ Successful Payment
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: 12/25 (or any future date)
- **CVC**: 123
- **Result**: Payment captured

#### ❌ Failed Payment
- **Card Number**: 4000 0000 0000 0002
- **Expiry**: 12/25 (or any future date)
- **CVC**: 123
- **Result**: Payment declined

---

## Important Security Notes

⚠️ **NEVER commit `.env` to GitHub**
- Add to `.gitignore`: 
  ```
  .env
  .env.local
  ```

⚠️ **NEVER expose PAYHERE_SECRET in frontend code**
- Keep all merchant secrets on backend only

⚠️ **Rotate credentials periodically**
- Update PAYHERE_SECRET in dashboard quarterly

⚠️ **Use HTTPS in production**
- PayHere requires HTTPS URLs

---

## Backend Webhook Signature Verification

PayHere sends a signature with each IPN webhook. Current implementation:

```javascript
// Signature is computed as:
const hash = crypto
  .createHmac("sha256", PAYHERE_SECRET)
  .update(`${order_id}${payment_id}${amount}${status}`)
  .digest("hex");

// Compare with ipn.signature
if (ipn.signature !== hash) {
  // Invalid signature - reject
}
```

⚠️ **Verify PayHere's exact signature format** in their latest documentation
- The order of fields may differ
- Some fields might be included/excluded

---

## Testing Workflow

### 1️⃣ Local Testing (Development)
```
Browser → Frontend (localhost:5173)
  → Backend (localhost:5000)
  → ngrok tunnel (ngrok http 5000)
  → PayHere Sandbox (sandbox.payhere.lk)
  → IPN Webhook → Backend (ngrok URL)
  → Update Database
```

### 2️⃣ Staging Testing (Before Demo)
```
Browser → Frontend (staging.yoursite.com)
  → Backend (staging.yoursite.com/api)
  → PayHere Sandbox
  → IPN Webhook → Backend (/api/donations/payhere-ipn)
  → Update Database
```

### 3️⃣ Production (After Approval)
```
Browser → Frontend (yoursite.com)
  → Backend (yoursite.com/api)
  → PayHere Live (payhere.lk)
  → IPN Webhook → Backend (/api/donations/payhere-ipn)
  → Update Database
```

---

## Payment Flow Logging

All IPN events are logged in backend console:

```javascript
console.log("PayHere IPN received:", ipn);
console.log(`Donation ${donation._id} updated to ${donation.status}`);
```

Watch backend terminal during testing to verify payment processing.

---

## FAQ

**Q: Can I use the same sandbox merchant ID for multiple projects?**
A: Yes, use the same MERCHANT_ID but keep NOTIFY_URL different for each project.

**Q: Do I need to deploy to test PayHere integration?**
A: No! Use ngrok to expose your local backend. PayHere will call your webhook.

**Q: How long does IPN webhook take?**
A: Usually 1-5 seconds after payment completion.

**Q: What if IPN webhook fails?**
A: PayHere retries 3-5 times. Ensure your webhook is idempotent.

**Q: Can I test without ngrok?**
A: Only if your backend is already deployed with HTTPS.

---

## Sample .env (Complete)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_jwt_secret_key_here

# PayHere Sandbox
PAYHERE_MERCHANT_ID=1228385
PAYHERE_SECRET=your_merchant_secret_key_from_dashboard
PAYHERE_SANDBOX_URL=https://sandbox.payhere.lk/pay/checkout

# Return URLs
PAYHERE_RETURN_URL=http://localhost:5173/donations
PAYHERE_CANCEL_URL=http://localhost:5173/donate

# Webhook URL (use ngrok during development)
PAYHERE_NOTIFY_URL=https://your-ngrok-generated-url.ngrok.io/api/donations/payhere-ipn
```

---

**Ready to test? Follow QUICK_START_PAYHERE.md! 🚀**
