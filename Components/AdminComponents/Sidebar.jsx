'use client'

import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) => {
    return pathname === path;
  }

  const menuItems = [
    {
      path: '/admin/profile',
      name: 'Profile',
      icon: assets.profile_icon
    },
    // Add to your menuItems array in Sidebar component
{
  path: '/admin/services',
  name: 'Services',
  icon: assets.service_icon // You'll need to add this icon to your assets
},
    {
      path: '/admin/add-blog',
      name: 'Add Blogs',
      icon: assets.add_icon
    },
    {
      path: '/admin/blogList',
      name: 'Blog Lists',
      icon: assets.blog_icon
    },
    {
      path: '/admin/contacts',
      name: 'Contacts',
      icon: assets.email_icon
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      icon: assets.settings_icon
    }
  ];

  return (
    <div className={`flex flex-col bg-white text-gray-800 shadow-lg transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        {!isCollapsed && (
          <div className="flex items-center">
            <Image src={assets.logo} width={32} height={32} alt='Logo' className='mr-2' />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center w-full">
            <Image src={assets.logo} width={32} height={32} alt='Logo' />
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            href={item.path} 
            className={`flex items-center rounded-lg p-3 transition-colors ${
              isActive(item.path) 
                ? 'bg-blue-100 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Image 
              src={item.icon} 
              alt={item.name} 
              width={22} 
              height={22} 
              className={isActive(item.path) ? 'filter-blue' : 'filter-gray'} 
            />
            {!isCollapsed && <span className="ml-3 font-medium">{item.name}</span>}
          </Link>
        ))}
      </nav>

      
      <style jsx>{`
        .filter-blue {
          filter: invert(39%) sepia(86%) saturate(1098%) hue-rotate(195deg) brightness(97%) contrast(101%);
        }
        .filter-gray {
          filter: invert(39%) sepia(4%) saturate(1235%) hue-rotate(182deg) brightness(93%) contrast(86%);
        }
      `}</style>
    </div>
  )
}

export default Sidebar