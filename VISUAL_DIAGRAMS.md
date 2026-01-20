# PayHere Integration - Visual Diagrams

## 1. Complete Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DONATION PAYMENT FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   FRONTEND   │         │   BACKEND    │         │   PAYHERE    │
│ React App    │         │ Node.js API  │         │   Gateway    │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      │  1. User enters amount  │                         │
      │     & clicks Donate     │                         │
      │                         │                         │
      │──POST /create-payment──>│                         │
      │   (with JWT token)      │                         │
      │                         │                         │
      │                    Creates Donation               │
      │                   (status: PENDING)               │
      │                    Generates params               │
      │                         │                         │
      │<───── PayHere payload───│                         │
      │  (merchant_id, order_id,│                         │
      │   amount, items, etc)   │                         │
      │                         │                         │
      │  2. Create hidden form  │                         │
      │     with PayHere params │                         │
      │                         │                         │
      │  3. Submit form to PayHere checkout               │
      │─────────────────────────────────────────────────>│
      │                         │                         │
      │                         │    Show checkout page   │
      │                         │    User enters card     │
      │                         │                         │
      │  4. User completes payment in PayHere             │
      │                         │                         │
      │                         │    Process payment      │
      │                         │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
      │                         │    Payment successful   │
      │                         │                         │
      │                         │  5. POST /payhere-ipn   │
      │                         │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
      │                         │  (payment status)       │
      │                         │                         │
      │                    Verify signature               │
      │                    Update Donation                │
      │                    (status: SUCCESS/FAILED)       │
      │                    Store payment_id               │
      │                         │                         │
      │  6. Redirect to /donations                        │
      │<─────────────────────────│                         │
      │                         │                         │
      │  7. Display donation    │                         │
      │     with SUCCESS status │                         │
      │                         │                         │
```

---

## 2. Database State Changes

```
DONATION RECORD LIFECYCLE:

Before Payment:
┌─────────────────────────────────┐
│ user_id: "xxx"                  │
│ amount: 100                      │
│ status: "PENDING"  ⏳            │
│ paymentId: null                 │
│ createdAt: 2026-01-20           │
│ updatedAt: 2026-01-20           │
└─────────────────────────────────┘
         ↓
   User pays via PayHere
         ↓
After Successful Payment:
┌─────────────────────────────────┐
│ user_id: "xxx"                  │
│ amount: 100                      │
│ status: "SUCCESS"  ✅            │
│ paymentId: "PAY12345678"        │
│ createdAt: 2026-01-20           │
│ updatedAt: 2026-01-20T10:30:45Z │
└─────────────────────────────────┘

Or After Failed Payment:
┌─────────────────────────────────┐
│ user_id: "xxx"                  │
│ amount: 100                      │
│ status: "FAILED"  ❌             │
│ paymentId: "PAY87654321"        │
│ createdAt: 2026-01-20           │
│ updatedAt: 2026-01-20T10:30:45Z │
└─────────────────────────────────┘
```

---

## 3. API Request/Response Cycles

```
REQUEST 1: Create Payment Session
═══════════════════════════════════════════════════════════════

Client → Backend
┌─────────────────────────────────────────────────────┐
│ POST /api/donations/create-payment                  │
│ Authorization: Bearer eyJhbGc...                    │
│ Content-Type: application/json                      │
│                                                     │
│ {                                                   │
│   "amount": 100                                     │
│ }                                                   │
└─────────────────────────────────────────────────────┘
         ↓ (100ms processing)
Backend → Client
┌─────────────────────────────────────────────────────┐
│ 200 OK                                              │
│                                                     │
│ {                                                   │
│   "success": true,                                  │
│   "donationId": "507f1f77bcf86cd799439011",        │
│   "payhere": {                                      │
│     "merchant_id": "1228385",                       │
│     "order_id": "507f1f77bcf86cd799439011",        │
│     "amount": "100",                                │
│     "currency": "LKR",                              │
│     "items": "NGO Donation",                        │
│     "return_url": "http://localhost:5173/donations",│
│     "cancel_url": "http://localhost:5173/donate",   │
│     "notify_url": "http://localhost:5000/..."       │
│   }                                                 │
│ }                                                   │
└─────────────────────────────────────────────────────┘


