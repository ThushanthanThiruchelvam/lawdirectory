'use client'

import { assets } from '@/Assets/assets'
import Footer from '@/Components/Footer'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, X, MapPin, Briefcase, Filter } from 'lucide-react'

const Page = () => {
  const [lawyers, setLawyers] = useState([])
  const [filteredLawyers, setFilteredLawyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('')
  const [allLocations, setAllLocations] = useState([])
  const [allPracticeAreas, setAllPracticeAreas] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Header state
  const [menu, setMenu] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const fetchLawyers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/lawyers')
      const lawyersData = response.data.lawyers
      setLawyers(lawyersData)
      setFilteredLawyers(lawyersData)
      
      // Extract unique locations and practice areas
      const locations = [...new Set(lawyersData.flatMap(lawyer => lawyer.locations))]
      const practiceAreas = [...new Set(lawyersData.flatMap(lawyer => lawyer.practiceAreas))]
      
      setAllLocations(locations)
      setAllPracticeAreas(practiceAreas)
    } catch (error) {
      console.error('Error fetching lawyers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLawyers()
  }, [])

  useEffect(() => {
    let results = lawyers
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply location filter
    if (locationFilter) {
      results = results.filter(lawyer =>
        lawyer.locations.some(location =>
          location.toLowerCase().includes(locationFilter.toLowerCase())
        )
      )
    }
    
    // Apply practice area filter
    if (practiceAreaFilter) {
      results = results.filter(lawyer =>
        lawyer.practiceAreas.some(area =>
          area.toLowerCase().includes(practiceAreaFilter.toLowerCase())
        )
      )
    }
    
    setFilteredLawyers(results)
  }, [searchTerm, locationFilter, practiceAreaFilter, lawyers])

  const clearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setPracticeAreaFilter('')
  }

  const hasActiveFilters = searchTerm || locationFilter || practiceAreaFilter

  if (loading) {
    return (
      <>
        {/* Modern Minimalist Header */}
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
            
            <div className='flex items-center gap-4'>
              <select 
                value={i18n.language} 
                onChange={(e) => changeLanguage(e.target.value)}
                className='px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer appearance-none bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiM3ODc5N0EiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=")] bg-no-repeat bg-[center_right_0.5rem] bg-[length:16px_16px] pr-8'
              >
                <option value="en">EN</option>
                <option value="ta">TA</option>
              </select>
              
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
        </div>
        
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading legal experts...</p>
          </div>
        </div>
        
        <Footer />
      </>
    )
  }

  return (
    <>
      {/* Modern Minimalist Header */}
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
              href='/lawyers'
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
              href='/lawyers' 
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

      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-light text-gray-900 mb-4">Legal Experts Directory</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Connect with experienced legal professionals dedicated to your success
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-light text-gray-700 mb-2">Search by name or expertise</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search legal experts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white"
                  />
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X size={16} className="mr-2" />
                  Clear
                </button>
              )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white appearance-none"
                    >
                      <option value="">All Locations</option>
                      {allLocations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <MapPin size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">Practice Area</label>
                  <div className="relative">
                    <select
                      value={practiceAreaFilter}
                      onChange={(e) => setPracticeAreaFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white appearance-none"
                    >
                      <option value="">All Practice Areas</option>
                      {allPracticeAreas.map((area, index) => (
                        <option key={index} value={area}>{area}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Briefcase size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-gray-900">
              {filteredLawyers.length} {filteredLawyers.length === 1 ? 'Expert' : 'Experts'} Available
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <X size={14} className="mr-1" />
                Clear filters
              </button>
            )}
          </div>
          
          {/* Lawyers Grid */}
          {filteredLawyers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLawyers.map((lawyer) => (
                <div key={lawyer._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-all duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={lawyer.image}
                      alt={lawyer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-normal text-gray-900">{lawyer.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{lawyer.title}</p>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 line-clamp-2">{lawyer.description}</p>
                    </div>
                    
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <MapPin size={14} className="mr-1.5" />
                      <span className="line-clamp-1">{lawyer.locations.join(', ')}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Briefcase size={14} className="mr-1.5" />
                      <span className="line-clamp-1">{lawyer.practiceAreas.join(', ')}</span>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href={`/lawyers/${lawyer.slug}`}
                        className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors hover:underline"
                      >
                        View Profile
                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No experts found matching your criteria.</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  )
}

export default Page