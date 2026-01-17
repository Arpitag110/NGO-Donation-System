# NGO Registration and Donation Management System

A backend-driven system built for NGOs to manage user registrations and donation tracking with transparency, security, and ethical payment handling.

This project was developed as part of the NSS Development Project and focuses on separating user registration from donation flow to ensure data integrity and accurate administrative visibility.

---

## Features

### Authentication & Authorization
- User and Admin login/register
- JWT-based authentication
- Role-based access control (USER / ADMIN)

### User Features
- User registration independent of donation
- Optional donation with any amount
- Donation attempt tracking
- View personal donation history
- Secure access using JWT

### Donation Management
- Donation statuses: `PENDING`, `SUCCESS`, `FAILED`
- Ethical handling of payment confirmation
- No fake or forced success logic
- Each donation attempt is stored

### Admin Dashboard
- View total users and registrations
- View all donation records
- Track donation statuses and timestamps
- View aggregated donation amount
- Admin-only protected APIs

---

## System Architecture

The project follows the **MVC (Model–View–Controller)** architecture:

- **Models**: MongoDB schemas (User, Registration, Donation)
- **Controllers**: Business logic
- **Routes**: API endpoints
- **Middleware**: Authentication & authorization

Registration data is stored independently of donation data, ensuring user information is preserved even if a payment fails.

---

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)

**Frontend**
- React.js

**Tools**
- Postman (API testing)
- Git & GitHub

---

## API Routes Overview

### Auth Routes
POST /api/auth/register
POST /api/auth/login

### Registration Routes (Protected)
POST /api/registration
GET /api/registration/me

### Donation Routes (Protected)
POST /api/donations
POST /api/donations/update
GET /api/donations/me

### Admin Routes (Admin Only)
GET /api/admin/stats
GET /api/admin/registrations
GET /api/admin/donations

---

## How to Run Locally

1. Clone the repository
```bash
git clone <your-repo-url>
Install dependencies
npm install
Create .env file
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
Run the server
npm run dev
Server will start at:
http://localhost:5000

Demo & Report
A demo video showcasing user and admin flows will be provided.

A detailed PDF report explaining system architecture, database schema, and design decisions is included as part of the submission.

Author
Arpit Agarwal
NSS Development Project
Indian Institute of Technology Roorkee