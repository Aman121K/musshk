# Musk - E-commerce Website

A modern e-commerce website for perfumes built with Next.js, Node.js, Express, and MongoDB.

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart functionality
- 📱 Responsive design
- 🔍 Product search and filtering
- ⭐ Product reviews and ratings
- 💳 Order management
- 👤 User authentication
- 🎨 Modern UI for luxury perfumes

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas connection string)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd musk
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/musk
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development servers:

Terminal 1 - Backend:
```bash
npm run server:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
musk/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── products/          # Product pages
│   ├── cart/              # Cart page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ...
├── server/                # Backend server
│   ├── index.js          # Express server
│   ├── models/           # MongoDB models
│   └── routes/           # API routes
└── package.json
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart/:sessionId` - Get cart
- `POST /api/cart/:sessionId` - Add to cart
- `PUT /api/cart/:sessionId/:itemId` - Update cart item
- `DELETE /api/cart/:sessionId/:itemId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Backend server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:5000`

## Production

Build the Next.js app:
```bash
npm run build
npm start
```

Start the backend server:
```bash
npm run server
```

## License

MIT

