import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Store in cents
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    file: {
      url: String,
      publicId: String,
      size: Number,
      format: String,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
productSchema.index({ title: 'text', description: 'text' })
productSchema.index({ slug: 1 })
productSchema.index({ category: 1 })
productSchema.index({ tags: 1 })
productSchema.index({ price: 1 })
productSchema.index({ createdAt: -1 })
productSchema.index({ isPublished: 1, createdAt: -1 })

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema)