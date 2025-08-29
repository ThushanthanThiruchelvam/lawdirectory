import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  lawyerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  locations: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: true
  },
  practiceAreas: [{
    type: String,
    required: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const LawyerModel = mongoose.models.Lawyer || mongoose.model("Lawyer", Schema);

export default LawyerModel;