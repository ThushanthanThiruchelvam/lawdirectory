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
      // Get single lawyer by ID for admin
      const lawyer = await LawyerModel.findOne({ lawyerId: id });
      
      if (!lawyer) {
        return NextResponse.json(
          { success: false, error: "Lawyer not found" },
          { status: 404 }
        );
      }
      
      // Extract content for response
      const englishContent = lawyer.contents.find(c => c.language === 'en') || lawyer.contents[0];
      const tamilContent = lawyer.contents.find(c => c.language === 'ta');
      
      const lawyerResponse = {
        _id: lawyer._id,
        lawyerId: lawyer.lawyerId,
        name_en: englishContent?.name || "",
        title_en: englishContent?.title || "",
        description_en: englishContent?.description || "",
        name_ta: tamilContent?.name || "",
        title_ta: tamilContent?.title || "",
        description_ta: tamilContent?.description || "",
        locations_en: lawyer.locations.filter(l => l.language === 'en').map(l => l.location),
        locations_ta: lawyer.locations.filter(l => l.language === 'ta').map(l => l.location),
        practiceAreas_en: lawyer.practiceAreas.filter(p => p.language === 'en').map(p => p.practiceArea),
        practiceAreas_ta: lawyer.practiceAreas.filter(p => p.language === 'ta').map(p => p.practiceArea),
        education_en: lawyer.education.filter(e => e.language === 'en').map(e => e.education),
        education_ta: lawyer.education.filter(e => e.language === 'ta').map(e => e.education),
        addresses_en: lawyer.addresses.filter(a => a.language === 'en').map(a => a.address),
        addresses_ta: lawyer.addresses.filter(a => a.language === 'ta').map(a => a.address),
        contactNumber: lawyer.contactNumber,
        email: lawyer.email,
        website: lawyer.website,
        image: lawyer.image,
        isFeatured: lawyer.isFeatured,
        isPublished: lawyer.isPublished
      };
      
      return NextResponse.json({ lawyer: lawyerResponse });
    }
    
    // Get all lawyers for admin
    const lawyers = await LawyerModel.find({}).sort({ date: -1 });
    
    const lawyersWithLang = lawyers.map(lawyer => {
      const content = lawyer.contents.find(c => c.language === 'en') || lawyer.contents[0];
      
      return {
        _id: lawyer._id,
        lawyerId: lawyer.lawyerId,
        name: content?.name || "No name",
        title: content?.title || "No title",
        description: content?.description || "",
        locations: lawyer.locations.filter(l => l.language === 'en').map(l => l.location),
        practiceAreas: lawyer.practiceAreas.filter(p => p.language === 'en').map(p => p.practiceArea),
        image: lawyer.image,
        isFeatured: lawyer.isFeatured,
        isPublished: lawyer.isPublished,
        date: lawyer.date
      };
    });
    
    return NextResponse.json({ lawyers: lawyersWithLang });
    
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lawyers" },
      { status: 500 }
    );
  }
}