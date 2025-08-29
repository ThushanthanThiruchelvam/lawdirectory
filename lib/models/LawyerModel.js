import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta']
  },
  name: {
    type: String,
    required: true
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

const locationSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta']
  },
  location: {
    type: String,
    required: true
  }
});

const practiceAreaSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta']
  },
  practiceArea: {
    type: String,
    required: true
  }
});

const educationSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta']
  },
  education: {
    type: String,
    required: true
  }
});

const addressSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta']
  },
  address: {
    type: String,
    required: true
  }
});

const lawyerSchema = new mongoose.Schema({
  lawyerId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contents: {
    type: [contentSchema],
    required: true,
    validate: {
      validator: function(contents) {
        // Must have at least one content entry
        return contents && contents.length > 0;
      },
      message: 'At least one content entry is required'
    }
  },
  locations: {
    type: [locationSchema],
    required: true,
    validate: {
      validator: function(locations) {
        // Must have at least one location
        return locations && locations.length > 0;
      },
      message: 'At least one location is required'
    }
  },
  practiceAreas: {
    type: [practiceAreaSchema],
    required: true,
    validate: {
      validator: function(practiceAreas) {
        // Must have at least one practice area
        return practiceAreas && practiceAreas.length > 0;
      },
      message: 'At least one practice area is required'
    }
  },
  education: {
    type: [educationSchema],
    required: true,
    validate: {
      validator: function(education) {
        // Must have at least one education entry
        return education && education.length > 0;
      },
      message: 'At least one education entry is required'
    }
  },
  addresses: {
    type: [addressSchema],
    required: true,
    validate: {
      validator: function(addresses) {
        // Must have at least one address
        return addresses && addresses.length > 0;
      },
      message: 'At least one address is required'
    }
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
lawyerSchema.pre('save', function(next) {
  if (this.isModified('contents') || !this.slug) {
    const englishContent = this.contents.find(content => content.language === 'en') || this.contents[0];
    if (englishContent && englishContent.name && englishContent.title) {
      const baseSlug = `${englishContent.name.toLowerCase().replace(/\s+/g, '-')}-${englishContent.title.toLowerCase().replace(/\s+/g, '-')}`;
      this.slug = baseSlug;
      
      // Add timestamp to make it unique if needed
      const timestamp = Date.now().toString(36);
      this.slug = `${baseSlug}-${timestamp}`;
    }
  }
  next();
});

// Index for better query performance
lawyerSchema.index({ lawyerId: 1 });
lawyerSchema.index({ slug: 1 });
lawyerSchema.index({ isPublished: 1, isFeatured: 1 });
lawyerSchema.index({ 'contents.language': 1 });

// Virtual for English content
lawyerSchema.virtual('name_en').get(function() {
  const englishContent = this.contents.find(content => content.language === 'en');
  return englishContent ? englishContent.name : '';
});

lawyerSchema.virtual('title_en').get(function() {
  const englishContent = this.contents.find(content => content.language === 'en');
  return englishContent ? englishContent.title : '';
});

lawyerSchema.virtual('description_en').get(function() {
  const englishContent = this.contents.find(content => content.language === 'en');
  return englishContent ? englishContent.description : '';
});

// Virtual for Tamil content
lawyerSchema.virtual('name_ta').get(function() {
  const tamilContent = this.contents.find(content => content.language === 'ta');
  return tamilContent ? tamilContent.name : '';
});

lawyerSchema.virtual('title_ta').get(function() {
  const tamilContent = this.contents.find(content => content.language === 'ta');
  return tamilContent ? tamilContent.title : '';
});

lawyerSchema.virtual('description_ta').get(function() {
  const tamilContent = this.contents.find(content => content.language === 'ta');
  return tamilContent ? tamilContent.description : '';
});

// Virtual for English arrays
lawyerSchema.virtual('locations_en').get(function() {
  return this.locations
    .filter(location => location.language === 'en')
    .map(location => location.location);
});

lawyerSchema.virtual('practiceAreas_en').get(function() {
  return this.practiceAreas
    .filter(area => area.language === 'en')
    .map(area => area.practiceArea);
});

lawyerSchema.virtual('education_en').get(function() {
  return this.education
    .filter(edu => edu.language === 'en')
    .map(edu => edu.education);
});

lawyerSchema.virtual('addresses_en').get(function() {
  return this.addresses
    .filter(address => address.language === 'en')
    .map(address => address.address);
});

// Virtual for Tamil arrays
lawyerSchema.virtual('locations_ta').get(function() {
  return this.locations
    .filter(location => location.language === 'ta')
    .map(location => location.location);
});

lawyerSchema.virtual('practiceAreas_ta').get(function() {
  return this.practiceAreas
    .filter(area => area.language === 'ta')
    .map(area => area.practiceArea);
});

lawyerSchema.virtual('education_ta').get(function() {
  return this.education
    .filter(edu => edu.language === 'ta')
    .map(edu => edu.education);
});

lawyerSchema.virtual('addresses_ta').get(function() {
  return this.addresses
    .filter(address => address.language === 'ta')
    .map(address => address.address);
});

// Method to get content by language
lawyerSchema.methods.getContentByLanguage = function(language = 'en') {
  return this.contents.find(content => content.language === language) || 
         this.contents.find(content => content.language === 'en') ||
         this.contents[0];
};

// Method to get locations by language
lawyerSchema.methods.getLocationsByLanguage = function(language = 'en') {
  const locations = this.locations.filter(loc => loc.language === language);
  if (locations.length === 0 && language !== 'en') {
    return this.locations.filter(loc => loc.language === 'en');
  }
  return locations.map(loc => loc.location);
};

// Method to get practice areas by language
lawyerSchema.methods.getPracticeAreasByLanguage = function(language = 'en') {
  const areas = this.practiceAreas.filter(area => area.language === language);
  if (areas.length === 0 && language !== 'en') {
    return this.practiceAreas.filter(area => area.language === 'en');
  }
  return areas.map(area => area.practiceArea);
};

// Static method to find by slug with language support
lawyerSchema.statics.findBySlug = function(slug, language = 'en') {
  return this.findOne({ slug }).then(lawyer => {
    if (!lawyer) return null;
    
    return {
      ...lawyer.toObject(),
      name: lawyer.getContentByLanguage(language).name,
      title: lawyer.getContentByLanguage(language).title,
      description: lawyer.getContentByLanguage(language).description,
      locations: lawyer.getLocationsByLanguage(language),
      practiceAreas: lawyer.getPracticeAreasByLanguage(language)
    };
  });
};

const LawyerModel = mongoose.models.Lawyer || mongoose.model("Lawyer", lawyerSchema);

export default LawyerModel;