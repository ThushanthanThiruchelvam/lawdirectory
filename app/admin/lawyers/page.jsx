// app/admin/lawyers/page.jsx
'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ProtectedRoute from '/components/ProtectedRoute'
import Link from 'next/link';

const Page = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLawyers, setTotalLawyers] = useState(0);
  const itemsPerPage = 10; // Number of items per page
  
  const fetchLawyers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/lawyers?admin=true&page=${page}&limit=${itemsPerPage}`);
      setLawyers(response.data.lawyers);
      setTotalPages(response.data.totalPages);
      setTotalLawyers(response.data.totalLawyers);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      toast.error('Failed to fetch lawyers');
    } finally {
      setLoading(false);
    }
  }

  const deleteLawyer = async (lawyerId) => {
    if (!window.confirm('Are you sure you want to delete this lawyer?')) return;
    
    try {
      const response = await axios.delete(`/api/lawyers?id=${lawyerId}`);
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchLawyers(currentPage); // Refresh the current page
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error('Error deleting lawyer:', error);
      toast.error(error.response?.data?.error || 'Failed to delete lawyer');
    }
  }

  const toggleFeatured = async (lawyerId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('isFeatured', (!currentStatus).toString());
      
      const response = await axios.put(`/api/lawyers?id=${lawyerId}`, formData);
      
      if (response.data.success) {
        toast.success('Featured status updated');
        fetchLawyers(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
    }
  }

  const togglePublished = async (lawyerId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('isPublished', (!currentStatus).toString());
      
      const response = await axios.put(`/api/lawyers?id=${lawyerId}`, formData);
      
      if (response.data.success) {
        toast.success('Published status updated');
        fetchLawyers(currentPage); // Refresh the current page
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast.error('Failed to update published status');
    }
  }

  useEffect(() => {
    fetchLawyers(1);
  }, [])

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the beginning
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  if (loading && lawyers.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Lawyers</h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalLawyers)} of {totalLawyers} lawyers
              </p>
            </div>
            <Link 
              href="/admin/add-lawyer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Lawyer
            </Link>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lawyer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Locations
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Practice Areas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lawyers.map((lawyer) => (
                    <tr key={lawyer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={lawyer.image} alt={lawyer.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lawyer.name}</div>
                            <div className="text-sm text-gray-500">{lawyer.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lawyer.lawyerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lawyer.locations && lawyer.locations.length > 0 ? lawyer.locations.join(', ') : 'No locations'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 ? lawyer.practiceAreas.join(', ') : 'No practice areas'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-4">
                          {/* Featured Toggle Switch */}
                          <label className="flex items-center cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={lawyer.isFeatured}
                                onChange={() => toggleFeatured(lawyer.lawyerId, lawyer.isFeatured)}
                                className="sr-only"
                              />
                              <div className={`w-10 h-6 rounded-full transition-colors ${
                                lawyer.isFeatured ? 'bg-green-500' : 'bg-gray-300'
                              }`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                lawyer.isFeatured ? 'transform translate-x-4' : ''
                              }`}></div>
                            </div>
                            <span className="ml-3 text-sm text-gray-700">
                              {lawyer.isFeatured ? 'Featured' : 'Not Featured'}
                            </span>
                          </label>
                          
                          {/* Published Toggle Switch */}
                          <label className="flex items-center cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={lawyer.isPublished}
                                onChange={() => togglePublished(lawyer.lawyerId, lawyer.isPublished)}
                                className="sr-only"
                              />
                              <div className={`w-10 h-6 rounded-full transition-colors ${
                                lawyer.isPublished ? 'bg-blue-500' : 'bg-gray-300'
                              }`}></div>
                              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                lawyer.isPublished ? 'transform translate-x-4' : ''
                              }`}></div>
                            </div>
                            <span className="ml-3 text-sm text-gray-700">
                              {lawyer.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/edit-lawyer/${lawyer.lawyerId}`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteLawyer(lawyer.lawyerId)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {lawyers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No lawyers found. <Link href="/admin/add-lawyer" className="text-blue-600 hover:underline">Add your first lawyer</Link>.
                </div>
              )}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalLawyers)}
                      </span> of <span className="font-medium">{totalLawyers}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => fetchLawyers(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => fetchLawyers(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => fetchLawyers(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Page