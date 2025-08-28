// lib/config/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

export const ConnectDB = async () => {
    try {
        const { connection } = await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB Connected: ${connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};