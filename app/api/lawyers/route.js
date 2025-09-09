import { NextResponse } from "next/server";
import mongoose from "mongoose";
import LawyerModel from "@/lib/models/LawyerModel";
import { ConnectDB } from "@/lib/config/db";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from "@/lib/utils/cloudinaryUpload";

const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
};

// GET all lawyers or single lawyer by slug or ID
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const lawyerId = searchParams.get('id');
    const featured = searchParams.get('featured');
    const admin = searchParams.get('admin');
    const lang = searchParams.get('lang') || 'en';
    const strict = searchParams.get('strict') === 'true'; // Add strict mode parameter
    
    // Get single lawyer by ID for admin
    if (lawyerId && admin === 'true') {
      const lawyer = await LawyerModel.findOne({ lawyerId });
      
      if (!lawyer) {
        return NextResponse.json(
          { success: false, error: "Lawyer not found" },
          { status: 404 }
        );
      }
      
      // Extract content for all languages for admin response
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
    
    if (slug) {
      // Get single lawyer by slug with language-specific content
      const lawyer = await LawyerModel.findOne({ 
        slug, 
        isPublished: admin !== 'true' ? true : { $exists: true } 
      });
      
      if (!lawyer) {
        return NextResponse.json(
          { success: false, error: "Lawyer not found" },
          { status: 404 }
        );
      }
      
      // Extract content in requested language - FIXED: Only show requested language content
      const content = lawyer.contents.find(c => c.language === lang);
      
      // For arrays, filter by the requested language only - FIXED: No fallback to English
      const locations = lawyer.locations
        .filter(l => l.language === lang)
        .map(l => l.location);
      
      const practiceAreas = lawyer.practiceAreas
        .filter(p => p.language === lang)
        .map(p => p.practiceArea);
      
      const education = lawyer.education
        .filter(e => e.language === lang)
        .map(e => e.education);
      
      const addresses = lawyer.addresses
        .filter(a => a.language === lang)
        .map(a => a.address);
      
      return NextResponse.json({ 
        lawyer: {
          _id: lawyer._id,
          lawyerId: lawyer.lawyerId,
          slug: lawyer.slug,
          name: content?.name || "No name available",
          title: content?.title || "No title available",
          description: content?.description || "",
          locations,
          practiceAreas,
          education,
          addresses,
          contactNumber: lawyer.contactNumber,
          email: lawyer.email,
          website: lawyer.website,
          image: lawyer.image,
          isFeatured: lawyer.isFeatured,
          isPublished: lawyer.isPublished,
          date: lawyer.date
        }
      });
    }
    
    // Get all lawyers for admin (including unpublished)
    if (admin === 'true') {
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
    }
    
    // Get all lawyers with optional filters for public
    let filter = { isPublished: true };
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    const lawyers = await LawyerModel.find(filter).sort({ date: -1 });
    
    // Map to include only the requested language content - FIXED: No fallback to English
    const lawyersWithLang = lawyers.map(lawyer => {
      const content = lawyer.contents.find(c => c.language === lang);
      
      const locations = lawyer.locations
        .filter(l => l.language === lang)
        .map(l => l.location);
      
      const practiceAreas = lawyer.practiceAreas
        .filter(p => p.language === lang)
        .map(p => p.practiceArea);
      
      return {
        _id: lawyer._id,
        lawyerId: lawyer.lawyerId,
        slug: lawyer.slug,
        name: content?.name || "No name available",
        title: content?.title || "No title available",
        description: content?.description || "",
        locations,
        practiceAreas,
        image: lawyer.image,
        isFeatured: lawyer.isFeatured,
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

// POST - Create new lawyer with Sinhala support
export async function POST(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    
    // Get basic fields
    const lawyerId = formData.get('lawyerId');
    const name_en = formData.get('name_en');
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const name_ta = formData.get('name_ta');
    const title_ta = formData.get('title_ta');
    const description_ta = formData.get('description_ta');
    const name_si = formData.get('name_si');
    const title_si = formData.get('title_si');
    const description_si = formData.get('description_si');
    const contactNumber = formData.get('contactNumber');
    const email = formData.get('email');
    const website = formData.get('website');
    const isFeatured = formData.get('isFeatured') === 'true';
    const isPublished = formData.get('isPublished') === 'true';
    const imageFile = formData.get('image');

    // Validate required fields
    if (!lawyerId || !name_en || !title_en || !description_en || !contactNumber || !email || !imageFile) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get all array values for all languages
    const locations_en = formData.getAll('locations_en').filter(loc => loc && loc.trim());
    const locations_ta = formData.getAll('locations_ta').filter(loc => loc && loc.trim());
    const locations_si = formData.getAll('locations_si').filter(loc => loc && loc.trim());
    const practiceAreas_en = formData.getAll('practiceAreas_en').filter(area => area && area.trim());
    const practiceAreas_ta = formData.getAll('practiceAreas_ta').filter(area => area && area.trim());
    const practiceAreas_si = formData.getAll('practiceAreas_si').filter(area => area && area.trim());
    const education_en = formData.getAll('education_en').filter(edu => edu && edu.trim());
    const education_ta = formData.getAll('education_ta').filter(edu => edu && edu.trim());
    const education_si = formData.getAll('education_si').filter(edu => edu && edu.trim());
    const addresses_en = formData.getAll('addresses_en').filter(addr => addr && addr.trim());
    const addresses_ta = formData.getAll('addresses_ta').filter(addr => addr && addr.trim());
    const addresses_si = formData.getAll('addresses_si').filter(addr => addr && addr.trim());

    // Generate slug
    const slug = `${name_en.toLowerCase().replace(/\s+/g, '-')}-${title_en.toLowerCase().replace(/\s+/g, '-')}`;

    // Check if lawyer with same ID or slug already exists
    const existingLawyer = await LawyerModel.findOne({
      $or: [{ lawyerId }, { slug }]
    });
    
    if (existingLawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer ID or name/title combination already exists" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await uploadToCloudinary(buffer, 'lawyer-profiles');
    
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    // Prepare multilingual content
    const contents = [
      {
        language: 'en',
        name: name_en,
        title: title_en,
        description: description_en
      }
    ];

    if (name_ta && title_ta && description_ta) {
      contents.push({
        language: 'ta',
        name: name_ta,
        title: title_ta,
        description: description_ta
      });
    }

    if (name_si && title_si && description_si) {
      contents.push({
        language: 'si',
        name: name_si,
        title: title_si,
        description: description_si
      });
    }

    // Prepare multilingual locations
    const locations = [];
    locations_en.forEach((location, index) => {
      if (location) {
        locations.push({
          language: 'en',
          location: location
        });
        
        // Add Tamil location if available at same index
        if (locations_ta[index] && locations_ta[index].trim()) {
          locations.push({
            language: 'ta',
            location: locations_ta[index]
          });
        }
        
        // Add Sinhala location if available at same index
        if (locations_si[index] && locations_si[index].trim()) {
          locations.push({
            language: 'si',
            location: locations_si[index]
          });
        }
      }
    });

    // Prepare multilingual practice areas
    const practiceAreas = [];
    practiceAreas_en.forEach((area, index) => {
      if (area) {
        practiceAreas.push({
          language: 'en',
          practiceArea: area
        });
        
        // Add Tamil practice area if available at same index
        if (practiceAreas_ta[index] && practiceAreas_ta[index].trim()) {
          practiceAreas.push({
            language: 'ta',
            practiceArea: practiceAreas_ta[index]
          });
        }
        
        // Add Sinhala practice area if available at same index
        if (practiceAreas_si[index] && practiceAreas_si[index].trim()) {
          practiceAreas.push({
            language: 'si',
            practiceArea: practiceAreas_si[index]
          });
        }
      }
    });

    // Prepare multilingual education
    const education = [];
    education_en.forEach((edu, index) => {
      if (edu) {
        education.push({
          language: 'en',
          education: edu
        });
        
        // Add Tamil education if available at same index
        if (education_ta[index] && education_ta[index].trim()) {
          education.push({
            language: 'ta',
            education: education_ta[index]
          });
        }
        
        // Add Sinhala education if available at same index
        if (education_si[index] && education_si[index].trim()) {
          education.push({
            language: 'si',
            education: education_si[index]
          });
        }
      }
    });

    // Prepare multilingual addresses
    const addresses = [];
    addresses_en.forEach((addr, index) => {
      if (addr) {
        addresses.push({
          language: 'en',
          address: addr
        });
        
        // Add Tamil address if available at same index
        if (addresses_ta[index] && addresses_ta[index].trim()) {
          addresses.push({
            language: 'ta',
            address: addresses_ta[index]
          });
        }
        
        // Add Sinhala address if available at same index
        if (addresses_si[index] && addresses_si[index].trim()) {
          addresses.push({
            language: 'si',
            address: addresses_si[index]
          });
        }
      }
    });

    // Create lawyer
    const lawyerData = {
      lawyerId,
      contents,
      locations,
      practiceAreas,
      education,
      addresses,
      contactNumber,
      email,
      website: website || '',
      isFeatured,
      isPublished,
      image: uploadResult.secure_url,
      slug
    };

    const newLawyer = await LawyerModel.create(lawyerData);
    console.log("Lawyer Saved Successfully");

    return NextResponse.json({
      success: true,
      msg: "Lawyer Added Successfully",
      data: newLawyer
    });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update lawyer with Sinhala support
export async function PUT(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const lawyerId = searchParams.get('id');

    if (!lawyerId) {
      return NextResponse.json(
        { success: false, error: "Lawyer ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Get all form data for all languages
    const name_en = formData.get('name_en');
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const name_ta = formData.get('name_ta');
    const title_ta = formData.get('title_ta');
    const description_ta = formData.get('description_ta');
    const name_si = formData.get('name_si');
    const title_si = formData.get('title_si');
    const description_si = formData.get('description_si');
    
    const locations_en = formData.getAll('locations_en').filter(loc => loc && loc.trim());
    const locations_ta = formData.getAll('locations_ta').filter(loc => loc && loc.trim());
    const locations_si = formData.getAll('locations_si').filter(loc => loc && loc.trim());
    
    const practiceAreas_en = formData.getAll('practiceAreas_en').filter(area => area && area.trim());
    const practiceAreas_ta = formData.getAll('practiceAreas_ta').filter(area => area && area.trim());
    const practiceAreas_si = formData.getAll('practiceAreas_si').filter(area => area && area.trim());
    
    const education_en = formData.getAll('education_en').filter(edu => edu && edu.trim());
    const education_ta = formData.getAll('education_ta').filter(edu => edu && edu.trim());
    const education_si = formData.getAll('education_si').filter(edu => edu && edu.trim());
    
    const addresses_en = formData.getAll('addresses_en').filter(addr => addr && addr.trim());
    const addresses_ta = formData.getAll('addresses_ta').filter(addr => addr && addr.trim());
    const addresses_si = formData.getAll('addresses_si').filter(addr => addr && addr.trim());
    
    const contactNumber = formData.get('contactNumber');
    const email = formData.get('email');
    const website = formData.get('website');
    const isFeatured = formData.get('isFeatured');
    const isPublished = formData.get('isPublished');
    const imageFile = formData.get('image');

    // Find the existing lawyer
    const existingLawyer = await LawyerModel.findOne({ lawyerId });
    if (!existingLawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }

    let updateData = {};

    // Update basic info if provided
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (email) updateData.email = email;
    if (website !== null) updateData.website = website;
    if (isFeatured !== null) updateData.isFeatured = isFeatured === 'true';
    if (isPublished !== null) updateData.isPublished = isPublished === 'true';

    // Handle image upload if new image is provided
    if (imageFile && imageFile.name !== "undefined" && imageFile.size > 0) {
      // Delete old image from Cloudinary
      if (existingLawyer.image) {
        try {
          const publicId = extractPublicIdFromUrl(existingLawyer.image);
          await deleteFromCloudinary(publicId);
        } catch (error) {
          console.error("Failed to delete old image:", error);
        }
      }

      // Upload new image
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadToCloudinary(buffer, 'lawyer-profiles');
      
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      
      updateData.image = uploadResult.secure_url;
    }

    // Update multilingual content - FIXED: Replace instead of push
    if (name_en || title_en || description_en) {
      updateData.contents = existingLawyer.contents.filter(c => c.language !== 'en');
      
      updateData.contents.push({
        language: 'en',
        name: name_en || existingLawyer.contents.find(c => c.language === 'en')?.name || '',
        title: title_en || existingLawyer.contents.find(c => c.language === 'en')?.title || '',
        description: description_en || existingLawyer.contents.find(c => c.language === 'en')?.description || ''
      });
    }

    if (name_ta || title_ta || description_ta) {
      updateData.contents = updateData.contents || [...existingLawyer.contents];
      
      // Remove existing Tamil content if it exists
      updateData.contents = updateData.contents.filter(c => c.language !== 'ta');
      
      if (name_ta || title_ta || description_ta) {
        updateData.contents.push({
          language: 'ta',
          name: name_ta || existingLawyer.contents.find(c => c.language === 'ta')?.name || '',
          title: title_ta || existingLawyer.contents.find(c => c.language === 'ta')?.title || '',
          description: description_ta || existingLawyer.contents.find(c => c.language === 'ta')?.description || ''
        });
      }
    }

    if (name_si || title_si || description_si) {
      updateData.contents = updateData.contents || [...existingLawyer.contents];
      
      // Remove existing Sinhala content if it exists
      updateData.contents = updateData.contents.filter(c => c.language !== 'si');
      
      if (name_si || title_si || description_si) {
        updateData.contents.push({
          language: 'si',
          name: name_si || existingLawyer.contents.find(c => c.language === 'si')?.name || '',
          title: title_si || existingLawyer.contents.find(c => c.language === 'si')?.title || '',
          description: description_si || existingLawyer.contents.find(c => c.language === 'si')?.description || ''
        });
      }
    }

    // Update multilingual locations - FIXED: Replace arrays instead of pushing
    if (locations_en.length > 0 || locations_ta.length > 0 || locations_si.length > 0) {
      updateData.locations = [];
      
      // Add English locations
      locations_en.forEach(location => {
        if (location) {
          updateData.locations.push({
            language: 'en',
            location: location
          });
        }
      });

      // Add Tamil locations
      locations_ta.forEach(location => {
        if (location) {
          updateData.locations.push({
            language: 'ta',
            location: location
          });
        }
      });

      // Add Sinhala locations
      locations_si.forEach(location => {
        if (location) {
          updateData.locations.push({
            language: 'si',
            location: location
          });
        }
      });
    }

    // Update multilingual practice areas - FIXED: Replace arrays instead of pushing
    if (practiceAreas_en.length > 0 || practiceAreas_ta.length > 0 || practiceAreas_si.length > 0) {
      updateData.practiceAreas = [];
      
      // Add English practice areas
      practiceAreas_en.forEach(area => {
        if (area) {
          updateData.practiceAreas.push({
            language: 'en',
            practiceArea: area
          });
        }
      });

      // Add Tamil practice areas
      practiceAreas_ta.forEach(area => {
        if (area) {
          updateData.practiceAreas.push({
            language: 'ta',
            practiceArea: area
          });
        }
      });

      // Add Sinhala practice areas
      practiceAreas_si.forEach(area => {
        if (area) {
          updateData.practiceAreas.push({
            language: 'si',
            practiceArea: area
          });
        }
      });
    }

    // Update multilingual education - FIXED: Replace arrays instead of pushing
    if (education_en.length > 0 || education_ta.length > 0 || education_si.length > 0) {
      updateData.education = [];
      
      // Add English education
      education_en.forEach(edu => {
        if (edu) {
          updateData.education.push({
            language: 'en',
            education: edu
          });
        }
      });

      // Add Tamil education
      education_ta.forEach(edu => {
        if (edu) {
          updateData.education.push({
            language: 'ta',
            education: edu
          });
        }
      });

      // Add Sinhala education
      education_si.forEach(edu => {
        if (edu) {
          updateData.education.push({
            language: 'si',
            education: edu
          });
        }
      });
    }

    // Update multilingual addresses - FIXED: Replace arrays instead of pushing
    if (addresses_en.length > 0 || addresses_ta.length > 0 || addresses_si.length > 0) {
      updateData.addresses = [];
      
      // Add English addresses
      addresses_en.forEach(addr => {
        if (addr) {
          updateData.addresses.push({
            language: 'en',
            address: addr
          });
        }
      });

      // Add Tamil addresses
      addresses_ta.forEach(addr => {
        if (addr) {
          updateData.addresses.push({
            language: 'ta',
            address: addr
          });
        }
      });

      // Add Sinhala addresses
      addresses_si.forEach(addr => {
        if (addr) {
          updateData.addresses.push({
            language: 'si',
            address: addr
          });
        }
      });
    }

    const updatedLawyer = await LawyerModel.findOneAndUpdate(
      { lawyerId },
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      msg: "Lawyer Updated Successfully",
      data: updatedLawyer
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove lawyer (keep as is)
export async function DELETE(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const lawyerId = searchParams.get('id');

    if (!lawyerId) {
      return NextResponse.json(
        { success: false, error: "Lawyer ID is required" },
        { status: 400 }
      );
    }

    // Find the lawyer first to get the image URL for cleanup
    const lawyer = await LawyerModel.findOne({ lawyerId });
    
    if (!lawyer) {
      return NextResponse.json(
        { success: false, error: "Lawyer not found" },
        { status: 404 }
      );
    }

    // Delete the image from Cloudinary if it exists
    if (lawyer.image) {
      try {
        const publicId = extractPublicIdFromUrl(lawyer.image);
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    // Delete the lawyer from database
    await LawyerModel.findOneAndDelete({ lawyerId });

    return NextResponse.json({
      success: true,
      msg: "Lawyer deleted successfully"
    });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete lawyer" },
      { status: 500 }
    );
  }
}