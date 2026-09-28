import mongoose from 'mongoose'

export async function connectDb() {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is missing')

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    console.log('[DB] connected')
  } catch (error) {
    console.error(`[DB] could not connect: ${error.message}`)
    process.exit(1)
  }
}
