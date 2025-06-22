# E-Commerce Customer Portal

This is a full-stack e-commerce web application designed for **customers** to browse, search, and purchase products. This application includes user authentication, product search and filtering, cart management, and Razorpay-based payment gateway.

---

## Features

- Customer and Vendor Login/Signup
- Product listing with price and search functionality
- Product detail view with description
- Cart system to add/remove products
- Checkout system with address storage
- Razorpay integration for secure payments

---

## UI Flow

1. **Login / Signup Page**
2. **Homepage**
   - Product grid view with prices
   - Search bar to filter products
3. **Product Detail Page**
   - Shows product image, name, and description
4. **Cart Page**
   - Add to cart / Remove from cart
5. **Checkout Page**
   - Ask for address (if first-time user)
   - Proceed to payment using Razorpay

---

## Tech Stack

### Frontend:
- React
- Axios
- React Router

### Backend:
- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL

### Payment:
- Razorpay

---

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm 

---

## Installation

### Backend Setup

```bash
cd backend
npm install
node App.js

cd ..

cd frontend
npm install
npm start


