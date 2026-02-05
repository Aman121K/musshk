const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Get cart by sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Don't populate productId to keep it as ObjectId for easier comparison in other operations
    let cart = await Cart.findOne({ 
      sessionId, 
      status: { $in: ['active', 'pending'] } 
    });

    if (!cart) {
      // Return empty cart structure
      return res.json({ items: [], total: 0, _id: null });
    }

    // Calculate total if not set
    if (cart.items.length > 0 && cart.total === 0) {
      cart.total = cart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
      await cart.save();
    }

    // Convert productId to string for frontend compatibility
    const cartData = cart.toObject();
    if (cartData.items && cartData.items.length > 0) {
      cartData.items = cartData.items.map(item => {
        // Handle both ObjectId and string productId
        const productIdStr = item.productId?.toString ? item.productId.toString() : String(item.productId || '');
        return {
          ...item,
          productId: productIdStr,
        };
      });
    }

    res.json(cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add to cart or create new cart
router.post('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { productId, name, size, price, quantity, image } = req.body;

    if (!productId || !name || !size || !price || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ 
      sessionId, 
      status: { $in: ['active', 'pending'] } 
    });

    if (!cart) {
      cart = new Cart({
        sessionId,
        items: [],
        total: 0,
        status: 'active',
      });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        size,
        price,
        quantity,
        image: image || '',
      });
    }

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    await cart.save();
    
    // Convert productId to string for frontend compatibility
    const cartData = cart.toObject();
    if (cartData.items) {
      cartData.items = cartData.items.map(item => ({
        ...item,
        productId: item.productId.toString(),
      }));
    }
    
    res.json(cartData);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart with checkout information (shipping address, payment method)
// IMPORTANT: This route must come BEFORE /:sessionId/:itemId to avoid route conflicts
router.put('/:sessionId/checkout', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { shippingAddress, paymentMethod, userId } = req.body;

    console.log(`[Checkout] Processing checkout for sessionId: ${sessionId}`);

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Shipping address and payment method are required' });
    }

    const cart = await Cart.findOne({ 
      sessionId, 
      status: { $in: ['active', 'pending'] } 
    });

    if (!cart) {
      console.log(`[Checkout] Cart not found for sessionId: ${sessionId}`);
      return res.status(404).json({ error: 'Cart not found. Please add items to cart first.' });
    }

    if (!cart.items || cart.items.length === 0) {
      console.log(`[Checkout] Cart is empty for sessionId: ${sessionId}`);
      return res.status(400).json({ error: 'Cart is empty. Please add items to cart first.' });
    }

    // Ensure cart has an _id (it should, but double-check)
    if (!cart._id) {
      console.log(`[Checkout] Cart missing _id for sessionId: ${sessionId}`);
      return res.status(500).json({ error: 'Cart ID not found. Please try again.' });
    }

    console.log(`[Checkout] Updating cart ${cart._id} with checkout details`);

    // Update cart with checkout details
    cart.shippingAddress = shippingAddress || cart.shippingAddress;
    cart.paymentMethod = paymentMethod || cart.paymentMethod;
    if (userId) {
      cart.userId = userId;
    }
    cart.status = 'pending';

    await cart.save();
    console.log(`[Checkout] Cart ${cart._id} updated successfully`);
    
    // Return cart with productId as string for frontend, but keep ObjectId structure for backend use
    const cartData = cart.toObject();
    if (cartData.items) {
      cartData.items = cartData.items.map(item => ({
        ...item,
        productId: item.productId.toString(),
      }));
    }
    
    res.json(cartData);
  } catch (error) {
    console.error('[Checkout] Error updating cart for checkout:', error);
    res.status(500).json({ error: 'Failed to update cart for checkout' });
  }
});

