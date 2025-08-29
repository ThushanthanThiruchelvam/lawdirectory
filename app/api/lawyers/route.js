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

// GET all lawyers or single lawyer by slug
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured');
    const admin = searchParams.get('admin');
    
    if (slug) {
      // Get single lawyer by slug
      const lawyer = await LawyerModel.findOne({ slug, isPublished: true });
      if (!lawyer) {
        return NextResponse.json(
          { success: false, error: "Lawyer not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ lawyer });
    }
    
    // Get all lawyers for admin (including unpublished)
    if (admin === 'true') {
      const lawyers = await LawyerModel.find({}).sort({ date: -1 });
      return NextResponse.json({ lawyers });
    }
    
    // Get all lawyers with optional filters for public
    let filter = { isPublished: true };
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    const lawyers = await LawyerModel.find(filter).sort({ date: -1 });
    return NextResponse.json({ lawyers });
    
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
    
    const lawyerId = formData.get('lawyerId');
    const name = formData.get('name');
    const title = formData.get('title');
    const description = formData.get('description');
    const locations = formData.getAll('locations');
    const practiceAreas = formData.getAll('practiceAreas');
    const isFeatured = formData.get('isFeatured') === 'true';
    const isPublished = formData.get('isPublished') === 'true';
    const imageFile = formData.get('image');

    // Validate required fields
    if (!lawyerId || !name || !title || !description || locations.length === 0 || 
        practiceAreas.length === 0 || !imageFile) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = `${name.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}`;

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

    // Create lawyer
    const lawyerData = {
      lawyerId,
      name,
      title,
      slug,
      description,
      locations,
      practiceAreas,
      isFeatured,
      isPublished,
      image: uploadResult.secure_url
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

// PUT - Update lawyer
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
    
    // Get all possible fields from form data
    const name = formData.get('name');
    const title = formData.get('title');
    const description = formData.get('description');
    const locations = formData.getAll('locations');
    const practiceAreas = formData.getAll('practiceAreas');
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

    // Only update fields that are provided
    if (name) updateData.name = name;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (locations.length > 0) updateData.locations = locations;
    if (practiceAreas.length > 0) updateData.practiceAreas = practiceAreas;
    if (isFeatured !== null) updateData.isFeatured = isFeatured === 'true';
    if (isPublished !== null) updateData.isPublished = isPublished === 'true';

    // Generate new slug if name or title changed
    if (name || title) {
      const newName = name || existingLawyer.name;
      const newTitle = title || existingLawyer.title;
      const newSlug = `${newName.toLowerCase().replace(/\s+/g, '-')}-${newTitle.toLowerCase().replace(/\s+/g, '-')}`;
      
      // Check if another lawyer already has this slug (excluding current lawyer)
      if (newSlug !== existingLawyer.slug) {
        const lawyerWithSameSlug = await LawyerModel.findOne({ 
          slug: newSlug, 
          lawyerId: { $ne: lawyerId } 
        });
        
        if (lawyerWithSameSlug) {
          return NextResponse.json(
            { success: false, error: "Another lawyer with similar name/title already exists" },
            { status: 400 }
          );
        }
        updateData.slug = newSlug;
      }
    }

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

// DELETE - Remove lawyer
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