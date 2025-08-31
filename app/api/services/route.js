import { ConnectDB } from '@/lib/config/db';
import ServiceModel from '@/lib/models/ServiceModel';
import { NextResponse } from 'next/server';
import { uploadToCloudinary, extractPublicIdFromUrl, deleteFromCloudinary } from '@/lib/utils/cloudinaryUpload';
import mongoose from 'mongoose';

const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
};

// GET all services or single service
export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');
    const lang = searchParams.get('lang') || 'en';
    
    if (serviceId) {
      // Fetch single service by ID
      try {
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
          return NextResponse.json(
            { success: false, error: "Service not found" },
            { status: 404 }
          );
        }
        
        // Find content in the requested language, fallback to English
        const content = service.contents.find(c => c.language === lang) || 
                       service.contents.find(c => c.language === 'en') ||
                       service.contents[0];
        
        return NextResponse.json({ 
          service: {
            _id: service._id,
            title: content?.title || "No title",
            description: content?.description || "",
            icon: service.icon,
            order: service.order,
            isActive: service.isActive
          }
        });
      } catch (error) {
        console.error("Error fetching single service:", error);
        return NextResponse.json(
          { success: false, error: "Invalid service ID" },
          { status: 400 }
        );
      }
    } else {
      // Fetch all active services, sorted by order
      const services = await ServiceModel.find({ isActive: true }).sort({ order: 1 });
      
      // Map to include only the requested language content
      const servicesWithLang = services.map(service => {
        const content = service.contents.find(c => c.language === lang) || 
                       service.contents.find(c => c.language === 'en') ||
                       service.contents[0];
        
        return {
          _id: service._id,
          title: content?.title || "No title",
          description: content?.description || "",
          icon: service.icon,
          order: service.order
        };
      });
      
      return NextResponse.json({ services: servicesWithLang });
    }
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    
    // Get form data for all languages
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const title_ta = formData.get('title_ta');
    const description_ta = formData.get('description_ta');
    const title_si = formData.get('title_si');
    const description_si = formData.get('description_si');
    const order = formData.get('order') || 0;
    const iconFile = formData.get('icon');

    // Validate required fields
    if (!title_en || !description_en) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for English content" },
        { status: 400 }
      );
    }

    let iconUrl = 'default-service-icon';

    // Handle icon upload if provided
    if (iconFile && iconFile.name !== "undefined" && iconFile.size > 0) {
      const arrayBuffer = await iconFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadToCloudinary(buffer, 'service-icons');
      
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      
      iconUrl = uploadResult.secure_url;
    }

    const serviceData = {
      contents: [
        {
          language: 'en',
          title: title_en,
          description: description_en
        }
      ],
      order: parseInt(order),
      icon: iconUrl
    };

    // Add Tamil content if provided
    if (title_ta && description_ta) {
      serviceData.contents.push({
        language: 'ta',
        title: title_ta,
        description: description_ta
      });
    }

    // Add Sinhala content if provided
    if (title_si && description_si) {
      serviceData.contents.push({
        language: 'si',
        title: title_si,
        description: description_si
      });
    }

    const newService = await ServiceModel.create(serviceData);

    return NextResponse.json({
      success: true,
      msg: "Service Added Successfully",
      data: newService
    });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update service
export async function PUT(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Get form data for all languages
    const title_en = formData.get('title_en');
    const description_en = formData.get('description_en');
    const title_ta = formData.get('title_ta');
    const description_ta = formData.get('description_ta');
    const title_si = formData.get('title_si');
    const description_si = formData.get('description_si');
    const order = formData.get('order');
    const isActive = formData.get('isActive');
    const iconFile = formData.get('icon');

    // Find the existing service
    const existingService = await ServiceModel.findById(serviceId);
    if (!existingService) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    let updateData = {};

    // Handle order update
    if (order !== null) {
      updateData.order = parseInt(order);
    }

    // Handle active status update
    if (isActive !== null) {
      updateData.isActive = isActive === 'true';
    }

    // Handle icon upload if new icon is provided
    if (iconFile && iconFile.name !== "undefined" && iconFile.size > 0) {
      const arrayBuffer = await iconFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadToCloudinary(buffer, 'service-icons');
      
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      
      updateData.icon = uploadResult.secure_url;
    }

    // Prepare contents array
    if (title_en && description_en) {
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

      // Add Sinhala content if provided
      if (title_si && description_si) {
        updateData.contents.push({
          language: 'si',
          title: title_si,
          description: description_si
        });
      }
    }

    const updatedService = await ServiceModel.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      msg: "Service Updated Successfully",
      data: updatedService
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove service
export async function DELETE(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Find the service first to get the icon URL for cleanup
    const service = await ServiceModel.findById(serviceId);
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete the icon from Cloudinary if it exists and is not default
    if (service.icon && service.icon !== 'default-service-icon') {
      try {
        const publicId = extractPublicIdFromUrl(service.icon);
        await deleteFromCloudinary(publicId);
        console.log(`Deleted icon from Cloudinary: ${publicId}`);
      } catch (cloudinaryError) {
        console.error("Failed to delete icon from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete the service from database
    await ServiceModel.findByIdAndDelete(serviceId);

    return NextResponse.json({
      success: true,
      msg: "Service deleted successfully"
    });

  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to delete service" 
      },
      { status: 500 }
    );
  }
}