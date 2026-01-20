# PayHere Integration - Code Reference

## Quick Code Lookup

### Backend Controller Functions

#### `createPayherePayment(req, res)`
**Location:** `/backend/controllers/donationController.js:54-94`

**Purpose:** Creates a payment session and returns PayHere payload

**Request:**
```javascript
POST /api/donations/create-payment
{
  "amount": 100
}
```

**Response:**
```javascript
{
  "success": true,
  "donationId": "507f1f77bcf86cd799439011",
  "payhere": {
    "merchant_id": "1228385",
    "order_id": "507f1f77bcf86cd799439011",
    "amount": "100",
    "currency": "LKR",
    ...
  }
}
```

**Key Logic:**
1. Validate amount > 0
2. Create Donation with status PENDING
3. Build PayHere payload
4. Return payload to frontend

---

#### `handlePayhereIPN(req, res)`
**Location:** `/backend/controllers/donationController.js:96-160`

**Purpose:** Webhook handler that receives payment status from PayHere

**Request (from PayHere):**
```javascript
POST /api/donations/payhere-ipn
{
  "order_id": "507f1f77bcf86cd799439011",
  "payment_id": "PAY12345678",
  "amount": "100",
  "status": "captured",
  "signature": "hash..."
}
```

**Key Logic:**
1. Verify signature if SECRET exists
2. Find donation by order_id
3. Check idempotency (no duplicate updates)
4. Update status: "captured" → SUCCESS, others → FAILED
5. Store paymentId
6. Return 200 OK

---

### Frontend Implementation

#### Donate.jsx Payment Flow
**Location:** `/frontend/src/pages/Donate.jsx`

**Key Changes:**
1. Import useNavigate hook
2. Add loading state
3. Create async handleDonate function
4. Call `/api/donations/create-payment`
5. Build hidden form with PayHere payload
6. Submit form to PayHere

**Code Snippet:**
```jsx
const handleDonate = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Call backend to create payment
  const res = await fetch(`${API_BASE_URL}/donations/create-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount: parseFloat(amount) }),
  });

  const data = await res.json();

  // Create and submit form to PayHere
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://sandbox.payhere.lk/pay/checkout";
  
  Object.entries(data.payhere).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
```

---

### Configuration Files

#### .env (Backend)
**Location:** `/backend/.env`

**PayHere Variables:**
```env
# Merchant Credentials
PAYHERE_MERCHANT_ID=1228385
PAYHERE_SECRET=your_merchant_secret_from_dashboard

# URLs
PAYHERE_SANDBOX_URL=https://sandbox.payhere.lk/pay/checkout
PAYHERE_RETURN_URL=http://localhost:5173/donations
PAYHERE_CANCEL_URL=http://localhost:5173/donate
PAYHERE_NOTIFY_URL=http://localhost:5000/api/donations/payhere-ipn
```

**Note:** Update PAYHERE_NOTIFY_URL with ngrok URL during local testing

---

### Route Configuration

#### Donation Routes
**Location:** `/backend/routes/donationRoutes.js`

**New Routes Added:**
```javascript
// Create payment session (Protected)
router.post("/create-payment", protect, createPayherePayment);

// PayHere IPN webhook (Public)
router.post("/payhere-ipn", express.json(), handlePayhereIPN);
```

---

## Signature Verification Logic

**Location:** `/backend/controllers/donationController.js:108-118`

```javascript
// Verify signature if secret exists
if (process.env.PAYHERE_SECRET && ipn.signature) {
  const hash = crypto
    .createHmac("sha256", process.env.PAYHERE_SECRET)
    .update(`${ipn.order_id}${ipn.payment_id}${ipn.amount}${ipn.status}`)
    .digest("hex");

  if (ipn.signature !== hash) {
    console.warn("Invalid PayHere IPN signature");
    return res.status(400).send("Invalid signature");
  }
}
```

---

## Payment Status Update Logic

**Location:** `/backend/controllers/donationController.js:130-135`

```javascript
// Update donation status based on PayHere response
donation.status = ipn.status === "captured" || ipn.status === "success" 
  ? "SUCCESS" 
  : "FAILED";

