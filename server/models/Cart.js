const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: {
      type: String,
      default: '',
    },
  }],
  total: {
    type: Number,
    default: 0,
  },
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'],
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'converted', 'expired', 'failed'],
    default: 'active',
  },
  razorpayOrderId: {
    type: String,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Cart expires after 7 days
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    },
  },
}, {
  timestamps: true,
});

// Index for faster queries
cartSchema.index({ sessionId: 1, status: 1 });
cartSchema.index({ userId: 1, status: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
