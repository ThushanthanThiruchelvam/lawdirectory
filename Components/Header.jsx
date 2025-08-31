'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Header = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [logo, setLogo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [menu, setMenu] = useState(''); // Add missing menu state

  // Track when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchLogo = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data && response.data.profile) {
        setLogo(response.data.profile.logo);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  // Sync language with localStorage or default to 'en'
  useEffect(() => {
    const savedLanguage = typeof window !== 'undefined' 
      ? localStorage.getItem('i18nextLng') || 'en'
      : 'en';
    
    if (savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  };

  const handleGetStarted = () => {
    router.push('/admin/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className='py-5 px-5 md:px-10 lg:px-28 bg-white shadow-sm'>
      <div className='flex justify-between items-center'>
        <Link href="/">
          {logo ? (
            <Image 
              src={logo} 
              width={150} 
              height={50} 
              alt='Logo' 
              className='w-auto h-10 object-contain'
            />
          ) : (
            <div className="w-40 h-10 bg-gray-200 animate-pulse rounded"></div>
          )}
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-800 hover:text-gray-600 transition-colors">
            {/* Only render text when on client to avoid hydration mismatch */}
            {isClient ? t('home', 'Home') : 'Home'}
          </Link>
          <Link href="#about" className="text-gray-800 hover:text-gray-600 transition-colors">
            {isClient ? t('about', 'About') : 'About'}
          </Link>
          <Link href="#services" className="text-gray-800 hover:text-gray-600 transition-colors">
            {isClient ? t('services', 'Services') : 'Services'}
          </Link>
          <Link 
            href='/#lawyers'
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'lawyers' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('lawyers')}
          >
            {isClient ? t('Lawyers') : 'Lawyers'}
          </Link>
          <Link 
            href='/#blog' 
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'blog' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('blog')}
          >
            {isClient ? t('Blog') : 'Blog'}
          </Link>
          <Link href="#contact" className="text-gray-800 hover:text-gray-600 transition-colors">
            {isClient ? t('contact', 'Contact') : 'Contact'}
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <select 
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm bg-transparent"
          >
            <option value="en">EN</option>
            <option value="ta">TA</option>
            <option value="si">SI</option>
          </select>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-6 h-6 relative"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`bg-gray-800 h-0.5 w-6 rounded transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`bg-gray-800 h-0.5 w-6 rounded my-1 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`bg-gray-800 h-0.5 w-6 rounded transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 bg-white p-4 rounded shadow-lg">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="text-gray-800 hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('home', 'Home')}
            </Link>
            <Link 
              href="#about" 
              className="text-gray-800 hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about', 'About')}
            </Link>
            <Link 
              href="#services" 
              className="text-gray-800 hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('services', 'Services')}
            </Link>
            <Link 
              href="#lawyers" 
              className="text-gray-800 hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('Lawyers')}
            </Link>
            <Link 
              href="#blog" 
              className="text-gray-800 hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('Blog')}
            </Link>
            <Link 
              href="#contact" 
              className="text-gray-800 hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact', 'Contact')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Header