import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Import models
import User from './models/User.js';

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'teacher@example.com' });
    if (existingUser) {
      console.log('Teacher user already exists');
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash('Password123!', 12);

    // Create user
    const user = new User({
      email: 'teacher@example.com',
      passwordHash,
      name: 'Example Teacher',
      role: 'teacher',
      createdAt: new Date()
    });

    await user.save();
    console.log('Teacher user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();