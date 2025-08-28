'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Portal from '@/Components/Portal'; // Make sure to import Portal

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { t, i18n } = useTranslation();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/profile?lang=${i18n.language}`);
      if (response.data && response.data.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [i18n.language]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/contact', formData);
      
      if (response.data.success) {
        setShowSuccessModal(true); // Show modal instead of toast
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        // You might want to handle errors differently
        console.error("Submission failed:", response.data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <>
      <div id="contact" className="py-16 px-5 md:px-10 lg:px-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-8">{t('Contact Us')}</h2>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              {/* Form fields remain the same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('First Name')} *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                    placeholder={t('Enter your first name')}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Last Name')} *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                    placeholder={t('Enter your last name')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                    placeholder={t('Enter your email')}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Phone Number')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                    placeholder={t('Enter your phone number')}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-800"
                  placeholder={t('Enter your message')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('Submitting...') : t('Submit')}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-center mb-8">{t('Contact Details')}</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('Address')}</h3>
                  <p className="text-gray-700">{profile.address}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('Contact Information')}</h3>
                  {profile.contacts.phone && (
                    <div className="flex items-center mb-3">
                      <span className="text-gray-700">{profile.contacts.phone}</span>
                    </div>
                  )}
                  {profile.contacts.email && (
                    <div className="flex items-center mb-3">
                      <span className="text-gray-700">{profile.contacts.email}</span>
                    </div>
                  )}
                </div>
                
                {profile.mapEmbedUrl && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">{t('Location')}</h3>
                    <div className="aspect-video">
                      <iframe 
                        src={profile.mapEmbedUrl}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-md"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <Portal>
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  {t('Message Sent Successfully!')}
                </h3>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150 rounded-full p-1 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-center mb-6">
                  {t('Thank you for your message. We will get back to you soon.')}
                </p>
              </div>
              
              <div className="flex justify-center p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-150 text-sm font-medium"
                >
                  {t('Close')}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default ContactForm;