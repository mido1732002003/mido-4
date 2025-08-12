import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
)

categorySchema.index({ slug: 1 })

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)