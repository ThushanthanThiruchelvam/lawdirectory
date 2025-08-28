import { ConnectDB } from '@/lib/config/db';
import AdminModel from '@/lib/models/AdminModel';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await ConnectDB();
    
    const { username, email, password } = await request.json();
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin already exists' },
        { status: 400 }
      );
    }
    
    // Create new admin
    const admin = await AdminModel.create({
      username,
      email,
      password
    });
    
    // Remove password from response
    admin.password = undefined;
    
    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      admin
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}