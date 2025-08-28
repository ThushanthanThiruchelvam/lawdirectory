'use client'
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const AboutSection = () => {
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

  if (loading) {
    return (
      <section id="about" className="py-16 px-5 md:px-10 lg:px-28 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-12"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <section id="about" className="py-16 px-5 md:px-10 lg:px-28 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-light text-center text-gray-800 mb-12">{t('About Me')}</h2>
        <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
          <ReactMarkdown>{profile.about || ''}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;