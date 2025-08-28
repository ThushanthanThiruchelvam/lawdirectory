'use client'
import { assets } from '@/Assets/assets.js'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  MessageCircle 
} from 'lucide-react'

const Footer = () => {
  const { t, i18n } = useTranslation()
  const [profile, setProfile] = useState(null)
  const [logoLight, setLogoLight] = useState(null)

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/profile?lang=${i18n.language}`)
      if (response.data && response.data.profile) {
        setProfile(response.data.profile)
        setLogoLight(response.data.profile.logoLight)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [i18n.language])

  if (!profile) {
    return (
      <footer className="bg-gray-900 text-white pt-12 pb-8 px-5 md:px-10 lg:px-28">
        <div className="container mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-5 md:px-10 lg:px-28">
      <div className="container mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand/Logo section */}
          <div className="lg:col-span-1">
            <Link href='/'>
              <div className="flex items-center mb-5">
                {logoLight ? (
                  <Image 
                    src={logoLight} 
                    alt='Logo' 
                    width={120}
                    height={40}
                    className="mb-4 object-contain"
                  />
                ) : (
                  <div className="w-32 h-10 bg-gray-700 animate-pulse rounded mb-4"></div>
                )}
              </div>
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {profile.tagline || t('footer_tagline', 'Professional legal services with expertise and dedication')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-medium mb-5 text-gray-200">
              {t('quick_links', 'Quick Links')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('home', 'Home')}
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('about', 'About')}
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('services', 'Services')}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('contact', 'Contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base font-medium mb-5 text-gray-200">
              {t('contact', 'Contact')}
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {profile.contacts?.email && (
                <li>{profile.contacts.email}</li>
              )}
              {profile.contacts?.phone && (
                <li>{profile.contacts.phone}</li>
              )}
              {profile.address && (
                <li>{profile.address}</li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-base font-medium mb-5 text-gray-200">
              {t('follow_us', 'Follow Us')}
            </h3>
            <div className="flex gap-3">
              {profile.contacts?.facebook && (
                <a 
                  href={profile.contacts.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              )}
              {profile.contacts?.twitter && (
                <a 
                  href={profile.contacts.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={16} />
                </a>
              )}
              {profile.contacts?.linkedin && (
                <a 
                  href={profile.contacts.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {profile.contacts?.instagram && (
                <a 
                  href={profile.contacts.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
              {profile.contacts?.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.contacts.whatsapp}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            © {new Date().getFullYear()} {profile.fullName || t('all_rights_reserved', 'All rights reserved')}
          </p>
          
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t('privacy_policy', 'Privacy Policy')}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t('terms_of_service', 'Terms of Service')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer