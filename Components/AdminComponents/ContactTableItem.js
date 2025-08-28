import React, { useState } from 'react'
import Portal from '@/Components/Portal'

const ContactTableItem = ({ contact, deleteContact }) => {
  const contactDate = new Date(contact.date);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-medium text-gray-700">
                {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
              </span>
            </div>
            <div className="ml-4">
              <div className="font-medium text-gray-900">
                {contact.firstName} {contact.lastName}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <a 
            href={`mailto:${contact.email}`} 
            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
          >
            {contact.email}
          </a>
        </td>
        <td className="px-6 py-4">
          {contact.phone || (
            <span className="text-gray-400">Not provided</span>
          )}
        </td>
        <td 
          className="px-6 py-4 max-w-xs"
          onClick={() => setShowModal(true)}
        >
          <div className="group flex items-center cursor-pointer">
            <span className="truncate text-gray-700 group-hover:text-gray-900 transition-colors duration-150">
              {contact.message.length > 50 ? `${contact.message.substring(0, 50)}...` : contact.message}
            </span>
            <span className="ml-2 text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              View
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-500">
            <div>{contactDate.toLocaleDateString()}</div>
            <div className="text-xs">{contactDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
          </div>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => deleteContact(contact._id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-150 p-1 rounded-md hover:bg-red-50"
            title="Delete contact"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      </tr>

      {/* Message Modal using Portal */}
      {showModal && (
        <Portal>
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Message from {contact.firstName} {contact.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {contactDate.toLocaleDateString()} at {contactDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-150 rounded-full p-1 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                    >
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-gray-900">{contact.phone}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Message</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-150 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}

export default ContactTableItem