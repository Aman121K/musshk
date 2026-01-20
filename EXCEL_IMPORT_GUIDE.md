# Excel Product Import Guide

## Overview
The Excel import feature allows you to bulk import products from an Excel file (.xlsx or .xls) directly into the database through the admin panel.

## How to Use

### Step 1: Prepare Your Excel File
Create an Excel file with the following columns (column names are case-insensitive and flexible):

#### Required Columns:
- **Product Name** (or "Name", "Product", "Title") - Product name
- **Product Code** (or "Code", "SKU", "Item Code") - Unique product identifier

#### Optional Columns:
- **Description** (or "Product Description", "Full Description") - Full product description
- **Short Description** (or "Short Desc", "Summary") - Brief description
- **Price** (or "Sale Price", "Selling Price") - Selling price
- **Original Price** (or "MRP", "List Price", "Regular Price") - Original/MRP price
- **Category** (or "Product Category") - Product category
- **Stock** (or "Quantity", "Qty", "Available Stock") - Available stock quantity
- **Rating** (or "Product Rating", "Stars") - Product rating (0-5)
- **Review Count** (or "Reviews", "Number of Reviews") - Number of reviews
- **Images** (or "Image", "Image URLs", "Image URL", "Picture", "Pictures") - Comma-separated image URLs
- **Tags** (or "Tag") - Comma-separated tags
- **Notes** (or "Fragrance Notes", "Scent Notes") - Comma-separated notes
- **Featured** (or "Is Featured") - Yes/No/TRUE/1
- **Best Seller** (or "BestSeller", "Bestseller") - Yes/No/TRUE/1
- **New Arrival** (or "NewArrival", "New") - Yes/No/TRUE/1
- **Slug** - URL-friendly slug (auto-generated if not provided)
- **Sizes** - Comma-separated sizes (e.g., "100 ml, 20 ml")

### Step 2: Import via Admin Panel

1. **Login to Admin Panel**
   - Navigate to `http://localhost:3001` (or your admin URL)
   - Login with your admin credentials

2. **Go to Products Page**
   - Click on "Products" in the navigation
   - You'll see an "📥 Import Excel" button

3. **Upload Excel File**
   - Click "📥 Import Excel"
   - Click "Choose Excel File" and select your .xlsx or .xls file
   - Click "Import Products"

4. **View Results**
   - The system will show:
     - Total rows processed
     - Successfully imported products
     - Failed imports (if any)
     - Error messages (if any)

### Step 3: Verify Products

1. **Check Product List**
   - Go back to Products page
   - Verify all products are listed correctly

2. **Check Product Details**
   - Click on any product to view/edit
   - Verify all fields are populated correctly

3. **Check Website**
   - Visit the main website
   - Browse products to ensure they display correctly
   - Click on product detail pages to verify all information

## Excel File Format Example

| Product Name | Product Code | Description | Price | Original Price | Category | Stock | Images | Tags | Rating | Review Count |
|--------------|--------------|-------------|-------|----------------|----------|-------|--------|------|--------|--------------|
| Premium Coffee Blend | COFFEE001 | Rich and aromatic coffee blend | 999 | 1299 | Espresso Blends | 50 | https://example.com/image1.jpg,https://example.com/image2.jpg | Premium,Best Seller | 4.5 | 120 |
| Single Origin Arabica | COFFEE002 | Single origin coffee from Colombia | 1299 | 1599 | Single Origin | 30 | https://example.com/image3.jpg | Organic,New Arrival | 4.8 | 85 |

## Image Handling

### Option 1: External URLs
- Use full URLs (starting with http:// or https://)
- Multiple images can be comma-separated
- Example: `https://example.com/img1.jpg,https://example.com/img2.jpg`

### Option 2: Local Uploads
- First upload images via admin panel
- Then use the uploaded image paths in Excel
- Example: `/uploads/image-1234567890.jpg`

## Features

### Automatic Slug Generation
- If slug is not provided, it's auto-generated from product name
- Format: lowercase, spaces replaced with hyphens, special characters removed

### Duplicate Handling
- If a product with the same code or slug exists, it will be **updated** (not duplicated)
- This allows you to re-import files to update existing products

### Flexible Column Mapping
- Column names are case-insensitive
- Multiple column name variations are supported
- Example: "Product Name", "Name", "Product", "Title" all work

### Error Handling
- Missing required fields are reported
- Invalid data types are handled gracefully
- Detailed error messages for each failed row

### Default Values
- If sizes are not provided, default sizes (100 ml, 20 ml) are created
- Category defaults to "Inspired Perfumes" if not specified
- Stock defaults to 0 if not specified

## Troubleshooting

### Import Fails
- **Check file format**: Ensure it's .xlsx or .xls
- **Check required columns**: Product Name and Product Code are required
- **Check data types**: Price should be numeric, Stock should be numeric
- **Check file size**: Large files may take time to process

### Products Not Showing
- **Check category**: Ensure category matches allowed values
- **Check images**: Verify image URLs are accessible
- **Check database**: Verify products were saved in database

### Images Not Displaying
- **Check URLs**: Ensure image URLs are correct and accessible
- **Check backend**: Ensure backend is running and serving static files
- **Check CORS**: Ensure CORS is configured correctly

## API Endpoint

The import functionality uses the following API endpoint:

```
POST /api/import/products
Content-Type: multipart/form-data
Body: file (Excel file)
```

Response:
```json
{
  "success": true,
  "total": 10,
  "inserted": 9,
  "failed": 1,
  "insertedProducts": [
    { "code": "COFFEE001", "name": "Premium Coffee", "action": "created" }
  ],
  "failedProducts": [
    { "code": "COFFEE002", "name": "Invalid Product", "error": "Missing required field" }
  ],
  "errors": [
    "Row 3: Missing required fields (Name or Code)"
  ]
}
```

## Best Practices

1. **Test with Small Files**: Start with 5-10 products to test the import
2. **Validate Data**: Check your Excel file for errors before importing
3. **Backup Database**: Always backup your database before bulk imports
4. **Use Unique Codes**: Ensure Product Codes are unique
5. **Image URLs**: Use reliable image hosting or upload images first
6. **Category Names**: Use exact category names that match your system
7. **Review Results**: Always review the import results for errors

## Support

If you encounter issues:
1. Check the error messages in the import results
2. Verify your Excel file format matches the requirements
3. Check backend logs for detailed error information
4. Ensure all required fields are present

