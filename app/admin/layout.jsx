'use client'

import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Layout({ children }) {
  const { admin, logout } = useAuth();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Don't show admin layout for login page
  if (pathname === '/admin/login') {
    return (
      <>
        <ToastContainer theme="dark"/>
        {children}
      </>
    );
  }

  return (
    <>
      <div className="flex">
        <ToastContainer theme="dark"/>
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Admin Panel</h3>
            <div className="flex items-center gap-4">

              
              {/* Language Selector */}
              <div className="relative">
                <select 
                  value={i18n.language} 
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="px-6 py-1 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent appearance-none cursor-pointer transition-colors duration-200"
                >
                  <option value="en">EN</option>
                  <option value="ta">TA</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              
              <button 
                onClick={logout}
                className="text-sm text-red-600 px-3 py-1 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}