'use client'

import axios from 'axios'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import RichTextEditor from '@/Components/RichTextEditor'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '@/Components/ProtectedRoute'

const Page = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('en');
  const { t } = useTranslation();
  
  const [data, setData] = useState({
    title_en: "",
    description_en: "",
    title_ta: "",
    description_ta: "",
    category: "News",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const onEditorChange = (value, language) => {
    setData(data => ({ ...data, [`description_${language}`]: value }));
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title_en', data.title_en);
      formData.append('description_en', data.description_en);
      formData.append('title_ta', data.title_ta);
      formData.append('description_ta', data.description_ta);
      formData.append('category', data.category);
      
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post('/api/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(false);
        // Reset form
        setData({
          title_en: "",
          description_en: "",
          title_ta: "",
          description_ta: "",
          category: "News",
        });
        setImage(null);
      } else {
        toast.error(response.data.error || "Error occurred");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
            <p className="mt-2 text-sm text-gray-600">Add a new blog post in multiple languages</p>
          </div>
          
          <form onSubmit={onSubmitHandler} className="bg-white shadow-sm rounded-lg p-6">
            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
              <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                {!image ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">Click to upload thumbnail</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <Image 
                      src={URL.createObjectURL(image)} 
                      alt="Preview" 
                      fill
                      className="object-contain rounded-md"
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
            
            {/* Language Tabs */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === 'en'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  English Content
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ta')}
                  className={`py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === 'ta'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tamil Content
                </button>
              </nav>
            </div>
            
            {/* English Content */}
            {activeTab === 'en' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title (English)
                  </label>
                  <input
                    id="title_en"
                    name="title_en"
                    value={data.title_en}
                    onChange={onChangeHandler}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter blog title in English"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Content (English)
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <RichTextEditor 
                      value={data.description_en} 
                      onChange={(value) => onEditorChange(value, 'en')}
                      placeholder="Write your blog content in English..."
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Tamil Content */}
            {activeTab === 'ta' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title_ta" className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title (Tamil)
                  </label>
                  <input
                    id="title_ta"
                    name="title_ta"
                    value={data.title_ta}
                    onChange={onChangeHandler}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter blog title in Tamil"
                  />
                </div>
                
                <div>
                  <label htmlFor="description_ta" className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Content (Tamil)
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <RichTextEditor 
                      value={data.description_ta} 
                      onChange={(value) => onEditorChange(value, 'ta')}
                      placeholder="Write your blog content in Tamil..."
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Category Selection */}
            <div className="mt-8">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={data.category}
                onChange={onChangeHandler}
                className="block w-64 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="News">News</option>
                <option value="Blog">Blog</option>
              </select>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Publishing...' : 'Publish Blog Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Page