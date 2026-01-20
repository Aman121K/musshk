# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/musk
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Note:** If you're using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
Start MongoDB from Services or run `mongod` in a terminal.

## Step 4: Seed the Database (Optional)

Populate the database with sample products:

```bash
npm run seed
```

## Step 5: Start the Development Servers

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

## Step 6: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Troubleshooting

### MongoDB Connection Issues

If you see MongoDB connection errors:

1. **Check if MongoDB is running:**
   ```bash
   # macOS/Linux
   ps aux | grep mongod
   
   # Or try connecting
   mongosh
   ```

2. **If using MongoDB Atlas:**
   - Make sure your IP is whitelisted
   - Check your connection string format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

3. **For local MongoDB:**
   - Default connection: `mongodb://localhost:27017/musk`
   - Make sure MongoDB is installed and running

### Port Already in Use

If port 3000 or 5000 is already in use:

1. Change the port in `.env`:
   ```env
   PORT=5001
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

2. Or kill the process using the port:
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill the process
   kill -9 <PID>
   ```

### Module Not Found Errors

If you see module not found errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Add Product Images:** Place product images in the `public/images/` directory
2. **Customize Styling:** Modify `tailwind.config.ts` and `app/globals.css`
3. **Add More Products:** Use the admin API or seed script to add more products
4. **Configure Payment:** Integrate payment gateway (Razorpay, Stripe, etc.)
5. **Deploy:** Deploy frontend to Vercel and backend to Heroku/Railway/DigitalOcean

## API Testing

You can test the API endpoints using:

- **Postman**
- **cURL**
- **Browser** (for GET requests)

Example:
```bash
# Get all products
curl http://localhost:5000/api/products

# Get single product
curl http://localhost:5000/api/products/xp12-musk-sauvage
```

## Production Build

To build for production:

```bash
# Build Next.js app
npm run build

# Start production server
npm start
```

For the backend, use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server/index.js --name musk-api
```

