# How to Run the Backend Server

The backend server is in the `/server` folder and runs on **port 5000**.

## Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)

## Step-by-Step Setup

### 1. Install Dependencies

From the root directory (`/musk`), run:

```bash
npm install
```

This will install all required packages including:
- Express.js (web framework)
- Mongoose (MongoDB driver)
- Multer (file uploads)
- And other dependencies

### 2. Set Up MongoDB

**Option A: Local MongoDB**

1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB from Services or run mongod.exe
   ```

**Option B: MongoDB Atlas (Cloud - Recommended)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Use it in the `.env` file (see step 3)

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add these variables to `.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/musk
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/musk

# Server Port
PORT=5000

# JWT Secret (change this to a random string)
JWT_SECRET=your-secret-key-change-in-production

# API URL (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Create Uploads Directory

Create the directory for uploaded images:

```bash
mkdir -p public/uploads
```

### 5. Run the Backend Server

You have two options:

**Option A: Development Mode (with auto-reload)**
```bash
npm run server:dev
```

This uses `nodemon` which automatically restarts the server when you make changes.

**Option B: Production Mode**
```bash
npm run server
```

This runs the server normally without auto-reload.

### 6. Verify Server is Running

You should see:
```
MongoDB Connected
Server running on port 5000
```

Test the server by visiting:
- Health check: http://localhost:5000/api/health
- Should return: `{"status":"OK","message":"Server is running"}`

## Complete Setup Example

```bash
# 1. Navigate to project directory
cd /Users/vikastiwari/Desktop/found/musk

# 2. Install dependencies
npm install

# 3. Create .env file (copy the content above)

# 4. Create uploads directory
mkdir -p public/uploads

# 5. Make sure MongoDB is running
# (Start MongoDB service)

# 6. Run the server
npm run server:dev
```

## Running All Three Services

Since you have three separate parts, you need **3 terminal windows**:

**Terminal 1 - Backend Server:**
```bash
cd /Users/vikastiwari/Desktop/found/musk
npm run server:dev
```

**Terminal 2 - Website Frontend:**
```bash
cd /Users/vikastiwari/Desktop/found/musk
npm run dev
```

**Terminal 3 - Admin Panel:**
```bash
cd /Users/vikastiwari/Desktop/found/musk/admin
npm install  # First time only
npm run dev
```

## Testing the Backend

Once the server is running, test these endpoints:

1. **Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Get Products:**
   ```bash
   curl http://localhost:5000/api/products
   ```

3. **Seed Database (optional):**
   ```bash
   npm run seed
   ```
   This will add sample products to your database.

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB connection error`

**Solutions:**
1. Make sure MongoDB is running:
   ```bash
   # Check if MongoDB is running
   ps aux | grep mongod
   ```

2. Check your connection string in `.env`

3. For MongoDB Atlas, make sure:
   - Your IP is whitelisted
   - Connection string is correct
   - Username/password are correct

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Change port in `.env`:
   ```env
   PORT=5001
   ```

2. Or kill the process using port 5000:
   ```bash
   # Find process
   lsof -i :5000
   
   # Kill process (replace PID with actual process ID)
   kill -9 <PID>
   ```

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
npm install
```

## Backend API Endpoints

Once running, your backend provides these endpoints:

- `GET /api/health` - Health check
- `GET /api/products` - List products
- `GET /api/products/:slug` - Get product
- `POST /api/products` - Create product
- `GET /api/blogs` - List blogs
- `GET /api/testimonials` - List testimonials
- `POST /api/upload/image` - Upload image
- `POST /api/orders` - Create order
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

## Summary

**Quick Start:**
```bash
# 1. Install
npm install

# 2. Create .env file with MongoDB connection

# 3. Create uploads directory
mkdir -p public/uploads

# 4. Run server
npm run server:dev
```

The backend will run on **http://localhost:5000**

