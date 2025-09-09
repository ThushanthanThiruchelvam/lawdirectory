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
    const admin = searchParams.get('admin');
    
    if (id) {
      // Get single lawyer by ID
      const lawyer = await LawyerModel.findOne({ lawyerId: id });
      
      if (!lawyer) {
        return NextResponse.json(
          { success: false, error: "Lawyer not found" },
          { status: 404 }
        );
      }
      
      // For admin requests, return all language data
      if (admin === 'true') {
        // Extract content for all languages
        const englishContent = lawyer.contents.find(c => c.language === 'en') || lawyer.contents[0];
        const tamilContent = lawyer.contents.find(c => c.language === 'ta');
        const sinhalaContent = lawyer.contents.find(c => c.language === 'si');
        
        const lawyerResponse = {
          _id: lawyer._id,
          lawyerId: lawyer.lawyerId,
          name_en: englishContent?.name || "",
          title_en: englishContent?.title || "",
          description_en: englishContent?.description || "",
          name_ta: tamilContent?.name || "",
          title_ta: tamilContent?.title || "",
          description_ta: tamilContent?.description || "",
          name_si: sinhalaContent?.name || "",
          title_si: sinhalaContent?.title || "",
          description_si: sinhalaContent?.description || "",
          locations_en: lawyer.locations.filter(l => l.language === 'en').map(l => l.location),
          locations_ta: lawyer.locations.filter(l => l.language === 'ta').map(l => l.location),
          locations_si: lawyer.locations.filter(l => l.language === 'si').map(l => l.location),
          practiceAreas_en: lawyer.practiceAreas.filter(p => p.language === 'en').map(p => p.practiceArea),
          practiceAreas_ta: lawyer.practiceAreas.filter(p => p.language === 'ta').map(p => p.practiceArea),
          practiceAreas_si: lawyer.practiceAreas.filter(p => p.language === 'si').map(p => p.practiceArea),
          education_en: lawyer.education.filter(e => e.language === 'en').map(e => e.education),
          education_ta: lawyer.education.filter(e => e.language === 'ta').map(e => e.education),
          education_si: lawyer.education.filter(e => e.language === 'si').map(e => e.education),
          addresses_en: lawyer.addresses.filter(a => a.language === 'en').map(a => a.address),
          addresses_ta: lawyer.addresses.filter(a => a.language === 'ta').map(a => a.address),
          addresses_si: lawyer.addresses.filter(a => a.language === 'si').map(a => a.address),
          contactNumber: lawyer.contactNumber,
          email: lawyer.email,
          website: lawyer.website,
          image: lawyer.image,
          isFeatured: lawyer.isFeatured,
          isPublished: lawyer.isPublished
        };
        
        return NextResponse.json({ lawyer: lawyerResponse });
      }
      
      // For non-admin requests, return only published lawyers with language-specific content
      if (!lawyer.isPublished) {
        return NextResponse.json(
          { success: false, error: "Lawyer not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ lawyer });
    }
    
    // Get all lawyers
    const filter = admin === 'true' ? {} : { isPublished: true };
    const lawyers = await LawyerModel.find(filter).sort({ date: -1 });
    
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

// POST - Create new lawyer
export async function POST(request) {
  try {
    await connectToDB();
    
    const formData = await request.formData();
    
    // Extract basic fields
    const lawyerId = formData.get('lawyerId');
    const contactNumber = formData.get('contactNumber');
    const email = formData.get('email');
    const website = formData.get('website') || '';
    const isFeatured = formData.get('isFeatured') === 'true';
    const isPublished = formData.get('isPublished') === 'true';
    const image = formData.get('image');
    
    // Extract content for all languages
    const name_en = formData.get('name_en');
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const name_ta = formData.get('name_ta') || '';
    const title_ta = formData.get('title_ta') || '';
    const description_ta = formData.get('description_ta') || '';
    const name_si = formData.get('name_si') || '';
    const title_si = formData.get('title_si') || '';
    const description_si = formData.get('description_si') || '';
    
    // Extract practice areas for all languages
    const practiceAreas_en = formData.getAll('practiceAreas_en');
    const practiceAreas_ta = formData.getAll('practiceAreas_ta');
    const practiceAreas_si = formData.getAll('practiceAreas_si');
    
    // Extract locations for all languages
    const locations_en = formData.getAll('locations_en');
    const locations_ta = formData.getAll('locations_ta');
    const locations_si = formData.getAll('locations_si');
    
    // Extract education for all languages
    const education_en = formData.getAll('education_en');
    const education_ta = formData.getAll('education_ta');
    const education_si = formData.getAll('education_si');
    
    // Extract addresses for all languages
    const addresses_en = formData.getAll('addresses_en');
    const addresses_ta = formData.getAll('addresses_ta');
    const addresses_si = formData.getAll('addresses_si');
    
    // Check if lawyer ID already exists
    const existingLawyer = await LawyerModel.findOne({ lawyerId });
    if (existingLawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer ID already exists" },
        { status: 400 }
      );
    }
    
    // Handle image upload (you'll need to implement your image storage logic here)
    let imageUrl = '';
    if (image && image instanceof File) {
      // For now, we'll just use a placeholder. You should implement proper image upload to cloud storage
      imageUrl = `/uploads/lawyers/${lawyerId}-${Date.now()}-${image.name}`;
      // In a real application, you would upload the image to cloud storage (S3, Cloudinary, etc.)
      // and get the URL back
    }
    
    // Create lawyer document
    const lawyer = new LawyerModel({
      lawyerId,
      contents: [
        { language: 'en', name: name_en, title: title_en, description: description_en },
        { language: 'ta', name: name_ta, title: title_ta, description: description_ta },
        { language: 'si', name: name_si, title: title_si, description: description_si }
      ].filter(content => content.name && content.title), // Only include languages with content
      locations: [
        ...locations_en.map(location => ({ language: 'en', location })),
        ...locations_ta.map(location => ({ language: 'ta', location })),
        ...locations_si.map(location => ({ language: 'si', location }))
      ],
      practiceAreas: [
        ...practiceAreas_en.map(area => ({ language: 'en', practiceArea: area })),
        ...practiceAreas_ta.map(area => ({ language: 'ta', practiceArea: area })),
        ...practiceAreas_si.map(area => ({ language: 'si', practiceArea: area }))
      ],
      education: [
        ...education_en.map(edu => ({ language: 'en', education: edu })),
        ...education_ta.map(edu => ({ language: 'ta', education: edu })),
        ...education_si.map(edu => ({ language: 'si', education: edu }))
      ],
      addresses: [
        ...addresses_en.map(addr => ({ language: 'en', address: addr })),
        ...addresses_ta.map(addr => ({ language: 'ta', address: addr })),
        ...addresses_si.map(addr => ({ language: 'si', address: addr }))
      ],
      contactNumber,
      email,
      website,
      image: imageUrl,
      isFeatured,
      isPublished
    });
    
    await lawyer.save();
    
    return NextResponse.json(
      { success: true, msg: "Lawyer created successfully", lawyer },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lawyer" },
      { status: 500 }
    );
  }
}

// PUT - Update lawyer
export async function PUT(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lawyer ID is required" },
        { status: 400 }
      );
    }
    
    const formData = await request.formData();
    
    // Find existing lawyer
    const lawyer = await LawyerModel.findOne({ lawyerId: id });
    if (!lawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }
    
    // Extract fields
    const contactNumber = formData.get('contactNumber');
    const email = formData.get('email');
    const website = formData.get('website') || '';
    const isFeatured = formData.get('isFeatured') === 'true';
    const isPublished = formData.get('isPublished') === 'true';
    const image = formData.get('image');
    
    // Extract content for all languages
    const name_en = formData.get('name_en');
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const name_ta = formData.get('name_ta') || '';
    const title_ta = formData.get('title_ta') || '';
    const description_ta = formData.get('description_ta') || '';
    const name_si = formData.get('name_si') || '';
    const title_si = formData.get('title_si') || '';
    const description_si = formData.get('description_si') || '';
    
    // Extract practice areas for all languages
    const practiceAreas_en = formData.getAll('practiceAreas_en');
    const practiceAreas_ta = formData.getAll('practiceAreas_ta');
    const practiceAreas_si = formData.getAll('practiceAreas_si');
    
    // Extract locations for all languages
    const locations_en = formData.getAll('locations_en');
    const locations_ta = formData.getAll('locations_ta');
    const locations_si = formData.getAll('locations_si');
    
    // Extract education for all languages
    const education_en = formData.getAll('education_en');
    const education_ta = formData.getAll('education_ta');
    const education_si = formData.getAll('education_si');
    
    // Extract addresses for all languages
    const addresses_en = formData.getAll('addresses_en');
    const addresses_ta = formData.getAll('addresses_ta');
    const addresses_si = formData.getAll('addresses_si');
    
    // Handle image upload
    let imageUrl = lawyer.image;
    if (image && image instanceof File) {
      // Implement your image upload logic here
      imageUrl = `/uploads/lawyers/${id}-${Date.now()}-${image.name}`;
    }
    
    // Update lawyer document
    lawyer.contents = [
      { language: 'en', name: name_en, title: title_en, description: description_en },
      { language: 'ta', name: name_ta, title: title_ta, description: description_ta },
      { language: 'si', name: name_si, title: title_si, description: description_si }
    ].filter(content => content.name && content.title);
    
    lawyer.locations = [
      ...locations_en.map(location => ({ language: 'en', location })),
      ...locations_ta.map(location => ({ language: 'ta', location })),
      ...locations_si.map(location => ({ language: 'si', location }))
    ];
    
    lawyer.practiceAreas = [
      ...practiceAreas_en.map(area => ({ language: 'en', practiceArea: area })),
      ...practiceAreas_ta.map(area => ({ language: 'ta', practiceArea: area })),
      ...practiceAreas_si.map(area => ({ language: 'si', practiceArea: area }))
    ];
    
    lawyer.education = [
      ...education_en.map(edu => ({ language: 'en', education: edu })),
      ...education_ta.map(edu => ({ language: 'ta', education: edu })),
      ...education_si.map(edu => ({ language: 'si', education: edu }))
    ];
    
    lawyer.addresses = [
      ...addresses_en.map(addr => ({ language: 'en', address: addr })),
      ...addresses_ta.map(addr => ({ language: 'ta', address: addr })),
      ...addresses_si.map(addr => ({ language: 'si', address: addr }))
    ];
    
    lawyer.contactNumber = contactNumber;
    lawyer.email = email;
    lawyer.website = website;
    lawyer.image = imageUrl;
    lawyer.isFeatured = isFeatured;
    lawyer.isPublished = isPublished;
    
    await lawyer.save();
    
    return NextResponse.json(
      { success: true, msg: "Lawyer updated successfully", lawyer }
    );
    
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lawyer" },
      { status: 500 }
    );
  }
}

// DELETE - Remove lawyer
export async function DELETE(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lawyer ID is required" },
        { status: 400 }
      );
    }
    
    const lawyer = await LawyerModel.findOneAndDelete({ lawyerId: id });
    
    if (!lawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, msg: "Lawyer deleted successfully" }
    );
    
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lawyer" },
      { status: 500 }
    );
  }
}