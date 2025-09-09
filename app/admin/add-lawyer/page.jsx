'use client'

import axios from 'axios'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ProtectedRoute from '/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

// Helper functions for translations
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

const Page = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('en');
  const [selectedPracticeAreas, setSelectedPracticeAreas] = useState({
    en: [],
    ta: [],
    si: []
  });
  const [selectedLocations, setSelectedLocations] = useState({
    en: [],
    ta: [],
    si: []
  });
  const [education_en, setEducation_en] = useState(['']);
  const [education_ta, setEducation_ta] = useState(['']);
  const [education_si, setEducation_si] = useState(['']);
  const [addresses_en, setAddresses_en] = useState(['']);
  const [addresses_ta, setAddresses_ta] = useState(['']);
  const [addresses_si, setAddresses_si] = useState(['']);
  const router = useRouter();
  const { t } = useTranslation();
  
  const practiceAreaOptions = getPracticeAreaTranslations();
  const locationOptions = getLocationTranslations();
  
  const [data, setData] = useState({
    lawyerId: "",
    contactNumber: "",
    email: "",
    website: "",
    isFeatured: false,
    isPublished: false,
    name_en: "",
    title_en: "",
    description_en: "",
    name_ta: "",
    title_ta: "",
    description_ta: "",
    name_si: "",
    title_si: "",
    description_si: "",
  })

  useEffect(() => {
    // Initialize Sinhala arrays with empty values to match other languages
    if (education_si.length === 0 && education_en.length > 0) {
      setEducation_si(Array(education_en.length).fill(''));
    }
    if (addresses_si.length === 0 && addresses_en.length > 0) {
      setAddresses_si(Array(addresses_en.length).fill(''));
    }
  }, [education_en, addresses_en]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  // Practice Area Selection Handlers
  const handlePracticeAreaChange = (language, value) => {
    setSelectedPracticeAreas(prev => {
      const newSelection = [...prev[language]];
      const index = newSelection.indexOf(value);
      
      if (index > -1) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(value);
      }
      
      return {
        ...prev,
        [language]: newSelection
      };
    });
  }

  // Location Selection Handlers
  const handleLocationChange = (language, value) => {
    setSelectedLocations(prev => {
      const newSelection = [...prev[language]];
      const index = newSelection.indexOf(value);
      
      if (index > -1) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(value);
      }
      
      return {
        ...prev,
        [language]: newSelection
      };
    });
  }

  // Education and Address Handlers
  const addEducation = (language) => {
    if (language === 'en') {
      setEducation_en([...education_en, '']);
      setEducation_ta([...education_ta, '']);
      setEducation_si([...education_si, '']);
    } else if (language === 'ta') {
      setEducation_ta([...education_ta, '']);
    } else {
      setEducation_si([...education_si, '']);
    }
  }

  const removeEducation = (index, language) => {
    if (language === 'en') {
      if (education_en.length > 1) {
        setEducation_en(education_en.filter((_, i) => i !== index));
        setEducation_ta(education_ta.filter((_, i) => i !== index));
        setEducation_si(education_si.filter((_, i) => i !== index));
      }
    } else if (language === 'ta') {
      if (education_ta.length > 1) {
        setEducation_ta(education_ta.filter((_, i) => i !== index));
      }
    } else {
      if (education_si.length > 1) {
        setEducation_si(education_si.filter((_, i) => i !== index));
      }
    }
  }

  const handleEducationChange = (index, value, language) => {
    if (language === 'en') {
      const newEducation = [...education_en];
      newEducation[index] = value;
      setEducation_en(newEducation);
    } else if (language === 'ta') {
      const newEducation = [...education_ta];
      newEducation[index] = value;
      setEducation_ta(newEducation);
    } else {
      const newEducation = [...education_si];
      newEducation[index] = value;
      setEducation_si(newEducation);
    }
  }

  const addAddress = (language) => {
    if (language === 'en') {
      setAddresses_en([...addresses_en, '']);
      setAddresses_ta([...addresses_ta, '']);
      setAddresses_si([...addresses_si, '']);
    } else if (language === 'ta') {
      setAddresses_ta([...addresses_ta, '']);
    } else {
      setAddresses_si([...addresses_si, '']);
    }
  }

  const removeAddress = (index, language) => {
    if (language === 'en') {
      if (addresses_en.length > 1) {
        setAddresses_en(addresses_en.filter((_, i) => i !== index));
        setAddresses_ta(addresses_ta.filter((_, i) => i !== index));
        setAddresses_si(addresses_si.filter((_, i) => i !== index));
      }
    } else if (language === 'ta') {
      if (addresses_ta.length > 1) {
        setAddresses_ta(addresses_ta.filter((_, i) => i !== index));
      }
    } else {
      if (addresses_si.length > 1) {
        setAddresses_si(addresses_si.filter((_, i) => i !== index));
      }
    }
  }

  const handleAddressChange = (index, value, language) => {
    if (language === 'en') {
      const newAddresses = [...addresses_en];
      newAddresses[index] = value;
      setAddresses_en(newAddresses);
    } else if (language === 'ta') {
      const newAddresses = [...addresses_ta];
      newAddresses[index] = value;
      setAddresses_ta(newAddresses);
    } else {
      const newAddresses = [...addresses_si];
      newAddresses[index] = value;
      setAddresses_si(newAddresses);
    }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!data.lawyerId || !data.name_en || !data.title_en || !data.description_en || 
        !data.contactNumber || !data.email || !image || 
        selectedLocations.en.length === 0 || selectedPracticeAreas.en.length === 0 ||
        education_en.some(edu => !edu) || addresses_en.some(addr => !addr)) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('lawyerId', data.lawyerId);
      formData.append('name_en', data.name_en);
      formData.append('title_en', data.title_en);
      formData.append('description_en', data.description_en);
      formData.append('name_ta', data.name_ta || '');
      formData.append('title_ta', data.title_ta || '');
      formData.append('description_ta', data.description_ta || '');
      formData.append('name_si', data.name_si || '');
      formData.append('title_si', data.title_si || '');
      formData.append('description_si', data.description_si || '');
      formData.append('contactNumber', data.contactNumber);
      formData.append('email', data.email);
      formData.append('website', data.website || '');
      formData.append('isFeatured', data.isFeatured);
      formData.append('isPublished', data.isPublished);
      
      // Add practice areas for each language
      selectedPracticeAreas.en.forEach(area => {
        formData.append('practiceAreas_en', area);
      });
      selectedPracticeAreas.ta.forEach(area => {
        formData.append('practiceAreas_ta', area);
      });
      selectedPracticeAreas.si.forEach(area => {
        formData.append('practiceAreas_si', area);
      });
      
      // Add locations for each language
      selectedLocations.en.forEach(location => {
        formData.append('locations_en', location);
      });
      selectedLocations.ta.forEach(location => {
        formData.append('locations_ta', location);
      });
      selectedLocations.si.forEach(location => {
        formData.append('locations_si', location);
      });
      
      // Add education
      education_en.forEach(edu => {
        if (edu) formData.append('education_en', edu);
      });
      education_ta.forEach(edu => {
        if (edu) formData.append('education_ta', edu);
      });
      education_si.forEach(edu => {
        if (edu) formData.append('education_si', edu);
      });
      
      // Add addresses
      addresses_en.forEach(addr => {
        if (addr) formData.append('addresses_en', addr);
      });
      addresses_ta.forEach(addr => {
        if (addr) formData.append('addresses_ta', addr);
      });
      addresses_si.forEach(addr => {
        if (addr) formData.append('addresses_si', addr);
      });
      
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('/api/lawyers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        router.push('/admin/lawyers');
      } else {
        toast.error(response.data.error || "Error occurred");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || "Failed to create lawyer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('Add New Lawyer')}</h1>
          </div>
          
          <form onSubmit={onSubmitHandler} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
            {/* Language Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['en', 'ta', 'si'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === lang
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'ta' ? 'Tamil' : 'Sinhala'} Content
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Profile Image')} *</label>
              <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                {!image ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">{t('Click to upload profile image')}</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="Preview" 
                      className="object-contain rounded-md max-h-44"
                    />
                  </div>
                )}
                <input 
                  onChange={(e) => setImage(e.target.files[0])} 
                  type="file" 
                  id="image" 
                  hidden 
                  accept="image/*"
                  required
                />
              </label>
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lawyerId" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Lawyer ID')} *
                </label>
                <input
                  id="lawyerId"
                  name="lawyerId"
                  value={data.lawyerId}
                  onChange={onChangeHandler}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('Enter unique lawyer ID')}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Contact Number')} *
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  value={data.contactNumber}
                  onChange={onChangeHandler}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('Enter contact number')}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Email')} *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={onChangeHandler}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('Enter email address')}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Website')}
                </label>
                <input
                  id="website"
                  name="website"
                  value={data.website}
                  onChange={onChangeHandler}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('Enter website URL')}
                />
              </div>
            </div>
            
            {/* Content Tabs */}
            {['en', 'ta', 'si'].map((lang) => (
              activeTab === lang && (
                <div key={lang} className="space-y-6">
                  <div>
                    <label htmlFor={`name_${lang}`} className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Lawyer Name')} {lang !== 'en' && `(${lang === 'ta' ? 'Tamil' : 'Sinhala'})`} {lang === 'en' && '*'}
                    </label>
                    <input
                      id={`name_${lang}`}
                      name={`name_${lang}`}
                      value={data[`name_${lang}`]}
                      onChange={onChangeHandler}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('Enter lawyer name')}
                      required={lang === 'en'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`title_${lang}`} className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Lawyer Title')} {lang !== 'en' && `(${lang === 'ta' ? 'Tamil' : 'Sinhala'})`} {lang === 'en' && '*'}
                    </label>
                    <input
                      id={`title_${lang}`}
                      name={`title_${lang}`}
                      value={data[`title_${lang}`]}
                      onChange={onChangeHandler}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('Enter lawyer title')}
                      required={lang === 'en'}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`description_${lang}`} className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Lawyer Description')} {lang !== 'en' && `(${lang === 'ta' ? 'Tamil' : 'Sinhala'})`} {lang === 'en' && '*'}
                    </label>
                    <textarea
                      id={`description_${lang}`}
                      name={`description_${lang}`}
                      value={data[`description_${lang}`]}
                      onChange={onChangeHandler}
                      rows={4}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t('Enter lawyer description')}
                      required={lang === 'en'}
                    />
                  </div>
                  
                  {/* Practice Areas Multi-select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Practice Areas')} {lang !== 'en' && `(${lang === 'ta' ? 'Tamil' : 'Sinhala'})`} {lang === 'en' && '*'}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {practiceAreaOptions.map((option, index) => (
                        <label key={index} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPracticeAreas[lang].includes(option[lang])}
                            onChange={() => handlePracticeAreaChange(lang, option[lang])}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">{option[lang]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Locations Multi-select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Locations')} {lang !== 'en' && `(${lang === 'ta' ? 'Tamil' : 'Sinhala'})`} {lang === 'en' && '*'}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {locationOptions.map((option, index) => (
                        <label key={index} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLocations[lang].includes(option[lang])}
                            onChange={() => handleLocationChange(lang, option[lang])}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700">{option[lang]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Education')} {lang !== 'en' && `(${lang === 'ta' ? 'Tamil' : 'Sinhala'})`} {lang === 'en' && '*'}
                      <button 
                        type="button" 
                        onClick={() => addEducation(lang)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        + {t('Add Another')}
                      </button>
                    </label>
                    {(
                      lang === 'en' ? education_en : 
                      lang === 'ta' ? education_ta : education_si
                    ).map((edu, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          value={edu}
                          onChange={(e) => handleEducationChange(index, e.target.value, lang)}
                          className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t('Enter education details')}
                          required={lang === 'en'}
                        />
                        {(
                          lang === 'en' ? education_en.length > 1 :
                          lang === 'ta' ? education_ta.length > 1 :
                          education_si.length > 1
                        ) && (
                          <button 
                            type="button" 
                            onClick={() => removeEducation(index, lang)}
                            className="ml-2 text-red-600 hover:text-red-800 p-2"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Addresses */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Address')} {lang !== 'en' && `(${lang === 'ta' ? 'Tamil' : 'Sinhala'})`} {lang === 'en' && '*'}
                      <button 
                        type="button" 
                        onClick={() => addAddress(lang)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        + {t('Add Another')}
                      </button>
                    </label>
                    {(
                      lang === 'en' ? addresses_en : 
                      lang === 'ta' ? addresses_ta : addresses_si
                    ).map((addr, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          value={addr}
                          onChange={(e) => handleAddressChange(index, e.target.value, lang)}
                          className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder={t('Enter address')}
                          required={lang === 'en'}
                        />
                        {(
                          lang === 'en' ? addresses_en.length > 1 :
                          lang === 'ta' ? addresses_ta.length > 1 :
                          addresses_si.length > 1
                        ) && (
                          <button 
                            type="button" 
                            onClick={() => removeAddress(index, lang)}
                            className="ml-2 text-red-600 hover:text-red-800 p-2"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
            
            {/* Toggles */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={data.isFeatured}
                  onChange={onChangeHandler}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{t('Featured Lawyer')}</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={data.isPublished}
                  onChange={onChangeHandler}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{t('Publish Immediately')}</span>
              </label>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/admin/lawyers')}
                className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('Adding Lawyer...') : t('Add Lawyer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Page