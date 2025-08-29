import { NextResponse } from "next/server";
import mongoose from "mongoose";
import LawyerModel from "@/lib/models/LawyerModel";
import { ConnectDB } from "@/lib/config/db";

const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
};

// GET all lawyers for admin (including unpublished)
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get single lawyer by ID
      const lawyer = await LawyerModel.findOne({ lawyerId: id });
      if (!lawyer) {
        return NextResponse.json(
          { success: false, error: "Lawyer not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ lawyer });
    }
    
    // Get all lawyers for admin
    const lawyers = await LawyerModel.find({}).sort({ date: -1 });
    return NextResponse.json({ lawyers });
    
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lawyers" },
      { status: 500 }
    );
  }
}