// Update cart item quantity
router.put('/:sessionId/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ 
      sessionId, 
      status: { $in: ['active', 'pending'] } 
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find item by productId (ObjectId converted to string)
    const item = cart.items.find(
      item => item.productId.toString() === itemId
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    await cart.save();
    
    // Convert productId to string for frontend compatibility
    const cartData = cart.toObject();
    if (cartData.items) {
      cartData.items = cartData.items.map(item => ({
        ...item,
        productId: item.productId.toString(),
      }));
    }
    
    res.json(cartData);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:sessionId/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;
    // Also check request body for productId
    const { productId, id } = req.body || {};

    // Use productId from body, id from body, or itemId from params (in that order)
    const identifier = productId || id || itemId;

    console.log(`[Delete Item] Removing item from cart ${sessionId}`);
    console.log(`[Delete Item] Identifier: ${identifier} (from: ${productId ? 'body.productId' : id ? 'body.id' : 'params.itemId'})`);

    const cart = await Cart.findOne({ 
      sessionId, 
      status: { $in: ['active', 'pending'] } 
    });

    if (!cart) {
      console.log(`[Delete Item] Cart not found for sessionId: ${sessionId}`);
      return res.status(404).json({ error: 'Cart not found' });
    }

    console.log(`[Delete Item] Cart has ${cart.items.length} items`);
    console.log(`[Delete Item] Looking for productId/id: ${identifier}`);
    
    // Log all productIds and items before filtering for debugging
    const allProductIds = cart.items.map((i, idx) => {
      const pid = i.productId?.toString ? i.productId.toString() : String(i.productId || '');
      return { index: idx, productId: pid, id: i._id?.toString() || 'N/A' };
    });
    console.log(`[Delete Item] All items in cart:`, allProductIds);

    // Find the index of the item to remove - check both productId and _id
    let itemIndex = -1;
    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      let productIdStr;
      let itemIdStr;
      
      // Get productId as string
      if (item.productId) {
        if (typeof item.productId === 'object' && item.productId.toString) {
          productIdStr = item.productId.toString();
        } else {
          productIdStr = String(item.productId);
        }
      } else {
        productIdStr = '';
      }
      
      // Get item _id as string
      if (item._id) {
        itemIdStr = item._id.toString();
      } else {
        itemIdStr = '';
      }
      
      console.log(`[Delete Item] Comparing: productId "${productIdStr}" or id "${itemIdStr}" === "${identifier}"`);
      
      // Match by productId or _id
      if (productIdStr === identifier || itemIdStr === identifier) {
        itemIndex = i;
        console.log(`[Delete Item] Found matching item at index ${i} (matched by: ${productIdStr === identifier ? 'productId' : 'id'})`);
        break;
      }
    }

    if (itemIndex === -1) {
      console.log(`[Delete Item] No item found with identifier: ${identifier}`);
      return res.status(404).json({ 
        error: 'Item not found in cart',
        message: 'Invalid item identifier. Please provide productId in request body or use DELETE /:sessionId/item endpoint.',
        availableItems: allProductIds,
        providedIdentifier: identifier
      });
    }

    // Remove the item using splice
    cart.items.splice(itemIndex, 1);
    
    // Mark the items array as modified for Mongoose
    cart.markModified('items');
    
    console.log(`[Delete Item] Removed item at index ${itemIndex}. Remaining items: ${cart.items.length}`);

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    await cart.save();
    console.log(`[Delete Item] Cart updated successfully. New total: ${cart.total}`);
    
    // Convert productId to string for frontend compatibility
    // Also include item _id for identification
    const cartData = cart.toObject();
    if (cartData.items) {
      cartData.items = cartData.items.map(item => ({
        ...item,
        productId: item.productId?.toString ? item.productId.toString() : String(item.productId || ''),
        id: item._id?.toString ? item._id.toString() : (item._id ? String(item._id) : ''),
      }));
    }
    
    res.json(cartData);
  } catch (error) {
    console.error('[Delete Item] Error removing item:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear/Delete cart
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const cart = await Cart.findOne({ sessionId });
    if (cart) {
      await Cart.deleteOne({ _id: cart._id });
    }
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
