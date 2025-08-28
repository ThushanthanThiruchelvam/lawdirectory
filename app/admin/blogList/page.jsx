'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ProtectedRoute from '@/Components/ProtectedRoute'

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  
  const fetchBlogs = async () => {
    const response = await axios.get('/api/blog');
    setBlogs(response.data.blogs);
  }

  // Add this deleteBlog function
  const deleteBlog = async (mongoId) => {
    try {
      const response = await axios.delete(`/api/blog?id=${mongoId}`);
      console.log(response.data.msg);
      fetchBlogs(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
    toast.success('Blog deleted successfully');
  }

  useEffect(() => {
    fetchBlogs();
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-800">All Blog Posts</h1>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((item, index) => {
                    return <BlogTableItem 
                      key={index} 
                      mongoId={item._id} 
                      title={item.title} 
                      date={item.date} 
                      deleteBlog={deleteBlog}
                    />  
                  })}
                </tbody>
              </table>
              
              {blogs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No blog posts found
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