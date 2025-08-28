'use client'
import Link from 'next/link'
import React from 'react'

const BlogTableItem = ({ title, date, deleteBlog, mongoId }) => {
  const BlogDate = new Date(date);
  
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{title || "No Title"}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{BlogDate.toDateString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <Link 
            href={`/admin/editBlog/${mongoId}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit
          </Link>
          <button 
            onClick={() => deleteBlog(mongoId)} 
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem