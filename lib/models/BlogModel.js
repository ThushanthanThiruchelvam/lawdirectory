import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta', 'si'] // Added 'si' for Sinhala
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Schema = new mongoose.Schema({
  contents: [contentSchema],
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Drop the existing collection or update the schema validation
const BlogModel = mongoose.models.Blog || mongoose.model("Blog", Schema);

export default BlogModel;