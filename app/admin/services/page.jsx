'use client'

import { assets } from '@/Assets/assets'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '/Components/ProtectedRoute'

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    title_en: "",
    description_en: "",
    title_ta: "",
    description_ta: "",
    title_si: "",
    description_si: "",
    order: 0,
    isActive: true
  });
  const [icon, setIcon] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services');
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error(t('Failed to fetch services'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  }

  const resetForm = () => {
    setFormData({
      title_en: "",
      description_en: "",
      title_ta: "",
      description_ta: "",
      title_si: "",
      description_si: "",
      order: 0,
      isActive: true
    });
    setIcon(null);
    setEditingService(null);
    setShowAddForm(false);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title_en', formData.title_en);
      formDataToSend.append('description_en', formData.description_en);
      formDataToSend.append('title_ta', formData.title_ta);
      formDataToSend.append('description_ta', formData.description_ta);
      formDataToSend.append('title_si', formData.title_si);
      formDataToSend.append('description_si', formData.description_si);
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive);
      
      if (icon) {
        formDataToSend.append('icon', icon);
      }

      let response;
      if (editingService) {
        response = await axios.put(`/api/services?id=${editingService._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('/api/services', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      if (response.data.success) {
        toast.success(response.data.msg);
        resetForm();
        fetchServices();
      } else {
        toast.error(response.data.error || t("Error occurred"));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || t("Failed to save service"));
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (service) => {
    // For editing, we need to fetch the full service data with all languages
    Promise.all([
      axios.get(`/api/services?id=${service._id}&lang=en`),
      axios.get(`/api/services?id=${service._id}&lang=ta`),
      axios.get(`/api/services?id=${service._id}&lang=si`)
    ])
    .then(([responseEn, responseTa, responseSi]) => {
      const serviceEn = responseEn.data.service;
      const serviceTa = responseTa.data.service;
      const serviceSi = responseSi.data.service;
      
      setFormData({
        title_en: serviceEn?.title || "",
        description_en: serviceEn?.description || "",
        title_ta: serviceTa?.title || "",
        description_ta: serviceTa?.description || "",
        title_si: serviceSi?.title || "",
        description_si: serviceSi?.description || "",
        order: service.order || 0,
        isActive: service.isActive !== undefined ? service.isActive : true
      });
      
      setEditingService(service);
      setShowAddForm(true);
    })
    .catch(error => {
      console.error('Error fetching service content:', error);
      // Fallback to English only
      axios.get(`/api/services?id=${service._id}&lang=en`)
        .then(responseEn => {
          const serviceEn = responseEn.data.service;
          setFormData({
            title_en: serviceEn?.title || "",
            description_en: serviceEn?.description || "",
            title_ta: "",
            description_ta: "",
            title_si: "",
            description_si: "",
            order: service.order || 0,
            isActive: service.isActive !== undefined ? service.isActive : true
          });
          setEditingService(service);
          setShowAddForm(true);
        })
        .catch(error => {
          console.error('Error fetching service:', error);
          toast.error(t('Failed to load service data'));
        });
    });
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm(t('Are you sure you want to delete this service?'))) {
      return;
    }
    
    try {
      const response = await axios.delete(`/api/services?id=${serviceId}`);
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchServices();
      } else {
        toast.error(response.data.error || t("Error occurred"));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || t("Failed to delete service"));
    }
  };

  const toggleActive = async (service) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !service.isActive);
      
      const response = await axios.put(`/api/services?id=${service._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchServices();
      } else {
        toast.error(response.data.error || t("Error occurred"));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || t("Failed to update service"));
    }
  };

  if (loading && !showAddForm) {
    return (
      <ProtectedRoute>
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 flex items-center justify-center min-h-screen'>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='flex-1 p-5 sm:p-8 min-h-screen bg-gray-50'>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className='text-2xl font-semibold text-gray-800'>{t('Services Management')}</h1>
            <button 
              onClick={() => setShowAddForm(true)}
              className='bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium'
            >
              {t('Add New Service')}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
              <h2 className='text-xl font-medium mb-6 text-gray-800'>
                {editingService ? t('Edit Service') : t('Add New Service')}
              </h2>
              
              <form onSubmit={onSubmitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h3 className='text-base font-medium text-gray-700 border-b pb-2'>English Content</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Title')} (English) *
                      </label>
                      <input 
                        name='title_en' 
                        onChange={onChangeHandler} 
                        value={formData.title_en} 
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent' 
                        type="text" 
                        placeholder={t('Service title')} 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Description')} (English) *
                      </label>
                      <textarea 
                        name='description_en' 
                        onChange={onChangeHandler} 
                        value={formData.description_en} 
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent' 
                        rows="3"
                        placeholder={t('Service description')} 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className='text-base font-medium text-gray-700 border-b pb-2'>Tamil Content</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Title')} (Tamil)
                      </label>
                      <input 
                        name='title_ta' 
                        onChange={onChangeHandler} 
                        value={formData.title_ta} 
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent' 
                        type="text" 
                        placeholder={t('Service title in Tamil')} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Description')} (Tamil)
                      </label>
                      <textarea 
                        name='description_ta' 
                        onChange={onChangeHandler} 
                        value={formData.description_ta} 
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent' 
                        rows="3"
                        placeholder={t('Service description in Tamil')} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className='text-base font-medium text-gray-700 border-b pb-2'>Sinhala Content</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Title')} (Sinhala)
                      </label>
                      <input 
                        name='title_si' 
                        onChange={onChangeHandler} 
                        value={formData.title_si} 
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent' 
                        type="text" 
                        placeholder={t('Service title in Sinhala')} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('Description')} (Sinhala)
                      </label>
                      <textarea 
                        name='description_si' 
                        onChange={onChangeHandler} 
                        value={formData.description_si} 
                        className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent' 
                        rows="3"
                        placeholder={t('Service description in Sinhala')} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Order')}
                    </label>
                    <input 
                      name='order' 
                      onChange={onChangeHandler} 
                      value={formData.order} 
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent' 
                      type="number" 
                      placeholder="0" 
                    />
                  </div>
                  
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Status')}
                    </label>
                    <select  
                      name="isActive" 
                      onChange={onChangeHandler} 
                      value={formData.isActive} 
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent'
                    >
                      <option value={true}>{t('Active')}</option>
                      <option value={false}>{t('Inactive')}</option>
                    </select>
                  </div> */}
                  
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Icon')}
                    </label>
                    <input 
                      onChange={(e) => setIcon(e.target.files[0])} 
                      type="file" 
                      accept="image/*"
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
                    />
                  </div> */}
                </div>
                
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button 
                    type='submit' 
                    className='bg-gray-900 text-white px-6 py-2.5 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium hover:bg-gray-800 transition-colors'
                    disabled={loading}
                  >
                    {loading ? t('Saving...') : (editingService ? t('Update Service') : t('Add Service'))}
                  </button>
                  
                  <button 
                    type='button' 
                    onClick={resetForm}
                    className='bg-white text-gray-700 px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors'
                  >
                    {t('Cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Icon')}
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Title')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Order')}
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Status')}
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      {t('No services found. Add your first service above.')}
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        {service.icon && service.icon !== 'default-service-icon' ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                            <Image 
                              src={service.icon} 
                              alt={service.title} 
                              width={40} 
                              height={40} 
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 text-xs">Icon</span>
                          </div>
                        )}
                      </td> */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1 mt-1">{service.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.order}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          onClick={() => toggleActive(service)}
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                            service.isActive 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {service.isActive ? t('Inactive') : t('Active')}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-gray-600 hover:text-gray-900 mr-4 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          {t('Edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                        >
                          {t('Delete')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default ServicesPage