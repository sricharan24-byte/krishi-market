const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'poultry', 'seeds', 'fertilizers', 'equipment', 'other']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'gram', 'litre', 'piece', 'dozen', 'bag', 'quintal', 'ton']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  images: [{
    type: String
  }],
  isOrganic: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  ratings: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);