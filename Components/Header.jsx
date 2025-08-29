// components/Header.jsx
'use client'
import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Header = () => {
  const [menu, setMenu] = useState('home');
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className='bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50'>
      <div className='mx-5 md:mx-12 lg:mx-28 py-4 flex justify-between items-center'>
        <Link href='/'>
          <Image 
            src={assets.logo} 
            width={120} 
            height={32} 
            alt='Logo' 
            className='w-[90px] sm:w-[120px] transition-opacity hover:opacity-80' 
            priority 
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-8'>
          <Link 
            href='/' 
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('home')}
          >
            {t('Home')}
          </Link>
          <Link 
            href='/#about' 
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('about')}
          >
            {t('About')}
          </Link>
          <Link 
            href='/#services' 
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'services' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('services')}
          >
            {t('Services')}
          </Link>
          <Link 
            href='/#lawyers'
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'lawyers' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('lawyers')}
          >
            {t('Lawyers')}
          </Link>
          <Link 
            href='/#blog' 
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'blog' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('blog')}
          >
            {t('Blog')}
          </Link>
          <Link 
            href='/#contact' 
            className={`font-medium text-sm tracking-wide transition-colors ${menu === 'contact' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setMenu('contact')}
          >
            {t('Contact')}
          </Link>
        </nav>

        <div className='flex items-center gap-4'>
          {/* Language Selector */}
          <select 
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            className='px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer appearance-none bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiM3ODc5N0EiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=")] bg-no-repeat bg-[center_right_0.5rem] bg-[length:16px_16px] pr-8'
          >
            <option value="en">EN</option>
            <option value="ta">TA</option>
          </select>
          
          {/* Mobile Menu Button */}
          <button 
            className='md:hidden p-2 group'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-gray-700 rounded transition-transform ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
              <span className={`h-0.5 w-full bg-gray-700 rounded transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`h-0.5 w-full bg-gray-700 rounded transition-transform ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 px-5 py-4 transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className='flex flex-col space-y-1'>
          <Link 
            href='/' 
            className='font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'
            onClick={() => {setMenu('home'); setIsMenuOpen(false);}}
          >
            {t('Home')}
          </Link>
          <Link 
            href='/#about' 
            className='font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'
            onClick={() => {setMenu('about'); setIsMenuOpen(false);}}
          >
            {t('About')}
          </Link>
          <Link 
            href='/#services' 
            className='font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'
            onClick={() => {setMenu('services'); setIsMenuOpen(false);}}
          >
            {t('Services')}
          </Link>
          <Link 
            href='/#lawyers' 
            className='font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'
            onClick={() => {setMenu('lawyers'); setIsMenuOpen(false);}}
          >
            {t('Lawyers')}
          </Link>
          <Link 
            href='/#blog' 
            className='font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'
            onClick={() => {setMenu('blog'); setIsMenuOpen(false);}}
          >
            {t('Blog')}
          </Link>
          <Link 
            href='/#contact' 
            className='font-medium text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors'
            onClick={() => {setMenu('contact'); setIsMenuOpen(false);}}
          >
            {t('Contact')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header