REQUEST 2: PayHere IPN Webhook Callback
═══════════════════════════════════════════════════════════════

PayHere → Backend
┌─────────────────────────────────────────────────────┐
│ POST /api/donations/payhere-ipn                     │
│ Content-Type: application/json                      │
│                                                     │
│ {                                                   │
│   "order_id": "507f1f77bcf86cd799439011",          │
│   "payment_id": "PAY12345678",                      │
│   "amount": "100",                                  │
│   "status": "captured",                             │
│   "signature": "abc123def456..."                    │
│ }                                                   │
└─────────────────────────────────────────────────────┘
         ↓ (200ms processing)
Backend → PayHere
┌─────────────────────────────────────────────────────┐
│ 200 OK                                              │
│                                                     │
│ "OK"                                                │
└─────────────────────────────────────────────────────┘
```

---

## 4. System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ React Components                                          │  │
│  │ ├─ LandingPage (navigation)                             │  │
│  │ ├─ Donate.jsx (payment UI)                              │  │
│  │ ├─ DonationHistory (status tracking)                    │  │
│  │ └─ AdminDashboard (statistics & filters)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Express.js Server (Port 5000)                            │  │
│  │ ├─ Routes                                                │  │
│  │ │  ├─ POST /donations/create-payment (Protected)        │  │
│  │ │  └─ POST /donations/payhere-ipn (Public)              │  │
│  │ ├─ Controllers                                          │  │
│  │ │  ├─ createPayherePayment()                            │  │
│  │ │  └─ handlePayhereIPN()                                │  │
│  │ ├─ Middleware                                           │  │
│  │ │  ├─ authMiddleware (JWT verification)                 │  │
│  │ │  └─ express.json() (request parsing)                  │  │
│  │ └─ Models                                               │  │
│  │    └─ Donation Schema                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ MongoDB (Database)                                       │  │
│  │ └─ Stores donations with payment details                │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PayHere Payment Gateway                                  │  │
│  │ ├─ Sandbox: https://sandbox.payhere.lk/pay/checkout    │  │
│  │ └─ Handles payment processing & IPN callbacks           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ngrok (For Local Testing)                                │  │
│  │ └─ Exposes localhost:5000 to PayHere webhooks           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Environment & Deployment

```
LOCAL DEVELOPMENT:
═════════════════════════════════════════════════════════

┌─────────────────┐
│  Your Computer  │
├─────────────────┤
│ Frontend        │ http://localhost:5173
│ on port 5173    │
└─────────────────┘
       ↓ (calls API)
┌─────────────────┐
│ Backend         │ http://localhost:5000
│ on port 5000    │
└─────────────────┘
       ↓ (needs webhook callback)
┌─────────────────┐
│ ngrok tunnel    │ https://abc123.ngrok.io
│ Port 5000       │ ↓
└─────────────────┘ (forwards to localhost:5000)
       ↓
PayHere IPN → Webhook callback


PRODUCTION DEPLOYMENT:
═════════════════════════════════════════════════════════

┌──────────────────────┐
│   Cloud Server       │
│ (AWS/Heroku/etc)     │
├──────────────────────┤
│ Frontend (HTTPS)     │ https://yoursite.com
│ + Backend (HTTPS)    │ https://yoursite.com/api
└──────────────────────┘
       ↓
PayHere IPN → HTTPS webhook callback
       ↓
MongoDB (Cloud)
```

---

## 6. Error Handling Flow

```
┌─────────────────────────────────────────────────┐
│         ERROR SCENARIOS & HANDLING              │
└─────────────────────────────────────────────────┘

Scenario 1: Invalid Amount
┌─────────────────────┐
│ User enters -100    │
├─────────────────────┤
│ Frontend validation │  → Client-side error
└─────────────────────┘
       │
Backend validation
       │
    400 Bad Request
    "Invalid amount"


