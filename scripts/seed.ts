import { connectToDatabase } from '../lib/db/mongodb'
import { User } from '../lib/db/models/user'
import { Product } from '../lib/db/models/product'
import { Category } from '../lib/db/models/category'
import { slugify } from '../lib/utils'

const categories = [
  { name: 'E-books', slug: 'ebooks' },
  { name: 'Templates', slug: 'templates' },
  { name: 'Audio', slug: 'audio' },
  { name: 'Video', slug: 'video' },
  { name: 'Graphics', slug: 'graphics' },
]

const sampleProducts = [
  {
    title: 'Complete Web Development Guide',
    description: 'A comprehensive guide to modern web development covering HTML, CSS, JavaScript, React, and Node.js. Perfect for beginners and intermediate developers.',
    price: 4999, // $49.99
    category: 'ebooks',
    tags: ['web development', 'programming', 'javascript'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
        publicId: 'sample/web-dev-guide',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.pdf',
      publicId: 'sample/web-dev-guide-file',
      size: 5242880, // 5MB
      format: 'pdf',
    },
    isPublished: true,
  },
  {
    title: 'Professional Business Card Templates',
    description: 'A collection of 50+ modern business card templates. Fully customizable with Adobe Photoshop and Illustrator.',
    price: 2999, // $29.99
    category: 'templates',
    tags: ['design', 'business', 'templates'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800',
        publicId: 'sample/business-cards',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
      publicId: 'sample/business-cards-file',
      size: 10485760, // 10MB
      format: 'zip',
    },
    isPublished: true,
  },
  {
    title: 'Ambient Music Pack for Content Creators',
    description: 'High-quality ambient music tracks perfect for YouTube videos, podcasts, and presentations. Royalty-free license included.',
    price: 3999, // $39.99
    category: 'audio',
    tags: ['music', 'ambient', 'royalty-free'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        publicId: 'sample/ambient-music',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
      publicId: 'sample/ambient-music-file',
      size: 52428800, // 50MB
      format: 'zip',
    },
    isPublished: true,
  },
  {
    title: 'Video Editing Masterclass',
    description: 'Learn professional video editing techniques with this comprehensive course. Includes 10+ hours of content and practice files.',
    price: 9999, // $99.99
    category: 'video',
    tags: ['video editing', 'course', 'tutorial'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=800',
        publicId: 'sample/video-course',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
      publicId: 'sample/video-course-file',
      size: 1073741824, // 1GB
      format: 'zip',
    },
    isPublished: true,
  },
  {
    title: 'Social Media Graphics Bundle',
    description: 'Ready-to-use social media templates for Instagram, Facebook, Twitter, and LinkedIn. Includes 200+ designs.',
    price: 3499, // $34.99
    category: 'graphics',
    tags: ['social media', 'graphics', 'templates'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
        publicId: 'sample/social-graphics',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
      publicId: 'sample/social-graphics-file',
      size: 209715200, // 200MB
      format: 'zip',
    },
    isPublished: true,
  },
  {
    title: 'Photography Lightroom Presets',
    description: 'Professional Lightroom presets for portrait, landscape, and street photography. One-click photo enhancement.',
    price: 2499, // $24.99
    category: 'templates',
    tags: ['photography', 'lightroom', 'presets'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
        publicId: 'sample/lightroom-presets',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
      publicId: 'sample/lightroom-presets-file',
      size: 5242880, // 5MB
      format: 'zip',
    },
    isPublished: true,
  },
  {
    title: 'UI/UX Design System',
    description: 'Complete design system with components, colors, typography, and guidelines. Figma and Sketch files included.',
    price: 7999, // $79.99
    category: 'templates',
    tags: ['design', 'ui/ux', 'figma'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        publicId: 'sample/design-system',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
      publicId: 'sample/design-system-file',
      size: 104857600, // 100MB
      format: 'zip',
    },
    isPublished: true,
  },
  {
    title: 'Email Marketing Templates',
    description: 'Responsive email templates for newsletters, promotions, and transactional emails. Works with all major email platforms.',
    price: 3999, // $39.99
    category: 'templates',
    tags: ['email', 'marketing', 'html'],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800',
        publicId: 'sample/email-templates',
      },
    ],
    file: {
      url: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
      publicId: 'sample/email-templates-file',
      size: 10485760, // 10MB
      format: 'zip',
    },
    isPublished: true,
  },
]

async function seed() {
  try {
    console.log('🌱 Starting database seed...')
    
    await connectToDatabase()
    
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await User.deleteMany({})
    await Product.deleteMany({})
    await Category.deleteMany({})
    
    // Create categories
    console.log('📁 Creating categories...')
    await Category.insertMany(categories)
    
    // Create admin user
    console.log('👤 Creating admin user...')
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      image: 'https://ui-avatars.com/api/?name=Admin+User',
    })
    
    // Create regular user
    console.log('👤 Creating regular user...')
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      role: 'USER',
      image: 'https://ui-avatars.com/api/?name=John+Doe',
    })
    
    // Create products
    console.log('📦 Creating products...')
    for (const productData of sampleProducts) {
      const slug = slugify(productData.title)
      await Product.create({
        ...productData,
        slug,
      })
    }
    
    console.log('✅ Database seeded successfully!')
    console.log('\n📧 Login credentials:')
    console.log('Admin: admin@example.com')
    console.log('User: user@example.com')
    console.log('\n💡 Use magic link authentication to sign in')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seed()