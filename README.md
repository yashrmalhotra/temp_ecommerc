# 🛍️ Great Mart – Fullstack E-Commerce App

[🌐 Live Site](https://greatmart.vercel.app)
### 👉 Docker Hub Image
📦 [`yashrmalhotra/greatmart`](https://hub.docker.com/r/yashrmalhotra/greatmart)


Great Mart is a feature-rich, scalable fullstack multi-vendor e-commerce platform built with cutting-edge tools like **Next.js App Router**, **MongoDB**, **Redis**, **Docker**, **Cashfree** (for payments), and **Inngest** (for background job queues and events). Inspired by platforms like Amazon and Flipkart, it supports multi-item checkout, real-time notifications, background order processing, and more.

---

## 🧪 Test Credentials

Use the following test account to explore both **buyer** and **seller** routes:

Email: johndoe@gmail.com  
Password: john1234


## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, MongoDB, Redis, Inngest, Cashfree PG
- **Queue/Event Processing:** Inngest 
- **Payments:** Cashfree (Netbanking)
- **DevOps:** Docker, Docker Compose, Vercel
- **Others:** Redis Insight (local), TypeScript, Mongoose

---

## 📸 Features

✅ User Authentication with NextAuth  
✅ Product listing and search  
✅ Product detail page with reviews  
✅ Add to cart & multi-item checkout  
✅ Cashfree payment gateway integration  
✅ Saved addresses and Razorpay/Cashfree tokens  
✅ Background order processing with Inngest  
✅ Real-time seller notifications via SSE  
✅ Admin/seller dashboards  
✅ Responsive & mobile-first design

---

## 📁 Folder Structure

ecommerce/
├── app/ # Next.js App Router pages and API routes
├── components/ # UI components (product cards, navbars, etc.)
├── inngest/ # Inngest server and background functions
├── models/ # MongoDB/Mongoose schemas
├── public/ # Static assets like images, favicon
├── styles/ # Tailwind/global CSS
├── utill/ # Utility functions (connectDB, Redis, SSE handlers, etc.)
├── Types/ # TypeScript types and interfaces
├── .env.local # Environment variables for development
├── docker-compose.yml # Docker Compose for local dev
├── Dockerfile # Docker container
└── README.md

## 🔐 Environment Variables

> Create a `.env.local` in your root directory.

```env
####################################
# Database & Auth
####################################
MONGO_URI=mongodb://mongo:27017/Ecommerce?replicaSet=rs0
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

####################################
# Redis (Aiven or Docker)
####################################
REDIS_URL=rediss://default:<password>@<host>:<port>
# For local Redis (Docker):
# REDIS_URL=redis://localhost:6379

####################################
# Cashfree Payment Gateway
####################################
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret
CASHFREE_ENV=TEST

####################################
# Google OAuth
####################################
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret

####################################
# Imagekit.io
####################################
IMAGEKITIO_PUBLIC_KEY=public_secret
IMAGEKITIO_PRIVATE_KEY=private_secret
IMAGEKITIO_URL_ENDPOINT="https://ik.imagekit.io/your_imagekit_id/id"

####################################
# Inngest
####################################
INNGEST_BASE_URL=http://inngest-dev:8288/api/inngest
INNGEST_EVENT_KEY=your_event_key_from_inngest
INNGEST_SIGNING_KEY=
INNGEST_DEV=1

```
