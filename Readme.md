# 📦 Subscription Microservice Backend (Node.js + PostgreSQL + Redis)

A production-style backend microservice for managing user subscriptions to SaaS plans. Built with **Node.js**, **Express**, **PostgreSQL**, **Redis (Pub/Sub)**, **JWT**, and **Nodemailer**, this project includes both core functionality and advanced microservices features like asynchronous email notifications and cron-based subscription expiry.

---

## 🚀 Features

* User Registration & Login (JWT in HttpOnly cookies)
* Subscription Plan Management (Admin-side)
* One Active Subscription per User
* Auto-expiry of subscriptions using cron jobs
* Asynchronous email notifications using Redis Pub/Sub + Nodemailer
* MVC-based project structure for scalability and maintainability

---

## ⚙️ Tech Stack

* **Node.js** (Express)
* **PostgreSQL** (via `pg`)
* **Redis** for Pub/Sub (via `redis` package)
* **JWT** for authentication
* **Bcrypt** for password hashing
* **Nodemailer** for email delivery
* **node-cron** for scheduled background tasks
* **Railway** for cloud PostgreSQL and Redis

---

## 📁 Project Structure

```
├── controllers/         # Route logic (auth, plans, subscriptions)
├── models/              # DB queries
├── routes/              # Route definitions
├── middlewares/         # JWT auth
├── utils/               # Mail service & Query utility
├── config/              # DB
├── redis/               # Redis setup & publisher/subscriber setup
├── cronJobs/            # Auto-expiry logic
├── app.js               # Express app config
├── server.js            # Entry point
├── .env                 # Environment variables
└── README.md
```

---

## 🔐 Authentication

* User registers via `POST /auth/register`
* Login via `POST /auth/login` returns a JWT token stored in an **HttpOnly cookie**
* `authMiddleware.js` protects all private routes

### JWT Cookie Example

```
Set-Cookie: token=eyJhbGci...; HttpOnly; Path=/; Max-Age=7200
```

---

## 📦 Plan Management (Admin-Only)

| Endpoint | Method | Auth Required | Description                                         |
| -------- | ------ | ------------- | --------------------------------------------------- |
| `/plans` | GET    | ❌             | List all available plans                            |
| `/plans` | POST   | ✅             | Add a new plan (name, price, features\[], duration) |

Each plan includes:

* `name`: e.g. "Pro"
* `price`: decimal (e.g. 19.99)
* `features`: JSON array (e.g. `["Unlimited usage", "Priority support"]`)
* `duration`: Number of days the plan lasts

---

## 📃 Subscription Management

| Endpoint                 | Method | Auth | Description                         |
| ------------------------ | ------ | ---- | ----------------------------------- |
| `/subscriptions`         | POST   | ✅    | Subscribe to a plan                 |
| `/subscriptions/:userId` | GET    | ✅    | Get current active subscription     |
| `/subscriptions/:userId` | PUT    | ✅    | Change/upgrade current subscription |
| `/subscriptions/:userId` | DELETE | ✅    | Cancel subscription                 |

### 🛑 Assumption:

> A user can only have **one active subscription** at a time.

This is enforced both in logic and by auto-expiry (see below).

---

## ⏰ Auto-Expiry with Cron

Using `node-cron`, a background job runs **every minute**:

```sql
UPDATE subscriptions
SET status = 'EXPIRED'
WHERE status = 'ACTIVE' AND end_date < NOW();
```

📄 Location: `cronJobs/expireSubscriptions.js`

This ensures subscriptions expire exactly when their duration ends.

---

## 📨 Redis Pub/Sub + Nodemailer

The project uses Redis Pub/Sub to simulate asynchronous, event-driven microservices.

### Events Published:

* `subscription_created`
* `upgraded_subscription`
* `cancelled_subscription`

Each event contains:

```json
{
  "type": "Subscription Created",
  "userId": "uuid",
  "plan_name": "Pro"
}
```

### Email Flow:

* `publisher` (in controllers) sends event to Redis
* `subscriber` (background service) listens to events
* `sendWelcomeEmail()` (using Nodemailer) sends emails to users

📄 Location: `utils/sendMail.js`, `redis/redisClient.js`, `subscriber.js`

---

## 🌐 Environment Variables (`.env`)

```
PORT=5000
DATABASE_URL=postgresql://...  # Railway PostgreSQL
JWT_SECRET=your_jwt_secret

REDIS_URL=redis://:password@host:port

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

---

## 🚀 How to Run Locally

1. Clone repo: `git clone ...`
2. Install deps: `npm install`
3. Set up `.env` file
4. Start dev server: `npm run dev`
5. Test APIs using Postman

Redis and PostgreSQL should be live on Railway or your local machine.

---

## ✅ Final Notes

* Cron jobs and Redis Pub/Sub run in background on `server.js` startup
* Project follows microservice patterns while keeping everything in a single backend codebase
* Easily extendable to full microservice deployment

---

## 🙌 Author

**Ravi Mani** — backend engineer in the making! 🚀
