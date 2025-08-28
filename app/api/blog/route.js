
import mongoose from "mongoose";
import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { uploadToCloudinary, extractPublicIdFromUrl, deleteFromCloudinary  } from "@/lib/utils/cloudinaryUpload";

const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
};

export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('id');
    const lang = searchParams.get('lang') || 'en';
    
    if (blogId) {
      // Fetch single blog by ID - Return content in requested language
      try {
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
          return NextResponse.json(
            { success: false, error: "Blog not found" },
            { status: 404 }
          );
        }
        
        // Find content in the requested language, fallback to English
        const content = blog.contents.find(c => c.language === lang) || 
                       blog.contents.find(c => c.language === 'en') ||
                       blog.contents[0]; // Fallback to first available
        
        // Return blog with content in the requested language
        return NextResponse.json({ 
          blog: {
            _id: blog._id,
            title: content?.title || "No title",
            description: content?.description || "",
            category: blog.category,
            image: blog.image,
            date: blog.date
          }
        });
      } catch (error) {
        console.error("Error fetching single blog:", error);
        return NextResponse.json(
          { success: false, error: "Invalid blog ID" },
          { status: 400 }
        );
      }
    } else {
      // Fetch all blogs (for listing) - Return only requested language
      const blogs = await BlogModel.find({}).sort({ date: -1 });
      
      // Map to include only the requested language content
      const blogsWithLang = blogs.map(blog => {
        const content = blog.contents.find(c => c.language === lang) || 
                       blog.contents.find(c => c.language === 'en');
        
        return {
          _id: blog._id,
          title: content?.title || "No title",
          description: content?.description || "",
          category: blog.category,
          image: blog.image,
          date: blog.date
        };
      });
      
      return NextResponse.json({ blogs: blogsWithLang });
    }
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    
    // Get form data for both languages
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const title_ta = formData.get('title_ta');
    const description_ta = formData.get('description_ta');
    const category = formData.get('category');
    const imageFile = formData.get('image');

    // Validate required fields
    if (!title_en || !description_en || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for English content" },
        { status: 400 }
      );
    }

    // Validate image file
    if (!imageFile || imageFile.name === "undefined" || imageFile.size === 0) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResult = await uploadToCloudinary(buffer, 'blog-images');
    
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    const blogData = {
      contents: [
        {
          language: 'en',
          title: title_en,
          description: description_en
        }
      ],
      category,
      image: uploadResult.secure_url,
      date: new Date()
    };

    // Add Tamil content if provided
    if (title_ta && description_ta) {
      blogData.contents.push({
        language: 'ta',
        title: title_ta,
        description: description_ta
      });
    }

    const newBlog = await BlogModel.create(blogData);
    console.log("Blog Saved Successfully");

    return NextResponse.json({
      success: true,
      msg: "Blog Added Successfully",
      data: newBlog
    });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Similarly update PUT and DELETE methods to handle multilingual content
// ... (rest of your existing code with similar modifications)
export async function DELETE(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('id');

    if (!blogId) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    // Find the blog first to get the image URL for cleanup
    const blog = await BlogModel.findById(blogId);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Delete the image from Cloudinary if it exists
    if (blog.image) {
      try {
        const publicId = extractPublicIdFromUrl(blog.image);
        await deleteFromCloudinary(publicId);
        console.log(`Deleted image from Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error("Failed to delete image from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete the blog from database
    await BlogModel.findByIdAndDelete(blogId);

    return NextResponse.json({
      success: true,
      msg: "Blog deleted successfully"
    });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to delete blog" 
      },
      { status: 500 }
    );
  }
}
// pages/api/blog.js - Complete PUT method
export async function PUT(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('id');

    if (!blogId) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Get form data for both languages
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const title_ta = formData.get('title_ta');
    const description_ta = formData.get('description_ta');
    const category = formData.get('category');
    const imageFile = formData.get('image');

    // Validate required fields
    if (!title_en || !description_en || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for English content" },
        { status: 400 }
      );
    }

    // Find the existing blog
    const existingBlog = await BlogModel.findById(blogId);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    let updateData = {
      category,
      date: new Date()
    };

    // Handle image upload if new image is provided
    if (imageFile && imageFile.name !== "undefined" && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadToCloudinary(buffer, 'blog-images');
      
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      
      updateData.image = uploadResult.secure_url;
    } else {
      // Keep the existing image if no new image is provided
      updateData.image = existingBlog.image;
    }

    // Prepare contents array
    updateData.contents = [
      {
        language: 'en',
        title: title_en,
        description: description_en
      }
    ];

    // Add Tamil content if provided
    if (title_ta && description_ta) {
      updateData.contents.push({
        language: 'ta',
        title: title_ta,
        description: description_ta
      });
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      msg: "Blog Updated Successfully",
      data: updatedBlog
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}