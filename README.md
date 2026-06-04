# Productr — Product Listing Platform

A full-stack web application for managing and publishing product listings, built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend**: React.js, React Router v6, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: OTP-based login (email/phone), JWT sessions

---

## Project Structure

```
productr/
├── client/          # React frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level pages
│       ├── hooks/        # Auth & Toast context
│       └── utils/        # Axios instance
└── server/          # Express backend
    ├── models/       # Mongoose schemas
    ├── routes/       # API route handlers
    └── middleware/   # JWT auth middleware
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

**Required environment variables** (see `server/.env.example`):

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | `development` or `production` |

---

### Frontend Setup

```bash
cd client
npm install
# Create .env file:
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

The app will open at `http://localhost:3000`.

---

## Features

### Authentication
- OTP-based login (email or phone number)
- JWT session management
- Auto-redirect based on auth state
- 6-digit OTP input with auto-focus, paste support
- Resend OTP with 20-second cooldown
- In development, the OTP is shown on screen

### Products
- Create products with: name, type, stock, MRP, selling price, brand, images, return eligibility
- Upload multiple product images
- Edit and update existing products
- Delete with confirmation dialog
- Publish / Unpublish toggle
- View published vs unpublished products (Home page tabs)
- All products view (Products page)

### UI
- Pixel-perfect implementation of Figma design
- Toast notifications for all actions
- Loading states and error handling throughout
- Responsive layout (desktop + mobile)

---

## API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Send OTP to email/phone |
| POST | `/api/auth/verify-otp` | Verify OTP and get token |
| POST | `/api/auth/resend-otp` | Resend OTP |

### Products (requires Bearer token)
| Method | Path | Description |
|---|---|---|
| GET | `/api/products` | List all products (filter: `?published=true/false`) |
| POST | `/api/products` | Create a product (multipart/form-data) |
| PUT | `/api/products/:id` | Update a product |
| PUT | `/api/products/:id/publish` | Toggle publish status |
| DELETE | `/api/products/:id` | Delete a product |

---

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd client && npm run build
# Deploy the build/ folder
# Set env var: REACT_APP_API_URL=https://your-api.com/api
```

### Backend (Railway/Render)
```bash
# Set environment variables in dashboard:
# MONGO_URI, JWT_SECRET, CLIENT_URL, NODE_ENV=production
npm start
```