Scenario 2: Missing Authentication
┌──────────────────────┐
│ No JWT token         │
├──────────────────────┤
│ Middleware checks    │  → 401 Unauthorized
└──────────────────────┘


Scenario 3: Invalid PayHere Signature
┌──────────────────────┐
│ IPN received from    │
│ untrusted source     │
├──────────────────────┤
│ Signature check fails │  → 400 Bad Request
│ Donation stays       │     "Invalid signature"
│ PENDING              │     (not updated)
└──────────────────────┘


Scenario 4: Duplicate IPN
┌──────────────────────┐
│ Same payment_id      │
│ received twice       │
├──────────────────────┤
│ Idempotency check    │  → 200 OK
│ Returns "Already     │     (no duplicate update)
│ processed"           │
└──────────────────────┘


Scenario 5: Donation Not Found
┌──────────────────────┐
│ IPN order_id doesn't │
│ match any donation   │
├──────────────────────┤
│ Database lookup fails │  → 404 Not Found
│                       │     "Order not found"
└──────────────────────┘
```

---

## 7. State Machine: Donation Status

```
┌─────────────────────────────────────────────────────┐
│           DONATION STATUS TRANSITIONS               │
└─────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   PENDING    │
                    │   ⏳ waiting   │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ↓              ↓              ↓
    ┌─────────────┐  ┌─────────────┐
    │  SUCCESS    │  │   FAILED    │
    │  ✅ done     │  │  ❌ error    │
    └─────────────┘  └─────────────┘
            ↑              ↑
            │              │
    Payment   Payment
    captured  declined
    by PayHere by PayHere


Entry Point:
POST /api/donations/create-payment
    → Creates Donation with status = PENDING


Transition Point:
POST /api/donations/payhere-ipn (webhook)
    → Updates status based on payment result
    → status = "captured" → SUCCESS
    → status = "failed" → FAILED
```

---

## 8. Data Flow: Complete Request Chain

```
USER MAKES DONATION
    │
    ↓
┌─────────────────────────────────────────┐
│ Frontend: Donate.jsx                    │
│ ├─ Read input amount                    │
│ ├─ Get JWT token from localStorage      │
│ ├─ POST /api/donations/create-payment   │
│ │  Headers: Authorization: Bearer JWT   │
│ │  Body: { amount: 100 }                │
│ └─ Receive payhere payload              │
└─────────────────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────┐
│ Backend: POST /create-payment           │
│ ├─ authenticate (authMiddleware)        │
│ ├─ validate amount                      │
│ ├─ create Donation record               │
│ │  {                                    │
│ │   user: req.user.id,                  │
│ │   amount: 100,                        │
│ │   status: "PENDING"                   │
│ │  }                                    │
│ ├─ build payhere params                 │
│ └─ return payhere object                │
└─────────────────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────┐
│ Frontend: Create Hidden Form            │
│ ├─ Create <form> element                │
│ ├─ Add all payhere fields as <input>    │
│ ├─ action = payhere.lk endpoint         │
│ └─ form.submit()                        │
└─────────────────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────┐
│ PayHere Checkout Page                   │
│ ├─ Display payment form                 │
│ ├─ User enters card details             │
│ ├─ Process payment                      │
│ └─ Send IPN callback to return_url      │
└─────────────────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────┐
│ Backend: POST /payhere-ipn (webhook)    │
│ ├─ receive IPN data                     │
│ ├─ verify signature                     │
│ ├─ find Donation by order_id            │
│ ├─ check idempotency                    │
│ ├─ update status (SUCCESS/FAILED)       │
│ ├─ store payment_id                     │
│ └─ return 200 OK                        │
└─────────────────────────────────────────┘
            │
            ↓
┌─────────────────────────────────────────┐
│ Frontend: DonationHistory Page          │
│ ├─ Fetch donations from backend         │
│ ├─ Display donation with updated status │
│ └─ Show SUCCESS ✅ or FAILED ❌          │
└─────────────────────────────────────────┘
```

---

**These diagrams help visualize the complete PayHere integration!**
