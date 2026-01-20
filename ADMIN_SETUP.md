# Complete Project Structure

## Three Separate Parts

### 1. Backend Server (`/server`)
- **Location**: `/server`
- **Port**: 5000
- **Start**: `npm run server:dev`
- **Purpose**: REST API for both website and admin panel

### 2. Website Frontend (`/app`)
- **Location**: Root directory (`/app`, `/components`)
- **Port**: 3000
- **Start**: `npm run dev`
- **Purpose**: Customer-facing website

### 3. Admin Panel (`/admin`)
- **Location**: `/admin`
- **Port**: 3001
- **Start**: `cd admin && npm run dev`
- **Purpose**: Content management system

## Setup Instructions

### Initial Setup

1. **Install main dependencies** (root directory):
```bash
npm install
```

2. **Install admin dependencies**:
```bash
cd admin
npm install
cd ..
```

3. **Create `.env` file** (root directory):
```env
MONGODB_URI=mongodb://localhost:27017/musk
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Create `public/uploads` directory** (for image uploads):
```bash
mkdir -p public/uploads
```

### Running the Application

You need **3 terminal windows**:

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```

**Terminal 2 - Website:**
```bash
npm run dev
```

**Terminal 3 - Admin Panel:**
```bash
cd admin
npm run dev
```

## Admin Panel Features

### Product Management
- Create/Edit/Delete products
- Upload product images
- Set prices, stock, categories
- Add tags and notes
- Mark as featured, best seller, new arrival

### Blog Management
- Create/Edit/Delete blog posts
- Upload blog images
- Set categories and tags
- Publish/Unpublish posts

### Testimonial Management
- Add customer testimonials
- Upload customer images
- Approve/Reject testimonials
- Mark as featured

### Image Upload
- Upload single or multiple images
- Images stored in `/public/uploads`
- Accessible via `/uploads/filename`

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Blogs
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/:slug` - Get single blog
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)

### Testimonials
- `GET /api/testimonials` - List approved testimonials
- `GET /api/testimonials/admin/all` - List all (Admin)
- `POST /api/testimonials` - Create testimonial
- `PUT /api/testimonials/:id` - Update testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## Database Models

- **Product**: Products with images, prices, categories
- **Blog**: Blog posts with content and images
- **Testimonial**: Customer reviews with images
- **Order**: Customer orders
- **User**: Admin and customer users
- **Category**: Product categories

## File Structure

```
musk/
├── app/                    # Website frontend
│   ├── page.tsx
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── ...
├── components/             # Website components
├── admin/                  # Admin panel (separate)
│   ├── app/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── blogs/
│   │   └── testimonials/
│   └── ...
├── server/                 # Backend API
│   ├── models/
│   ├── routes/
│   └── index.js
└── public/
    └── uploads/           # Uploaded images
```

## Production Deployment

### Backend
- Deploy to Heroku, Railway, or DigitalOcean
- Set environment variables
- Ensure MongoDB connection

### Website
- Deploy to Vercel or similar
- Set `NEXT_PUBLIC_API_URL` to production API URL

### Admin Panel
- Deploy to separate subdomain (e.g., admin.musk.com)
- Or deploy to separate Vercel project
- Set `NEXT_PUBLIC_API_URL` to production API URL

## Security Notes

- Admin routes should be protected with authentication
- Image uploads should be validated
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Add CORS configuration for production

