'use client'

import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import ProtectedRoute from '/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const Page = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('en');
  const [locations_en, setLocations_en] = useState(['']);
  const [locations_ta, setLocations_ta] = useState(['']);
  const [practiceAreas_en, setPracticeAreas_en] = useState(['']);
  const [practiceAreas_ta, setPracticeAreas_ta] = useState(['']);
  const [education_en, setEducation_en] = useState(['']);
  const [education_ta, setEducation_ta] = useState(['']);
  const [addresses_en, setAddresses_en] = useState(['']);
  const [addresses_ta, setAddresses_ta] = useState(['']);
  const router = useRouter();
  const { t } = useTranslation();
  
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
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  // Functions to handle multilingual arrays
  const addLocation = (language) => {
    if (language === 'en') {
      setLocations_en([...locations_en, '']);
      // Add empty corresponding Tamil location if needed
      if (locations_ta.length < locations_en.length + 1) {
        setLocations_ta([...locations_ta, '']);
      }
    } else {
      setLocations_ta([...locations_ta, '']);
    }
  }

  const removeLocation = (index, language) => {
    if (language === 'en') {
      if (locations_en.length > 1) {
        setLocations_en(locations_en.filter((_, i) => i !== index));
        // Remove corresponding Tamil location if exists
        if (locations_ta.length > index) {
          setLocations_ta(locations_ta.filter((_, i) => i !== index));
        }
      }
    } else {
      if (locations_ta.length > 1) {
        setLocations_ta(locations_ta.filter((_, i) => i !== index));
      }
    }
  }

  const handleLocationChange = (index, value, language) => {
    if (language === 'en') {
      const newLocations = [...locations_en];
      newLocations[index] = value;
      setLocations_en(newLocations);
    } else {
      const newLocations = [...locations_ta];
      newLocations[index] = value;
      setLocations_ta(newLocations);
    }
  }

  // Similar functions for practiceAreas, education, and addresses
  const addPracticeArea = (language) => {
    if (language === 'en') {
      setPracticeAreas_en([...practiceAreas_en, '']);
      if (practiceAreas_ta.length < practiceAreas_en.length + 1) {
        setPracticeAreas_ta([...practiceAreas_ta, '']);
      }
    } else {
      setPracticeAreas_ta([...practiceAreas_ta, '']);
    }
  }

  const removePracticeArea = (index, language) => {
    if (language === 'en') {
      if (practiceAreas_en.length > 1) {
        setPracticeAreas_en(practiceAreas_en.filter((_, i) => i !== index));
        if (practiceAreas_ta.length > index) {
          setPracticeAreas_ta(practiceAreas_ta.filter((_, i) => i !== index));
        }
      }
    } else {
      if (practiceAreas_ta.length > 1) {
        setPracticeAreas_ta(practiceAreas_ta.filter((_, i) => i !== index));
      }
    }
  }

  const handlePracticeAreaChange = (index, value, language) => {
    if (language === 'en') {
      const newPracticeAreas = [...practiceAreas_en];
      newPracticeAreas[index] = value;
      setPracticeAreas_en(newPracticeAreas);
    } else {
      const newPracticeAreas = [...practiceAreas_ta];
      newPracticeAreas[index] = value;
      setPracticeAreas_ta(newPracticeAreas);
    }
  }

  const addEducation = (language) => {
    if (language === 'en') {
      setEducation_en([...education_en, '']);
      if (education_ta.length < education_en.length + 1) {
        setEducation_ta([...education_ta, '']);
      }
    } else {
      setEducation_ta([...education_ta, '']);
    }
  }

  const removeEducation = (index, language) => {
    if (language === 'en') {
      if (education_en.length > 1) {
        setEducation_en(education_en.filter((_, i) => i !== index));
        if (education_ta.length > index) {
          setEducation_ta(education_ta.filter((_, i) => i !== index));
        }
      }
    } else {
      if (education_ta.length > 1) {
        setEducation_ta(education_ta.filter((_, i) => i !== index));
      }
    }
  }

  const handleEducationChange = (index, value, language) => {
    if (language === 'en') {
      const newEducation = [...education_en];
      newEducation[index] = value;
      setEducation_en(newEducation);
    } else {
      const newEducation = [...education_ta];
      newEducation[index] = value;
      setEducation_ta(newEducation);
    }
  }

  const addAddress = (language) => {
    if (language === 'en') {
      setAddresses_en([...addresses_en, '']);
      if (addresses_ta.length < addresses_en.length + 1) {
        setAddresses_ta([...addresses_ta, '']);
      }
    } else {
      setAddresses_ta([...addresses_ta, '']);
    }
  }

  const removeAddress = (index, language) => {
    if (language === 'en') {
      if (addresses_en.length > 1) {
        setAddresses_en(addresses_en.filter((_, i) => i !== index));
        if (addresses_ta.length > index) {
          setAddresses_ta(addresses_ta.filter((_, i) => i !== index));
        }
      }
    } else {
      if (addresses_ta.length > 1) {
        setAddresses_ta(addresses_ta.filter((_, i) => i !== index));
      }
    }
  }

  const handleAddressChange = (index, value, language) => {
    if (language === 'en') {
      const newAddresses = [...addresses_en];
      newAddresses[index] = value;
      setAddresses_en(newAddresses);
    } else {
      const newAddresses = [...addresses_ta];
      newAddresses[index] = value;
      setAddresses_ta(newAddresses);
    }
  }

