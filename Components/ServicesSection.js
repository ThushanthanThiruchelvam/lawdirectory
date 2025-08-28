'use client'

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { assets } from '@/Assets/assets';
import Image from 'next/image';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

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
          <h2 className="text-3xl font-medium text-center mb-12 text-gray-900">{t('Our Services')}</h2>
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
        <h2 className="text-3xl font-medium text-center mb-12 text-gray-900">{t('Our Services')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={service._id || index} 
              className="bg-gray-50 p-6 rounded-lg border border-gray-100 transition-colors duration-300 hover:bg-gray-100"
            >
              <div className="flex items-center mb-4">
                {/* {service.icon && service.icon !== 'default-service-icon' ? (
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 border border-gray-200">
                    <Image 
                      src={service.icon} 
                      alt={service.title} 
                      width={24} 
                      height={24} 
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <Image 
                      src={assets.service_icon} 
                      alt="Service" 
                      width={20} 
                      height={20} 
                    />
                  </div>
                )} */}
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