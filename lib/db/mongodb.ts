// import mongoose from 'mongoose'

// const MONGODB_URI = process.env.MONGODB_URI!

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable')
// }

// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

export async function connectToDatabase() {
  console.log('MongoDB connection disabled for dev mode.')
  return Promise.resolve(null) // Return a resolved promise with null or a mock object
}

// Global type augmentation for mongoose cache
declare global {
  var mongoose: {
    conn: any
    promise: any
  }
}