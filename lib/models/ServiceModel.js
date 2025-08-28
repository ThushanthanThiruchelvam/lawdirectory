import mongoose from 'mongoose';

const serviceContentSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta']
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

const serviceSchema = new mongoose.Schema({
  contents: [serviceContentSchema],
  icon: {
    type: String,
    default: 'default-service-icon'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const ServiceModel = mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default ServiceModel;