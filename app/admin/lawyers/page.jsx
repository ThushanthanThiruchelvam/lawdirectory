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
  
  const fetchLawyers = async () => {
    try {
      const response = await axios.get('/api/lawyers/admin');
      setLawyers(response.data.lawyers);
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
        fetchLawyers(); // Refresh the list
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
      
      const response = await axios.put(`/api/lawyers?id=${lawyerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success('Featured status updated');
        fetchLawyers(); // Refresh the list
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
      
      const response = await axios.put(`/api/lawyers?id=${lawyerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success('Published status updated');
        fetchLawyers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast.error('Failed to update published status');
    }
  }

  useEffect(() => {
    fetchLawyers();
  }, [])

  if (loading) {
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Lawyers</h1>
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
                        {lawyer.locations.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lawyer.practiceAreas.join(', ')}
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
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Page