const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.price;
      },
      message: 'Discount price must be less than regular price'
    }
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please specify a category']
  },
  subcategory: {
    type: String,
    default: null
  },
  brand: {
    type: String,
    required: [true, 'Please specify a brand']
  },
  sku: {
    type: String,
    required: [true, 'Please provide a SKU'],
    unique: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  specifications: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true // e.g., "Size", "Color"
    },
    options: [{
      value: {
        type: String,
        required: true // e.g., "Small", "Red"
      },
      stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
      },
      price: {
        type: Number,
        min: [0, 'Price cannot be negative']
      }
    }]
  }],
  stock: {
    type: Number,
    required: [true, 'Please specify stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5']
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false
    }
  }],
  dimensions: {
    weight: Number, // in grams
    length: Number, // in cm
    width: Number,  // in cm
    height: Number  // in cm
  },
  shippingInfo: {
    weight: {
      type: Number,
      default: 0
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0
    }
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

// Ensure only one primary image
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    let lastPrimaryIndex = -1;
    
    this.images.forEach((image, index) => {
      if (image.isPrimary) {
        primaryCount++;
        lastPrimaryIndex = index;
      }
    });
    
    // If more than one primary, keep only the last one
    if (primaryCount > 1) {
      this.images.forEach((image, index) => {
        image.isPrimary = index === lastPrimaryIndex;
      });
    }
    
    // If no primary and there are images, make the first one primary
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Update ratings when reviews change
productSchema.methods.updateRatings = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = Math.round((total / this.reviews.length) * 10) / 10;
    this.ratings.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
