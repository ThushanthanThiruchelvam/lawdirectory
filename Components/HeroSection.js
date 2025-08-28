'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Twitter 
} from 'lucide-react';
import Head from 'next/head';

const HeroSection = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/profile?lang=${i18n.language}`);
      if (response.data && response.data.profile) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [i18n.language]);

  // Set page title when profile is loaded
  useEffect(() => {
    if (profile && profile.fullName) {
      document.title = `${profile.fullName} - ${profile.title || 'Professional Portfolio'}`;
    }
  }, [profile]);

  if (loading) {
    return (
      <section className="py-16 px-5 md:px-10 lg:px-28 bg-white">
        <div className="max-w-6xl mx-auto flex justify-center items-center h-96">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-32 w-32 mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-80 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="py-16 px-5 md:px-10 lg:px-28 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl font-light text-gray-800">Profile Not Found</h1>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Set the page title using Head component */}
      <Head>
        <title>{profile.fullName} - {profile.title || 'Professional Portfolio'}</title>
        <meta name="description" content={profile.tagline} />
      </Head>
      
      <section className="py-16 px-5 md:px-10 lg:px-28 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 leading-tight">
              {profile.fullName}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 mb-6 font-normal">
              {profile.title}
            </h2>
            <p className="text-lg text-gray-500 mb-8 italic font-light max-w-md">
              {profile.tagline}
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4 mb-8">
              {profile.contacts?.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.contacts.whatsapp}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors"
                >
                  <MessageCircle size={24} />
                </a>
              )}
              {profile.contacts?.facebook && (
                <a 
                  href={profile.contacts.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={24} />
                </a>
              )}
              {profile.contacts?.instagram && (
                <a 
                  href={profile.contacts.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                >
                  <Instagram size={24} />
                </a>
              )}
              {profile.contacts?.twitter && (
                <a 
                  href={profile.contacts.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
                >
                  <Twitter size={24} />
                </a>
              )}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact" 
                className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                {t('Contact Me')}
              </a>
              <a 
                href="#about" 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {t('Learn More')}
              </a>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 overflow-hidden rounded-full border-8 border-gray-100 shadow-sm">
              <Image 
                src={profile.profileImage} 
                alt={profile.fullName} 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;