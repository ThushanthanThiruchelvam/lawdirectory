// app/admin/edit-lawyer/[id]/page.jsx
'use client'

import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ProtectedRoute from '/components/ProtectedRoute'
import { useRouter } from 'next/navigation'

const EditLawyerPage = ({ params }) => {
  const [id, setId] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const router = useRouter();
  
  const [locations, setLocations] = useState(['']);
  const [practiceAreas, setPracticeAreas] = useState(['']);
  
  const [data, setData] = useState({
    lawyerId: "",
    name: "",
    title: "",
    description: "",
    isFeatured: false,
    isPublished: false,
    image: ""
  })

  useEffect(() => {
    const extractId = async () => {
      const { id: lawyerId } = await params;
      setId(lawyerId);
    };
    extractId();
  }, [params]);

  useEffect(() => {
    const fetchLawyerData = async () => {
      if (!id) return;

      try {
        const response = await axios.get(`/api/lawyers/admin?id=${id}`);
        const lawyer = response.data.lawyer;
        
        setData({
          lawyerId: lawyer.lawyerId,
          name: lawyer.name,
          title: lawyer.title,
          description: lawyer.description,
          isFeatured: lawyer.isFeatured,
          isPublished: lawyer.isPublished,
          image: lawyer.image
        });
        
        setLocations(lawyer.locations);
        setPracticeAreas(lawyer.practiceAreas);
      } catch (error) {
        console.error('Error fetching lawyer:', error);
        toast.error('Failed to fetch lawyer data');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchLawyerData();
  }, [id]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const addLocation = () => {
    setLocations([...locations, '']);
  }

  const removeLocation = (index) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  }

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  }

  const addPracticeArea = () => {
    setPracticeAreas([...practiceAreas, '']);
  }

  const removePracticeArea = (index) => {
    if (practiceAreas.length > 1) {
      setPracticeAreas(practiceAreas.filter((_, i) => i !== index));
    }
  }

  const handlePracticeAreaChange = (index, value) => {
    const newPracticeAreas = [...practiceAreas];
    newPracticeAreas[index] = value;
    setPracticeAreas(newPracticeAreas);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('isFeatured', data.isFeatured);
      formData.append('isPublished', data.isPublished);
      
      locations.forEach(location => {
        formData.append('locations', location);
      });
      
      practiceAreas.forEach(area => {
        formData.append('practiceAreas', area);
      });
      
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`/api/lawyers?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        router.push('/admin/lawyers');
      } else {
        toast.error(response.data.error || "Error occurred");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || "Failed to update lawyer");
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading || !id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Lawyer</h1>
          </div>
          
          <form onSubmit={onSubmitHandler} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                {!image ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <img 
                      src={data.image} 
                      alt="Current profile" 
                      className="object-contain rounded-md max-h-32 mb-2"
                    />
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt="Preview" 
                      className="object-contain rounded-md max-h-44"
                    />
                  </div>
                )}
                <input 
                  onChange={(e) => setImage(e.target.files[0])} 
                  type="file" 
                  id="image" 
                  hidden 
                  accept="image/*"
                />
              </label>
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lawyerId" className="block text-sm font-medium text-gray-700 mb-2">
                  Lawyer ID
                </label>
                <input
                  id="lawyerId"
                  name="lawyerId"
                  value={data.lawyerId}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                  disabled
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={onChangeHandler}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter lawyer's full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title/Position *
                </label>
                <input
                  id="title"
                  name="title"
                  value={data.title}
                  onChange={onChangeHandler}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Senior Partner, Attorney"
                  required
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={onChangeHandler}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write a detailed description about the lawyer"
                required
              />
            </div>
            
            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locations *
                <button 
                  type="button" 
                  onClick={addLocation}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  + Add Another
                </button>
              </label>
              {locations.map((location, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    value={location}
                    onChange={(e) => handleLocationChange(index, e.target.value)}
                    className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location"
                    required
                  />
                  {locations.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeLocation(index)}
                      className="ml-2 text-red-600 hover:text-red-800 p-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Practice Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Areas *
                <button 
                  type="button" 
                  onClick={addPracticeArea}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  + Add Another
                </button>
              </label>
              {practiceAreas.map((area, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    value={area}
                    onChange={(e) => handlePracticeAreaChange(index, e.target.value)}
                    className="block flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter practice area"
                    required
                  />
                  {practiceAreas.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removePracticeArea(index)}
                      className="ml-2 text-red-600 hover:text-red-800 p-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Toggles */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={data.isFeatured}
                  onChange={onChangeHandler}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Lawyer</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={data.isPublished}
                  onChange={onChangeHandler}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Publish Immediately</span>
              </label>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => router.push('/admin/lawyers')}
                className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating Lawyer...' : 'Update Lawyer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default EditLawyerPage