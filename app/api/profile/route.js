import { ConnectDB } from '@/lib/config/db';
import ProfileModel from '@/lib/models/ProfileModel';
import { NextResponse } from 'next/server';
import { uploadToCloudinary, extractPublicIdFromUrl, deleteFromCloudinary } from '@/lib/utils/cloudinaryUpload';
import mongoose from 'mongoose';

const connectToDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await ConnectDB();
  }
};

export async function GET(request) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    
    // Get profile data
    let profile = await ProfileModel.findOne({});
    
    if (!profile) {
      // Create default profile if none exists
      profile = await ProfileModel.create({
        contents: [
          {
            language: 'en',
            fullName: 'Your Name',
            title: 'Your Title',
            tagline: 'Your Tagline',
            about: 'About section content',
            address: 'Your Address'
          },
          {
            language: 'ta',
            fullName: 'உங்கள் பெயர்',
            title: 'உங்கள் தலைப்பு',
            tagline: 'உங்கள் டேக்லைன்',
            about: 'பற்றி பகுதி உள்ளடக்கம்',
            address: 'உங்கள் முகவரி'
          }
        ],
        contacts: {
          phone: '+1234567890',
          email: 'your@email.com',
          whatsapp: '+1234567890',
          facebook: 'https://facebook.com/yourprofile',
          instagram: 'https://instagram.com/yourprofile',
          twitter: 'https://twitter.com/yourprofile'
        },
        profileImage: '/default-profile.jpg',
        logo: '/default-logo.jpg',
        logoLight: '/default-logo-light.jpg',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=...'
      });
    }
    
    // Find content in the requested language, fallback to English
    const content = profile.contents.find(c => c.language === lang) || 
                   profile.contents.find(c => c.language === 'en') ||
                   profile.contents[0];
    
    return NextResponse.json({ 
      profile: {
        _id: profile._id,
        fullName: content.fullName,
        title: content.title,
        tagline: content.tagline,
        about: content.about,
        address: content.address,
        contacts: profile.contacts,
        profileImage: profile.profileImage,
        logo: profile.logo,
        logoLight: profile.logoLight,
        mapEmbedUrl: profile.mapEmbedUrl
      }
    });
  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectToDB();

    const formData = await request.formData();
    
    // Get form data for both languages
    const fullName_en = formData.get('fullName_en');
    const title_en = formData.get('title_en');
    const tagline_en = formData.get('tagline_en');
    const about_en = formData.get('about_en');
    const address_en = formData.get('address_en');
    
    const fullName_ta = formData.get('fullName_ta');
    const title_ta = formData.get('title_ta');
    const tagline_ta = formData.get('tagline_ta');
    const about_ta = formData.get('about_ta');
    const address_ta = formData.get('address_ta');
    
    // Contact information
    const phone = formData.get('phone');
    const email = formData.get('email');
    const whatsapp = formData.get('whatsapp');
    const facebook = formData.get('facebook');
    const instagram = formData.get('instagram');
    const twitter = formData.get('twitter');
    const mapEmbedUrl = formData.get('mapEmbedUrl');
    
    const imageFile = formData.get('profileImage');
    const logoFile = formData.get('logo');
    const logoLightFile = formData.get('logoLight');

    // Validate required fields for English
    if (!fullName_en || !title_en || !tagline_en || !about_en || !address_en) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for English content" },
        { status: 400 }
      );
    }

    // Find the existing profile
    let profile = await ProfileModel.findOne({});
    if (!profile) {
      // Create new profile if none exists
      profile = new ProfileModel();
    }

    let updateData = {
      contents: [
        {
          language: 'en',
          fullName: fullName_en,
          title: title_en,
          tagline: tagline_en,
          about: about_en,
          address: address_en
        }
      ],
      contacts: {
        phone: phone || '',
        email: email || '',
        whatsapp: whatsapp || '',
        facebook: facebook || '',
        instagram: instagram || '',
        twitter: twitter || ''
      },
      mapEmbedUrl: mapEmbedUrl || '',
      updatedAt: new Date()
    };

    // Add Tamil content if provided
    if (fullName_ta && title_ta && tagline_ta && about_ta && address_ta) {
      updateData.contents.push({
        language: 'ta',
        fullName: fullName_ta,
        title: title_ta,
        tagline: tagline_ta,
        about: about_ta,
        address: address_ta
      });
    }

    // Handle profile image upload if new image is provided
    if (imageFile && imageFile.name !== "undefined" && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadToCloudinary(buffer, 'profile-images');
      
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      
      updateData.profileImage = uploadResult.secure_url;
    } else {
      // Keep the existing image if no new image is provided
      updateData.profileImage = profile.profileImage;
    }

    // Handle logo upload if new logo is provided
    if (logoFile && logoFile.name !== "undefined" && logoFile.size > 0) {
      const arrayBuffer = await logoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadToCloudinary(buffer, 'logos');
      
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      
      updateData.logo = uploadResult.secure_url;
    } else {
      // Keep the existing logo if no new logo is provided
      updateData.logo = profile.logo;
    }

    // Handle light logo upload if new logo is provided
    if (logoLightFile && logoLightFile.name !== "undefined" && logoLightFile.size > 0) {
      const arrayBuffer = await logoLightFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await uploadToCloudinary(buffer, 'logos');
      
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      
      updateData.logoLight = uploadResult.secure_url;
    } else {
      // Keep the existing light logo if no new logo is provided
      updateData.logoLight = profile.logoLight;
    }

    // Update or create the profile
    const updatedProfile = await ProfileModel.findOneAndUpdate(
      {},
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      msg: "Profile Updated Successfully",
      data: updatedProfile
    });

  } catch (error) {
    console.error("PUT Profile Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}