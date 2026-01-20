# Quick Start Guide - Musk Premium Coffee E-Commerce

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Main project
npm install

# Backend
cd backend
npm install
cd ..

# Admin panel
cd admin
npm install
cd ..
```

### Step 2: Set Up Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27018/musk
PORT=5000
JWT_SECRET=your-secret-key
```

### Step 3: Create Uploads Directory

```bash
mkdir -p backend/public/uploads
```

### Step 4: Start MongoDB

Make sure MongoDB is running on your system.

### Step 5: Seed Coffee Products

```bash
cd backend
npm run seed:coffee
```

This adds 10 premium coffee products to your database.

### Step 6: Run All Services

Open **3 terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Website:**
```bash
npm run dev
```

**Terminal 3 - Admin:**
```bash
cd admin
npm run dev
```

### Step 7: Access Applications

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:5000

## ✅ Test the E-Commerce Flow

1. Visit http://localhost:3000
2. Browse coffee products
3. Click on a product
4. Select size (250g, 500g, 1kg)
5. Click "Add to cart"
6. Go to cart
7. Click "Proceed to Checkout"
8. Fill in delivery details and email
9. Click "Place Order"
10. See order confirmation
11. Check email for confirmation (if configured)

## 📧 Email Setup (Optional)

To enable order confirmation emails, configure in `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Musk Coffee <noreply@muskcoffee.com>
```

## 🎯 What's Included

- ✅ 10 Premium Coffee Products
- ✅ Complete Shopping Cart
- ✅ Checkout Flow
- ✅ Order Management
- ✅ Email Confirmations
- ✅ Admin Panel
- ✅ Product Management
- ✅ Image Uploads

## 📝 Next Steps

1. Add your coffee product images
2. Configure email service
3. Customize content
4. Add payment gateway (optional)
5. Deploy to production

Everything is ready to use! ☕

