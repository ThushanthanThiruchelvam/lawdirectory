'use client'
import ContactTableItem from '@/Components/AdminComponents/ContactTableItem'
import ProtectedRoute from '@/Components/ProtectedRoute';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/api/contact');
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  }

  const deleteContact = async (mongoId) => {
    try {
      const response = await axios.delete(`/api/contact?id=${mongoId}`);
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchContacts();
      } else {
        toast.error("Failed to delete contact");
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error("Failed to delete contact");
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className='min-h-screen flex items-center justify-center'>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
            <p className="text-gray-600 mt-2">Manage all contact form submissions</p>
          </div>
          
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='text-left py-4 px-6 font-medium text-gray-700'>Name</th>
                    <th className='text-left py-4 px-6 font-medium text-gray-700'>Email</th>
                    <th className='text-left py-4 px-6 font-medium text-gray-700'>Phone</th>
                    <th className='text-left py-4 px-6 font-medium text-gray-700'>Message</th>
                    <th className='text-left py-4 px-6 font-medium text-gray-700'>Date</th>
                    <th className='text-left py-4 px-6 font-medium text-gray-700'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {contacts.map((contact) => (
                    <ContactTableItem 
                      key={contact._id} 
                      contact={contact} 
                      deleteContact={deleteContact}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            
            {contacts.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-lg'>No contact submissions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ContactsPage;