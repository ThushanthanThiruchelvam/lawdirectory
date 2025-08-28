import { ConnectDB } from '@/lib/config/db';
import ContactModel from '@/lib/models/ContactModel';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await ConnectDB();
    
    const { firstName, lastName, email, phone, message } = await request.json();
    
    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, msg: "All required fields must be filled" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, msg: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    // Create and save contact form data
    await ContactModel.create({
      firstName,
      lastName,
      email,
      phone: phone || '',
      message
    });
    
    return NextResponse.json({
      success: true,
      msg: "Thank you for your message! We'll get back to you soon."
    });
    
  } catch (error) {
    console.error('Error saving contact form:', error);
    return NextResponse.json(
      { success: false, msg: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await ConnectDB();
    
    const contacts = await ContactModel.find({}).sort({ date: -1 });
    
    return NextResponse.json({ 
      success: true,
      contacts 
    });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await ConnectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required" },
        { status: 400 }
      );
    }
    
    await ContactModel.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      msg: "Contact deleted successfully"
    });
    
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}