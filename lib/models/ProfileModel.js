import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta', 'si'] // Added 'si' for Sinhala
  },
  fullName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});

const contactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  whatsapp: String,
  facebook: String,
  instagram: String,
  twitter: String,
});

const Schema = new mongoose.Schema({
  contents: [contentSchema],
  contacts: contactSchema,
  profileImage: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  logoLight: {
    type: String,
    required: true
  },
  mapEmbedUrl: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ProfileModel = mongoose.models.Profile || mongoose.model("Profile", Schema);
export default ProfileModel;