const onSubmitHandler = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  // Validate form
  if (!data.lawyerId || !data.name_en || !data.title_en || !data.description_en || 
      !data.contactNumber || !data.email || !image || 
      locations_en.some(loc => !loc) || practiceAreas_en.some(area => !area) ||
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
    formData.append('contactNumber', data.contactNumber);
    formData.append('email', data.email);
    formData.append('website', data.website || '');
    formData.append('isFeatured', data.isFeatured);
    formData.append('isPublished', data.isPublished);
    
    // Send arrays as individual entries (not JSON strings)
    locations_en.forEach(location => {
      if (location) formData.append('locations_en', location);
    });
    
    locations_ta.forEach(location => {
      if (location) formData.append('locations_ta', location);
    });
    
    practiceAreas_en.forEach(area => {
      if (area) formData.append('practiceAreas_en', area);
    });
    
    practiceAreas_ta.forEach(area => {
      if (area) formData.append('practiceAreas_ta', area);
    });
    
    education_en.forEach(edu => {
      if (edu) formData.append('education_en', edu);
    });
    
    education_ta.forEach(edu => {
      if (edu) formData.append('education_ta', edu);
    });
    
    addresses_en.forEach(addr => {
      if (addr) formData.append('addresses_en', addr);
    });
    
    addresses_ta.forEach(addr => {
      if (addr) formData.append('addresses_ta', addr);
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
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === 'en'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  English Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ta')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === 'ta'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tamil Content
                </button>
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
            
            {/* English Content */}
            {activeTab === 'en' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name_en" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Lawyer Name')} *
                  </label>
                  <input
                    id="name_en"
                    name="name_en"
                    value={data.name_en}
                    onChange={onChangeHandler}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('Enter lawyer name')}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Lawyer Title')} *
                  </label>
                  <input
                    id="title_en"
                    name="title_en"
                    value={data.title_en}
                    onChange={onChangeHandler}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('Enter lawyer title')}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Lawyer Description')} *
                  </label>
                  <textarea
                    id="description_en"
                    name="description_en"
                    value={data.description_en}
                    onChange={onChangeHandler}
                    rows={4}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('Enter lawyer description')}
                    required
                  />
                </div>
                
                {/* Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Locations')} *
                    <button 
                      type="button" 
                      onClick={() => addLocation('en')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {locations_en.map((location, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={location}
                        onChange={(e) => handleLocationChange(index, e.target.value, 'en')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter location')}
                        required
                      />
                      {locations_en.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeLocation(index, 'en')}
                          className="ml-2 text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Practice Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Practice Areas')} *
                    <button 
                      type="button" 
                      onClick={() => addPracticeArea('en')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {practiceAreas_en.map((area, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={area}
                        onChange={(e) => handlePracticeAreaChange(index, e.target.value, 'en')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter practice area')}
                        required
                      />
                      {practiceAreas_en.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removePracticeArea(index, 'en')}
                          className="ml-2 text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Education')} *
                    <button 
                      type="button" 
                      onClick={() => addEducation('en')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {education_en.map((edu, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={edu}
                        onChange={(e) => handleEducationChange(index, e.target.value, 'en')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter education details')}
                        required
                      />
                      {education_en.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeEducation(index, 'en')}
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
                    {t('Address')} *
                    <button 
                      type="button" 
                      onClick={() => addAddress('en')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {addresses_en.map((addr, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={addr}
                        onChange={(e) => handleAddressChange(index, e.target.value, 'en')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter address')}
                        required
                      />
                      {addresses_en.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeAddress(index, 'en')}
                          className="ml-2 text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tamil Content */}
            {activeTab === 'ta' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name_ta" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Lawyer Name')} (Tamil)
                  </label>
                  <input
                    id="name_ta"
                    name="name_ta"
                    value={data.name_ta}
                    onChange={onChangeHandler}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('Enter lawyer name')}
                  />
                </div>
                
                <div>
                  <label htmlFor="title_ta" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Lawyer Title')} (Tamil)
                  </label>
                  <input
                    id="title_ta"
                    name="title_ta"
                    value={data.title_ta}
                    onChange={onChangeHandler}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('Enter lawyer title')}
                  />
                </div>
                
                <div>
                  <label htmlFor="description_ta" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Lawyer Description')} (Tamil)
                  </label>
                  <textarea
                    id="description_ta"
                    name="description_ta"
                    value={data.description_ta}
                    onChange={onChangeHandler}
                    rows={4}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('Enter lawyer description')}
                  />
                </div>
                
                {/* Tamil Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Locations')} (Tamil)
                    <button 
                      type="button" 
                      onClick={() => addLocation('ta')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {locations_ta.map((location, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={location}
                        onChange={(e) => handleLocationChange(index, e.target.value, 'ta')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter location')}
                      />
                      {locations_ta.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeLocation(index, 'ta')}
                          className="ml-2 text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Tamil Practice Areas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Practice Areas')} (Tamil)
                    <button 
                      type="button" 
                      onClick={() => addPracticeArea('ta')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {practiceAreas_ta.map((area, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={area}
                        onChange={(e) => handlePracticeAreaChange(index, e.target.value, 'ta')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter practice area')}
                      />
                      {practiceAreas_ta.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removePracticeArea(index, 'ta')}
                          className="ml-2 text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Tamil Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Education')} (Tamil)
                    <button 
                      type="button" 
                      onClick={() => addEducation('ta')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {education_ta.map((edu, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={edu}
                        onChange={(e) => handleEducationChange(index, e.target.value, 'ta')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter education details')}
                      />
                      {education_ta.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeEducation(index, 'ta')}
                          className="ml-2 text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Tamil Addresses */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Address')} (Tamil)
                    <button 
                      type="button" 
                      onClick={() => addAddress('ta')}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      + {t('Add Another')}
                    </button>
                  </label>
                  {addresses_ta.map((addr, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        value={addr}
                        onChange={(e) => handleAddressChange(index, e.target.value, 'ta')}
                        className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('Enter address')}
                      />
                      {addresses_ta.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeAddress(index, 'ta')}
                          className="ml-2 text-red-600 hover:text-red-800 p-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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