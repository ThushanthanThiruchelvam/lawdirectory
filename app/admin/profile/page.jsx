'use client'

import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '@/Components/ProtectedRoute'
import RichTextEditor from '@/Components/RichTextEditor'

const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoLight, setLogoLight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en');
  const { t } = useTranslation();
  
  const [data, setData] = useState({
    fullName_en: "",
    title_en: "",
    tagline_en: "",
    about_en: "",
    address_en: "",
    fullName_ta: "",
    title_ta: "",
    tagline_ta: "",
    about_ta: "",
    address_ta: "",
    fullName_si: "",
    title_si: "",
    tagline_si: "",
    about_si: "",
    address_si: "",
    phone: "",
    email: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    twitter: "",
    mapEmbedUrl: "",
    profileImage: "",
    logo: "",
    logoLight: ""
  })

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get('/api/profile');
      
      if (response.data && response.data.profile) {
        const profile = response.data.profile;
        setData({
          fullName_en: profile.fullName || "",
          title_en: profile.title || "",
          tagline_en: profile.tagline || "",
          about_en: profile.about || "",
          address_en: profile.address || "",
          fullName_ta: "",
          title_ta: "",
          tagline_ta: "",
          about_ta: "",
          address_ta: "",
          fullName_si: "",
          title_si: "",
          tagline_si: "",
          about_si: "",
          address_si: "",
          phone: profile.contacts?.phone || "",
          email: profile.contacts?.email || "",
          whatsapp: profile.contacts?.whatsapp || "",
          facebook: profile.contacts?.facebook || "",
          instagram: profile.contacts?.instagram || "",
          twitter: profile.contacts?.twitter || "",
          mapEmbedUrl: profile.mapEmbedUrl || "",
          profileImage: profile.profileImage || assets.upload_area,
          logo: profile.logo || assets.upload_area,
          logoLight: profile.logoLight || assets.upload_area
        });
        
        // Try to fetch Tamil content
        try {
          const responseTa = await axios.get('/api/profile?lang=ta');
          if (responseTa.data && responseTa.data.profile) {
            const profileTa = responseTa.data.profile;
            setData(prev => ({
              ...prev,
              fullName_ta: profileTa.fullName || "",
              title_ta: profileTa.title || "",
              tagline_ta: profileTa.tagline || "",
              about_ta: profileTa.about || "",
              address_ta: profileTa.address || ""
            }));
          }
        } catch (taError) {
          console.log("No Tamil content available yet");
        }

        // Try to fetch Sinhala content
        try {
          const responseSi = await axios.get('/api/profile?lang=si');
          if (responseSi.data && responseSi.data.profile) {
            const profileSi = responseSi.data.profile;
            setData(prev => ({
              ...prev,
              fullName_si: profileSi.fullName || "",
              title_si: profileSi.title || "",
              tagline_si: profileSi.tagline || "",
              about_si: profileSi.about || "",
              address_si: profileSi.address || ""
            }));
          }
        } catch (siError) {
          console.log("No Sinhala content available yet");
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(t('Failed to fetch profile data'));
    } finally {
      setFetchLoading(false);
    }
  }

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  // Handler for RichTextEditor changes
  const onEditorChange = (value, fieldName) => {
    setData(data => ({ ...data, [fieldName]: value }));
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // English content
      formData.append('fullName_en', data.fullName_en);
      formData.append('title_en', data.title_en);
      formData.append('tagline_en', data.tagline_en);
      formData.append('about_en', data.about_en);
      formData.append('address_en', data.address_en);
      
      // Tamil content
      formData.append('fullName_ta', data.fullName_ta);
      formData.append('title_ta', data.title_ta);
      formData.append('tagline_ta', data.tagline_ta);
      formData.append('about_ta', data.about_ta);
      formData.append('address_ta', data.address_ta);
      
      // Sinhala content
      formData.append('fullName_si', data.fullName_si);
      formData.append('title_si', data.title_si);
      formData.append('tagline_si', data.tagline_si);
      formData.append('about_si', data.about_si);
      formData.append('address_si', data.address_si);
      
      // Contact information
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      formData.append('whatsapp', data.whatsapp);
      formData.append('facebook', data.facebook);
      formData.append('instagram', data.instagram);
      formData.append('twitter', data.twitter);
      formData.append('mapEmbedUrl', data.mapEmbedUrl);
      
      if (image) {
        formData.append('profileImage', image);
      }
      
      if (logo) {
        formData.append('logo', logo);
      }
      
      if (logoLight) {
        formData.append('logoLight', logoLight);
      }

      const response = await axios.put('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(null);
        setLogo(null);
        setLogoLight(null);
        fetchProfileData(); // Refresh data
      } else {
        toast.error(response.data.error || t("Error occurred"));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || t("Failed to update profile"));
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-5xl mx-auto'>
          <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
            <h1 className='text-2xl font-medium text-gray-900 mb-2'>{t('Profile Settings')}</h1>
            <p className='text-gray-500 mb-6'>{t('Manage your public profile information')}</p>
            
            {/* Profile Image Upload */}
            <div className="mb-8 pt-4 border-t border-gray-100">
              <p className='text-sm font-medium text-gray-700 mb-3'>{t('Profile Picture')}</p>
              <div className="flex items-center">
                <label htmlFor="profileImage" className="cursor-pointer group">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image 
                        className='object-cover w-full h-full transition-opacity group-hover:opacity-90' 
                        src={image ? URL.createObjectURL(image) : (data.profileImage || assets.upload_area)} 
                        width={128} 
                        height={128} 
                        alt='Profile'
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </label>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">
                    {t('JPG, GIF or PNG. Max size of 5MB.')}
                  </p>
                </div>
              </div>
              <input 
                onChange={(e) => setImage(e.target.files[0])} 
                type="file" 
                id="profileImage" 
                hidden 
                accept="image/*"
              />
            </div>
            
            {/* Logo Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Main Logo */}
              <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Logo</label>
                <div className="flex flex-col items-center">
                  <Image 
                    src={logo ? URL.createObjectURL(logo) : data.logo} 
                    alt="Logo preview" 
                    width={150} 
                    height={80} 
                    className="mb-4 object-contain"
                  />
                  <label htmlFor="logo" className="cursor-pointer bg-gray-100 px-4 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                    {logo ? 'Change Logo' : 'Upload Logo'}
                  </label>
                  <input 
                    type="file" 
                    id="logo" 
                    className="hidden" 
                    onChange={(e) => setLogo(e.target.files[0])} 
                    accept="image/*"
                  />
                </div>
              </div>
              
              {/* Light Logo */}
              <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-900">
                <label className="block text-sm font-medium text-gray-100 mb-2">Light Logo (for dark backgrounds)</label>
                <div className="flex flex-col items-center">
                  <Image 
                    src={logoLight ? URL.createObjectURL(logoLight) : data.logoLight} 
                    alt="Light logo preview" 
                    width={150} 
                    height={80} 
                    className="mb-4 object-contain"
                  />
                  <label htmlFor="logoLight" className="cursor-pointer bg-gray-700 px-4 py-2 rounded text-sm font-medium text-gray-100 hover:bg-gray-600 transition-colors">
                    {logoLight ? 'Change Light Logo' : 'Upload Light Logo'}
                  </label>
                  <input 
                    type="file" 
                    id="logoLight" 
                    className="hidden" 
                    onChange={(e) => setLogoLight(e.target.files[0])} 
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
            
            {/* Language Tabs */}
            <div className="flex mb-6 border-b border-gray-200">
              <button 
                type="button"
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'en' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('en')}
              >
                English
              </button>
              <button 
                type="button"
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'ta' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('ta')}
              >
                Tamil
              </button>
              <button 
                type="button"
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'si' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('si')}
              >
                Sinhala
              </button>
            </div>
            
            <form onSubmit={onSubmitHandler}>
              {/* English Content */}
              {activeTab === 'en' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Full Name')} (English)</label>
                    <input 
                      name='fullName_en' 
                      onChange={onChangeHandler} 
                      value={data.fullName_en} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Full Name')} 
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Title')} (English)</label>
                    <input 
                      name='title_en' 
                      onChange={onChangeHandler} 
                      value={data.title_en} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Title')} 
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Tagline')} (English)</label>
                    <input 
                      name='tagline_en' 
                      onChange={onChangeHandler} 
                      value={data.tagline_en} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Tagline')} 
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('About')} (English)</label>
                    <div className='w-full'>
                      <RichTextEditor 
                        value={data.about_en} 
                        onChange={(value) => onEditorChange(value, 'about_en')}
                        placeholder={t('Write about yourself here...')}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Address')} (English)</label>
                    <textarea 
                      name='address_en' 
                      onChange={onChangeHandler} 
                      value={data.address_en} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      rows="3"
                      placeholder={t('Address')} 
                      required
                    />
                  </div>
                </div>
              )}
              
              {/* Tamil Content */}
              {activeTab === 'ta' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Full Name')} (Tamil)</label>
                    <input 
                      name='fullName_ta' 
                      onChange={onChangeHandler} 
                      value={data.fullName_ta} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Full Name')} 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Title')} (Tamil)</label>
                    <input 
                      name='title_ta' 
                      onChange={onChangeHandler} 
                      value={data.title_ta} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Title')} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Tagline')} (Tamil)</label>
                    <input 
                      name='tagline_ta' 
                      onChange={onChangeHandler} 
                      value={data.tagline_ta} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Tagline')} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('About')} (Tamil)</label>
                    <div className='w-full'>
                      <RichTextEditor 
                        value={data.about_ta} 
                        onChange={(value) => onEditorChange(value, 'about_ta')}
                        placeholder={t('Write about yourself here...')}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Address')} (Tamil)</label>
                    <textarea 
                      name='address_ta' 
                      onChange={onChangeHandler} 
                      value={data.address_ta} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      rows="3"
                      placeholder={t('Address')} 
                    />
                  </div>
                </div>
              )}
              
              {/* Sinhala Content */}
              {activeTab === 'si' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Full Name')} (Sinhala)</label>
                    <input 
                      name='fullName_si' 
                      onChange={onChangeHandler} 
                      value={data.fullName_si} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Full Name')} 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Title')} (Sinhala)</label>
                    <input 
                      name='title_si' 
                      onChange={onChangeHandler} 
                      value={data.title_si} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Title')} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Tagline')} (Sinhala)</label>
                    <input 
                      name='tagline_si' 
                      onChange={onChangeHandler} 
                      value={data.tagline_si} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Tagline')} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('About')} (Sinhala)</label>
                    <div className='w-full'>
                      <RichTextEditor 
                        value={data.about_si} 
                        onChange={(value) => onEditorChange(value, 'about_si')}
                        placeholder={t('Write about yourself here...')}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Address')} (Sinhala)</label>
                    <textarea 
                      name='address_si' 
                      onChange={onChangeHandler} 
                      value={data.address_si} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      rows="3"
                      placeholder={t('Address')} 
                    />
                  </div>
                </div>
              )}
              
              {/* Contact Information */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-6">{t('Contact Information')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Phone')}</label>
                    <input 
                      name='phone' 
                      onChange={onChangeHandler} 
                      value={data.phone} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Phone number')} 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Email')}</label>
                    <input 
                      name='email' 
                      onChange={onChangeHandler} 
                      value={data.email} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="email" 
                      placeholder={t('Email address')} 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('WhatsApp')}</label>
                    <input 
                      name='whatsapp' 
                      onChange={onChangeHandler} 
                      value={data.whatsapp} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('WhatsApp number')} 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Facebook')}</label>
                    <input 
                      name='facebook' 
                      onChange={onChangeHandler} 
                      value={data.facebook} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Facebook URL')} 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Instagram')}</label>
                    <input 
                      name='instagram' 
                      onChange={onChangeHandler} 
                      value={data.instagram} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Instagram URL')} 
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Twitter')}</label>
                    <input 
                      name='twitter' 
                      onChange={onChangeHandler} 
                      value={data.twitter} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Twitter URL')} 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className='block text-sm font-medium text-gray-700 mb-2'>{t('Google Maps Embed URL')}</label>
                    <input 
                      name='mapEmbedUrl' 
                      onChange={onChangeHandler} 
                      value={data.mapEmbedUrl} 
                      className='w-full px-4 py-2.5 text-gray-900 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
                      type="text" 
                      placeholder={t('Google Maps embed URL')} 
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {t('To get the embed URL, go to Google Maps, share a location, and select "Embed a map"')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button 
                  type='submit' 
                  className='inline-flex items-center px-5 py-2.5 text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('Updating...')}
                    </>
                  ) : (
                    t('Update Profile')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ProfilePage