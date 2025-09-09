import mongoose from "mongoose";

// Helper function to get practice area translations
const getPracticeAreaTranslations = () => {
  return [
    { en: 'Criminal Law', ta: 'குற்றவியல் சட்டம்', si: 'අපරාධ නීතිය' },
    { en: 'Civil Law', ta: 'சிவில் சட்டம்', si: 'නාගරික නීතිය' },
    { en: 'Corporate Law', ta: 'நிறுவன சட்டம்', si: 'ක cooperate නීතිය' },
    { en: 'Family Law', ta: 'குடும்ப சட்டம்', si: 'පවුල් නීතිය' },
    { en: 'Employment Law', ta: 'உட்படும் சட்டம்', si: 'රැකියා නීතිය' },
    { en: 'Constitutional Law', ta: 'அரசியலமைப்புச் சட்டம்', si: 'ආණ්ඩුධර්ම නීතිය' },
    { en: 'Property Law', ta: 'சொத்து சட்டம்', si: 'දේපළ නීතිය' },
    { en: 'Tax Law', ta: 'வரி சட்டம்', si: 'බදු නීතිය' },
    { en: 'Maritime Law', ta: 'கடல் சட்டம்', si: 'සමුද්‍රීය නීතිය' },
    { en: 'Environmental Law', ta: 'சுற்றுச்சூழல் சட்டம்', si: 'පාරිසරික නීතිය' }
  ];
};

// Helper function to get location translations
// Helper function to get location translations
const getLocationTranslations = () => {
  return [
    { en: 'Colombo', ta: 'கொழும்பு', si: 'කොළඹ' },
    { en: 'Gampaha', ta: 'கம்பஹா', si: 'ගම්පහ' },
    { en: 'Kalutara', ta: 'களுத்துறை', si: 'කළුතර' },
    { en: 'Kandy', ta: 'கண்டி', si: 'මහනුවර' },
    { en: 'Matale', ta: 'மாத்தளை', si: 'මාතලේ' },
    { en: 'Nuwara Eliya', ta: 'நுவரெலியா', si: 'නුවරඑළිය' },
    { en: 'Galle', ta: 'காலி', si: 'ගාල්ල' },
    { en: 'Matara', ta: 'மாத்தறை', si: 'මාතර' },
    { en: 'Hambantota', ta: 'அம்பாந்தோட்டை', si: 'හම්බන්තොට' },
    { en: 'Jaffna', ta: 'யாழ்ப்பாணம்', si: 'යාපනය' },
    { en: 'Kilinochchi', ta: 'கிளிநொச்சி', si: 'කිලිනොච්චිය' },
    { en: 'Mannar', ta: 'மன்னார்', si: 'මන්නාරම' },
    { en: 'Vavuniya', ta: 'வவுனியா', si: 'වවුනියාව' },
    { en: 'Mullaitivu', ta: 'முல்லைத்தீவு', si: 'මුලතිව්' },
    { en: 'Batticaloa', ta: 'மட்டக்களப்பு', si: 'මඩකලපුව' },
    { en: 'Ampara', ta: 'அம்பாறை', si: 'අම්පාර' },
    { en: 'Trincomalee', ta: 'திருகோணமலை', si: 'ත්රිකුණාමලය' },
    { en: 'Kurunegala', ta: 'குருநாகல்', si: 'කුරුණෑගල' },
    { en: 'Puttalam', ta: 'புத்தளம்', si: 'පුත්තලම' },
    { en: 'Anuradhapura', ta: 'அனுராதபுரம்', si: 'අනුරාධපුරය' },
    { en: 'Polonnaruwa', ta: 'பொலன்னறுவை', si: 'පොළොන්නරුව' },
    { en: 'Badulla', ta: 'பதுளை', si: 'බදුල්ල' },
    { en: 'Monaragala', ta: 'மொணராகலை', si: 'මොණරාගල' },
    { en: 'Ratnapura', ta: 'இரத்தினபுரி', si: 'රත්නපුර' },
    { en: 'Kegalle', ta: 'கேகாலை', si: 'කෑගල්ල' }
  ];
};

const contentSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta', 'si']
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
    enum: ['en', 'ta', 'si']
  },
  location: {
    type: String,
    required: true,
    enum: getLocationTranslations().flatMap(loc => [loc.en, loc.ta, loc.si])
  }
});

const practiceAreaSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta', 'si']
  },
  practiceArea: {
    type: String,
    required: true,
    enum: getPracticeAreaTranslations().flatMap(area => [area.en, area.ta, area.si])
  }
});

const educationSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ta', 'si']
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
    enum: ['en', 'ta', 'si']
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

// Virtual for Sinhala content
lawyerSchema.virtual('name_si').get(function() {
  const sinhalaContent = this.contents.find(content => content.language === 'si');
  return sinhalaContent ? sinhalaContent.name : '';
});

lawyerSchema.virtual('title_si').get(function() {
  const sinhalaContent = this.contents.find(content => content.language === 'si');
  return sinhalaContent ? sinhalaContent.title : '';
});

lawyerSchema.virtual('description_si').get(function() {
  const sinhalaContent = this.contents.find(content => content.language === 'si');
  return sinhalaContent ? sinhalaContent.description : '';
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

// Virtual for Sinhala arrays
lawyerSchema.virtual('locations_si').get(function() {
  return this.locations
    .filter(location => location.language === 'si')
    .map(location => location.location);
});

lawyerSchema.virtual('practiceAreas_si').get(function() {
  return this.practiceAreas
    .filter(area => area.language === 'si')
    .map(area => area.practiceArea);
});

lawyerSchema.virtual('education_si').get(function() {
  return this.education
    .filter(edu => edu.language === 'si')
    .map(edu => edu.education);
});

lawyerSchema.virtual('addresses_si').get(function() {
  return this.addresses
    .filter(address => address.language === 'si')
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

// Helper method to translate practice areas between languages
lawyerSchema.methods.translatePracticeArea = function(practiceArea, targetLanguage) {
  const translations = getPracticeAreaTranslations();
  const translation = translations.find(t => 
    t.en === practiceArea || t.ta === practiceArea || t.si === practiceArea
  );
  
  if (translation) {
    return translation[targetLanguage] || practiceArea;
  }
  return practiceArea;
};

// Helper method to translate locations between languages
lawyerSchema.methods.translateLocation = function(location, targetLanguage) {
  const translations = getLocationTranslations();
  const translation = translations.find(t => 
    t.en === location || t.ta === location || t.si === location
  );
  
  if (translation) {
    return translation[targetLanguage] || location;
  }
  return location;
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