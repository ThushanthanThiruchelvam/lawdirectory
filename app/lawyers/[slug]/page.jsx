// app/lawyers/[slug]/page.jsx
'use client'

import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LawyerProfilePage = () => {
  const params = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const fetchLawyer = async (slug) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/lawyers?slug=${slug}&lang=${i18n.language}`);
      
      if (response.data.success === false) {
        setError(response.data.error || 'Lawyer not found');
        return;
      }
      
      setLawyer(response.data.lawyer);
    } catch (err) {
      console.error('Error fetching lawyer:', err);
      setError('Failed to load lawyer profile');
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (params?.slug) {
      fetchLawyer(params.slug);
    }
  };

  useEffect(() => {
    if (params.slug) {
      fetchLawyer(params.slug);
    }
  }, [params.slug, i18n.language]);

  if (loading) {
    return (
      <>
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="mx-5 md:mx-12 lg:mx-28 py-4 flex justify-between items-center">
            <Link href="/">
              <Image 
                src={assets.logo} 
                width={140} 
                alt="" 
                className="w-[100px] sm:w-auto" 
                priority 
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className={`font-medium ${menu === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('home')}
              >
                {t('Home')}
              </Link>
              <Link 
                href="/#about" 
                className={`font-medium ${menu === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('about')}
              >
                {t('About')}
              </Link>
              <Link 
                href="/#services" 
                className={`font-medium ${menu === 'services' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('services')}
              >
                {t('Services')}
              </Link>
              <Link 
                href="/#lawyers" 
                className={`font-medium ${menu === 'lawyers' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('lawyers')}
              >
                {t('Lawyers')}
              </Link>
              <Link 
                href="/#blog" 
                className={`font-medium ${menu === 'blog' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('blog')}
              >
                {t('Blog')}
              </Link>
              <Link 
                href="/#contact" 
                className={`font-medium ${menu === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('contact')}
              >
                {t('Contact')}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <select 
                value={i18n.language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">EN</option>
                <option value="ta">TA</option>
              </select>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 px-5 py-4">
              <div className="flex flex-col space-y-3">
                <Link href="/" className="font-medium text-gray-700 hover:text-blue-600 py-2">Home</Link>
                <Link href="/#about" className="font-medium text-gray-70 hover:text-blue-600 py-2">About</Link>
                <Link href="/#services" className="font-medium text-gray-700 hover:text-blue-600 py-2">Services</Link>
                <Link href="/#lawyers" className="font-medium text-gray-700 hover:text-blue-600 py-2">Lawyers</Link>
                <Link href="/#blog" className="font-medium text-gray-700 hover:text-blue-600 py-2">Blog</Link>
                <Link href="/#contact" className="font-medium text-gray-700 hover:text-blue-600 py-2">Contact</Link>
                <button className="text-sm font-medium py-2 px-4 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors mt-4">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !lawyer) {
    return (
      <>
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="mx-5 md:mx-12 lg:mx-28 py-4 flex justify-between items-center">
            <Link href="/">
              <Image 
                src={assets.logo} 
                width={140} 
                alt="" 
                className="w-[100px] sm:w-auto" 
                priority 
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className={`font-medium ${menu === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('home')}
              >
                {t('Home')}
              </Link>
              <Link 
                href="/#about" 
                className={`font-medium ${menu === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('about')}
              >
                {t('About')}
              </Link>
              <Link 
                href="/#services" 
                className={`font-medium ${menu === 'services' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('services')}
              >
                {t('Services')}
              </Link>
              <Link 
                href="/#lawyers" 
                className={`font-medium ${menu === 'lawyers' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('lawyers')}
              >
                {t('Lawyers')}
              </Link>
              <Link 
                href="/#blog" 
                className={`font-medium ${menu === 'blog' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('blog')}
              >
                {t('Blog')}
              </Link>
              <Link 
                href="/#contact" 
                className={`font-medium ${menu === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setMenu('contact')}
              >
                {t('Contact')}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <select 
                value={i18n.language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">EN</option>
                <option value="ta">TA</option>
              </select>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 px-5 py-4">
              <div className="flex flex-col space-y-3">
                <Link href="/" className="font-medium text-gray-700 hover:text-blue-600 py-2">Home</Link>
                <Link href="/#about" className="font-medium text-gray-700 hover:text-blue-600 py-2">About</Link>
                <Link href="/#services" className="font-medium text-gray-700 hover:text-blue-600 py-2">Services</Link>
                <Link href="/#lawyers" className="font-medium text-gray-700 hover:text-blue-600 py-2">Lawyers</Link>
                <Link href="/#blog" className="font-medium text-gray-700 hover:text-blue-600 py-2">Blog</Link>
                <Link href="/#contact" className="font-medium text-gray-700 hover:text-blue-600 py-2">Contact</Link>
                <button className="text-sm font-medium py-2 px-4 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors mt-4">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-xl font-medium text-gray-900 mb-2">Lawyer Not Found</h1>
            <p className="text-gray-500">{error || "The lawyer you're looking for doesn't exist."}</p>
            <Link href="/lawyers" className="mt-4 inline-block px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors">
              Browse All Lawyers
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-5 md:mx-12 lg:mx-28 py-4 flex justify-between items-center">
          <Link href="/">
            <Image 
              src={assets.logo} 
              width={140} 
              alt="" 
              className="w-[100px] sm:w-auto" 
              priority 
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`font-medium ${menu === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setMenu('home')}
            >
              {t('Home')}
            </Link>
            <Link 
              href="/#about" 
              className={`font-medium ${menu === 'about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setMenu('about')}
            >
              {t('About')}
            </Link>
            <Link 
              href="/#services" 
              className={`font-medium ${menu === 'services' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setMenu('services')}
            >
              {t('Services')}
            </Link>
            <Link 
              href="/#lawyers" 
              className={`font-medium ${menu === 'lawyers' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setMenu('lawyers')}
            >
              {t('Lawyers')}
            </Link>
            <Link 
              href="/#blog" 
              className={`font-medium ${menu === 'blog' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setMenu('blog')}
            >
              {t('Blog')}
            </Link>
            <Link 
              href="/#contact" 
              className={`font-medium ${menu === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              onClick={() => setMenu('contact')}
            >
              {t('Contact')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <select 
              value={i18n.language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">EN</option>
              <option value="ta">TA</option>
            </select>
            
            <button className="hidden sm:block text-sm font-medium py-2 px-4 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors">
              {t('Get Started')}
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-5 py-4">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="font-medium text-gray-700 hover:text-blue-600 py-2">Home</Link>
              <Link href="/#about" className="font-medium text-gray-700 hover:text-blue-600 py-2">About</Link>
              <Link href="/#services" className="font-medium text-gray-700 hover:text-blue-600 py-2">Services</Link>
              <Link href="/#lawyers" className="font-medium text-gray-700 hover:text-blue-600 py-2">Lawyers</Link>
              <Link href="/#blog" className="font-medium text-gray-700 hover:text-blue-600 py-2">Blog</Link>
              <Link href="/#contact" className="font-medium text-gray-700 hover:text-blue-600 py-2">Contact</Link>
              <button className="text-sm font-medium py-2 px-4 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors mt-4">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 py-5 px-5 md:px-12 lg:px-28">
        <div className="text-center my-16">
          <h1 className="text-2xl sm:text-4xl font-light text-gray-800 max-w-[700px] mx-auto leading-tight">
            {lawyer.name}
          </h1>
          <p className="mt-4 text-gray-500 text-lg">{lawyer.title}</p>
        </div>
      </div>
      
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                <Image
                  src={lawyer.image}
                  alt={lawyer.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{lawyer.name}</h1>
                <p className="text-gray-600 mt-1">{lawyer.title}</p>
                {lawyer.lawyerId && (
                  <div className="text-xs text-gray-400 mt-2">ID: {lawyer.lawyerId}</div>
                )}
              </div>
            </div>
            
            {/* About Section */}
            {lawyer.description && (
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{lawyer.description}</p>
              </div>
            )}
            
            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lawyer.locations && lawyer.locations.length > 0 && (
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Locations</h3>
                  <ul className="space-y-2">
                    {lawyer.locations.map((location, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Practice Areas</h3>
                  <ul className="space-y-2">
                    {lawyer.practiceAreas.map((area, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Education Section */}
            {lawyer.education && lawyer.education.length > 0 && (
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Education</h3>
                <ul className="space-y-2">
                  {lawyer.education.map((edu, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17l9-5-9-5-9 5 9 5z" />
                      </svg>
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Address Section */}
            {lawyer.addresses && lawyer.addresses.length > 0 && (
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3">Address</h3>
                <ul className="space-y-2">
                  {lawyer.addresses.map((address, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <svg className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {address}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Contact Section */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
              <h3 className="text-base font-medium text-gray-900 mb-2">Contact Information</h3>
              {lawyer.contactNumber && (
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Phone:</span> {lawyer.contactNumber}
                </p>
              )}
              {lawyer.email && (
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Email:</span> {lawyer.email}
                </p>
              )}
              {lawyer.website && (
                <p className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Website:</span> {lawyer.website}
                </p>
              )}
              <p className="text-gray-600 text-sm">For inquiries or to schedule a consultation, please contact our office.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default LawyerProfilePage;