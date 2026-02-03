const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Admin: Get all pending carts (must come before /:sessionId route)
router.get('/admin/pending', async (req, res) => {
  try {
    const carts = await Cart.find({ status: 'pending' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(carts);
  } catch (error) {
    console.error('Error fetching pending carts:', error);
    res.status(500).json({ error: 'Failed to fetch pending carts' });
  }
});

// Admin: Get all carts (must come before /:sessionId route)
router.get('/admin/all', async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(carts);
  } catch (error) {
    console.error('Error fetching all carts:', error);
    res.status(500).json({ error: 'Failed to fetch carts' });
  }
});

// Get cart by sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    let cart = await Cart.findOne({ 
      sessionId, 
      status: { $in: ['active', 'pending'] } 
    }).populate('items.productId');

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

    res.json(cart);
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
    res.json(cart);
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
    res.json(cart);
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
    res.json(cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:sessionId/:itemId', async (req, res) => {
  try {
    const { sessionId, itemId } = req.params;

    const cart = await Cart.findOne({ 
      sessionId, 
      status: { $in: ['active', 'pending'] } 
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== itemId
    );

    // Calculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error removing item:', error);
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
