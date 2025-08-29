'use client'

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Search, X, MapPin, Briefcase, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LawyersSection = () => {
  const [lawyers, setLawyers] = useState([]);
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('');
  const [allLocations, setAllLocations] = useState([]);
  const [allPracticeAreas, setAllPracticeAreas] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { t, i18n } = useTranslation();

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/lawyers?lang=${i18n.language}`);
      const lawyersData = response.data.lawyers;
      setLawyers(lawyersData);
      
      // Get featured lawyers
      const featured = lawyersData.filter(lawyer => lawyer.isFeatured);
      setFeaturedLawyers(featured);
      
      // Extract unique locations and practice areas
      const locations = [...new Set(lawyersData.flatMap(lawyer => lawyer.locations || []))];
      const practiceAreas = [...new Set(lawyersData.flatMap(lawyer => lawyer.practiceAreas || []))];
      
      setAllLocations(locations);
      setAllPracticeAreas(practiceAreas);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [i18n.language]);

  const handleSearch = () => {
    setIsSearching(true);
    setShowResults(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setPracticeAreaFilter('');
    setShowResults(false);
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = searchTerm === '' || 
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lawyer.description && lawyer.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === '' || 
      (lawyer.locations && lawyer.locations.some(location => 
        location.toLowerCase().includes(locationFilter.toLowerCase())
      ));
    
    const matchesPracticeArea = practiceAreaFilter === '' || 
      (lawyer.practiceAreas && lawyer.practiceAreas.some(area => 
        area.toLowerCase().includes(practiceAreaFilter.toLowerCase())
      ));
    
    return matchesSearch && matchesLocation && matchesPracticeArea;
  });

  const hasActiveFilters = searchTerm || locationFilter || practiceAreaFilter;

  if (loading) {
    return (
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
            <p className="mt-4 text-gray-500">{t('Loading legal experts...')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="lawyers">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">{t('Our Legal Experts')}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t('Connect with experienced legal professionals dedicated to your success')}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-50 p-6 rounded-xl mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                {t('Search by name or expertise')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('Search lawyers...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                {t('Location')}
              </label>
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white appearance-none"
                >
                  <option value="">{t('All Locations')}</option>
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
              <label className="block text-sm font-light text-gray-700 mb-2">
                {t('Practice Area')}
              </label>
              <div className="relative">
                <select
                  value={practiceAreaFilter}
                  onChange={(e) => setPracticeAreaFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white appearance-none"
                >
                  <option value="">{t('All Practice Areas')}</option>
                  {allPracticeAreas.map((area, index) => (
                    <option key={index} value={area}>{area}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Briefcase size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Search size={16} className="mr-2" />
                    {t('Search')}
                  </>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  title={t('Clear all filters')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {showResults && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-light text-gray-900">
                {filteredLawyers.length} {filteredLawyers.length === 1 ? t('Expert') : t('Experts')} {t('Found')}
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <X size={14} className="mr-1" />
                  {t('Clear filters')}
                </button>
              )}
            </div>
            
            {isSearching ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300 mx-auto"></div>
                <p className="mt-4 text-gray-500">{t('Searching our experts...')}</p>
              </div>
            ) : filteredLawyers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredLawyers.map((lawyer) => (
                    <LawyerCard key={lawyer._id} lawyer={lawyer} />
                  ))}
                </div>
                
                {featuredLawyers.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-light text-gray-900 mb-6 text-center">
                      {t('Featured Experts')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredLawyers.slice(0, 3).map((lawyer) => (
                        <LawyerCard key={lawyer._id} lawyer={lawyer} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Search size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">{t('No experts found matching your criteria.')}</p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {t('Clear Filters')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* All Lawyers (when no search) */}
        {!showResults && lawyers.length > 0 && (
          <div>
            <h3 className="text-xl font-light text-gray-900 mb-8 text-center">
              {t('Our Legal Team')}
            </h3>
            
            {featuredLawyers.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-light text-gray-900 mb-6 text-center">
                  {t('Featured Experts')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredLawyers.slice(0, 3).map((lawyer) => (
                    <LawyerCard key={lawyer._id} lawyer={lawyer} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyers
                .filter(lawyer => !lawyer.isFeatured)
                .slice(0, 6)
                .map((lawyer) => (
                  <LawyerCard key={lawyer._id} lawyer={lawyer} />
                ))}
            </div>
            
            {lawyers.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Search size={16} className="mr-2" />
                  {t('Browse All Experts')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        {!showResults && (
          <div className="text-center mt-12">
            <Link
              href="/lawyers"
              className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('View Complete Directory')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// Lawyer Card Component
const LawyerCard = ({ lawyer }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-all duration-300 group">
      <div className="relative h-48 w-full">
        <Image
          src={lawyer.image}
          alt={lawyer.name}
          fill
          className="object-cover group-hover:scale-102 transition-transform duration-300"
        />
        {lawyer.isFeatured && (
          <div className="absolute top-4 right-4 bg-white text-gray-900 px-2.5 py-1 rounded-full text-xs font-light flex items-center shadow-sm">
            <Star size={12} className="mr-1 fill-yellow-400 text-yellow-400" />
            {t('Featured')}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-normal text-gray-900 group-hover:text-gray-700 transition-colors">
          {lawyer.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{lawyer.title}</p>
        
        {lawyer.description && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 line-clamp-2">{lawyer.description}</p>
          </div>
        )}
        
        {lawyer.locations && lawyer.locations.length > 0 && (
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-1.5" />
            <span className="line-clamp-1">{lawyer.locations.join(', ')}</span>
          </div>
        )}
        
        {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Briefcase size={14} className="mr-1.5" />
            <span className="line-clamp-1">{lawyer.practiceAreas.join(', ')}</span>
          </div>
        )}
        
        <div className="mt-5 pt-4 border-t border-gray-100">
          <Link
            href={`/lawyers/${lawyer.slug}`}
            className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors group-hover:underline"
          >
            {t('View Profile')}
            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LawyersSection;