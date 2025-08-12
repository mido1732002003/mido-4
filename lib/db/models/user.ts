import mongoose from 'mongoose'
import { USER_ROLES } from '@/lib/constants'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Create text index for search
userSchema.index({ name: 'text', email: 'text' })
userSchema.index({ email: 1 })
userSchema.index({ createdAt: -1 })

export const User = mongoose.models.User || mongoose.model('User', userSchema)