donation.paymentId = ipn.payment_id;
donation.updatedAt = new Date();
await donation.save();
```

---

## Idempotency Check

**Location:** `/backend/controllers/donationController.js:123-127`

```javascript
// Don't process if already processed with same payment
if (donation.paymentId === ipn.payment_id) {
  console.log(`Already processed payment: ${ipn.payment_id}`);
  return res.status(200).send("Already processed");
}
```

**Purpose:** Prevents duplicate updates if PayHere retries the IPN callback

---

## Testing Scenarios

### Scenario 1: Successful Payment
**Cards:** 4111111111111111
**Expected Status:** SUCCESS

**Logs:**
```
PayHere IPN received: { order_id: '...', status: 'captured', ... }
Donation ... updated to SUCCESS
```

### Scenario 2: Failed Payment
**Card:** 4000000000000002
**Expected Status:** FAILED

**Logs:**
```
PayHere IPN received: { order_id: '...', status: 'failed', ... }
Donation ... updated to FAILED
```

### Scenario 3: Duplicate IPN
**Expected:** No duplicate update, returns "Already processed"

**Logs:**
```
Already processed payment: PAY12345678
```

---

## Environment Variables Required

| Variable | Purpose | Example |
|----------|---------|---------|
| PAYHERE_MERCHANT_ID | Your PayHere merchant ID | 1228385 |
| PAYHERE_SECRET | HMAC key for signature | abc123xyz789... |
| PAYHERE_NOTIFY_URL | Webhook endpoint | https://abc123.ngrok.io/api/donations/payhere-ipn |
| PAYHERE_RETURN_URL | Success redirect | http://localhost:5173/donations |
| PAYHERE_CANCEL_URL | Cancel redirect | http://localhost:5173/donate |

---

## Error Handling

### Client Side (Frontend)
```javascript
if (!res.ok) {
  setMessage(data.message || "Payment setup failed");
  setLoading(false);
  return;
}
```

### Server Side (Backend)
```javascript
// Validation
if (!amount || amount <= 0) {
  return res.status(400).json({ message: "Invalid amount" });
}

// Donation not found
if (!donation) {
  console.error(`Donation not found: ${ipn.order_id}`);
  return res.status(404).send("Order not found");
}

// Signature invalid
if (ipn.signature !== hash) {
  console.warn("Invalid PayHere IPN signature");
  return res.status(400).send("Invalid signature");
}
```

---

## Database Changes

**Donation Model** (No changes needed)
```javascript
{
  user: ObjectId,
  amount: Number,
  status: String, // "PENDING" → "SUCCESS" or "FAILED"
  paymentId: String, // Stores PayHere payment_id
  createdAt: Date,
  updatedAt: Date
}
```

---

## Flow Visualization

```
FRONTEND                           BACKEND                        PAYHERE
─────────────────────────────────────────────────────────────────────────

User enters amount
Click "Donate Now"
        │                          
        ├─────POST /create-payment──────>  Create Donation (PENDING)
        │                          Return PayHere params
        <──────payhere payload─────────────
        │
Create hidden form
Submit form to PayHere
        │                                           │
        ├───────── Redirect to checkout ────────>  │ Show payment page
        │                                           │
        │                                User enters card
        │                                Click pay
        │                                Process payment
        │
        │<──────────── Redirect to /donations ─────
        │           (after payment)
        │                            │
        │                    POST /payhere-ipn
        │                    payment status
        <─────────────────<─────────┤
        │                          │
Show status                   Verify signature
(SUCCESS/FAILED)              Update Donation
                              paymentId = payment_id
```

---

## Debugging Checklist

- [ ] PAYHERE_MERCHANT_ID correct in .env?
- [ ] PAYHERE_SECRET correct in .env?
- [ ] ngrok running and URL in .env?
- [ ] Backend restarted after .env changes?
- [ ] Frontend calling correct endpoint?
- [ ] PayHere sandbox page opening?
- [ ] Backend logs showing IPN received?
- [ ] Donation updated in database?

---

## File Locations Quick Reference

| Component | File |
|-----------|------|
| Payment creation | `/backend/controllers/donationController.js:54-94` |
| IPN handler | `/backend/controllers/donationController.js:96-160` |
| Routes | `/backend/routes/donationRoutes.js` |
| .env vars | `/backend/.env` |
| Frontend form | `/frontend/src/pages/Donate.jsx:45-75` |
| Payment flow | `/frontend/src/pages/Donate.jsx:12-44` |

---

**Last Updated:** January 20, 2026
**Status:** Ready for testing 🚀
