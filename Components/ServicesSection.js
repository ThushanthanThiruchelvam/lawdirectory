'use client'

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Add client check
  const { t, i18n } = useTranslation();

  // Track when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/services?lang=${i18n.language}`);
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [i18n.language]);

  useEffect(() => {
    i18n.on('languageChanged', fetchServices);
    return () => {
      i18n.off('languageChanged', fetchServices);
    };
  }, [i18n]);

  if (loading) {
    return (
      <section id="services" className="py-16 px-5 md:px-10 lg:px-28 bg-white">
        <div className="container mx-auto">
          {/* Use static text during SSR to avoid hydration mismatch */}
          <h2 className="text-3xl font-medium text-center mb-12 text-gray-900">
            {isClient ? t('Our Services') : 'Our Services'}
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="py-16 px-5 md:px-10 lg:px-28 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-medium text-center mb-12 text-gray-900">
          {t('Our Services')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={service._id || index} 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 transition-colors duration-300 hover:bg-gray-100"
            >
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;