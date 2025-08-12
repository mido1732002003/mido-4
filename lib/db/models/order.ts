import mongoose from 'mongoose'
import { ORDER_STATUS } from '@/lib/constants'

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: String,
  price: Number,
  quantity: {
    type: Number,
    default: 1,
  },
})

const downloadSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  fileUrl: String,
  expiresAt: Date,
})

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    stripe: {
      sessionId: String,
      paymentIntentId: String,
      status: String,
    },
    downloads: [downloadSchema],
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    customerEmail: String,
  },
  {
    timestamps: true,
  }
)

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ 'stripe.sessionId': 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)