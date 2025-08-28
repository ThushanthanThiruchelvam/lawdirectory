'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Header = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [logo, setLogo] = useState(null);

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleGetStarted = () => {
    router.push('/admin/login');
  };

  return (
    <div className='py-5 px-5 md:px-10 lg:px-28'>
      <div className='flex justify-between items-center'>
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
        <div className="flex items-center gap-4">
          <select 
            value={i18n.language} 
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm bg-transparent"
          >
            <option value="en">EN</option>
            <option value="ta">TA</option>
          </select>
          <button 
            onClick={handleGetStarted}
            className='font-medium py-2 px-4 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition-colors'
          >
            {t('Get Started')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header