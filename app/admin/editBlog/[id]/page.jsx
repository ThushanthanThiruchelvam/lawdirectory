'use client'

import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import RichTextEditor from '@/Components/RichTextEditor'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '@/Components/ProtectedRoute'

const EditBlogPage = ({ params }) => {
  const [id, setId] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('en');
  const { t } = useTranslation();
  
  const [data, setData] = useState({
    title_en: "",
    description_en: "",
    title_ta: "",
    description_ta: "",
    title_si: "",
    description_si: "",
    category: "News",
    image: ""
  })
  const router = useRouter();

  useEffect(() => {
    const extractId = async () => {
      const { id: blogId } = await params;
      setId(blogId);
    };
    extractId();
  }, [params]);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;

      try {
        const [responseEn, responseTa, responseSi] = await Promise.all([
          axios.get(`/api/blog?id=${id}&lang=en`),
          axios.get(`/api/blog?id=${id}&lang=ta`),
          axios.get(`/api/blog?id=${id}&lang=si`)
        ]);
        
        const blogEn = responseEn.data.blog || {};
        const blogTa = responseTa.data.blog || {};
        const blogSi = responseSi.data.blog || {};

        setData({
          title_en: blogEn.title || "",
          description_en: blogEn.description || "",
          title_ta: blogTa.title || "",
          description_ta: blogTa.description || "",
          title_si: blogSi.title || "",
          description_si: blogSi.description || "",
          category: blogEn.category || "News",
          image: blogEn.image || ""
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error(t('Failed to fetch blog data'));
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBlogData();
  }, [id, t]);

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
      formData.append('title_si', data.title_si);
      formData.append('description_si', data.description_si);
      formData.append('category', data.category);
      
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`/api/blog?id=${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        router.push('/admin/blogList');
      } else {
        toast.error(response.data.error || t("Error occurred"));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || t("Failed to update blog"));
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
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">{t('Edit Blog Post')}</h1>
          
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Upload Thumbnail')}</label>
              <label htmlFor="image" className="cursor-pointer block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Image 
                    className="mx-auto rounded" 
                    src={image ? URL.createObjectURL(image) : (data.image)} 
                    width={140} 
                    height={70} 
                    alt="Blog thumbnail"
                    style={{ width: 'auto', height: 'auto', maxWidth: '300px', maxHeight: '200px' }}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {t('Click to change image')}
                  </p>
                </div>
              </label>
              <input 
                onChange={(e) => setImage(e.target.files[0])} 
                type="file" 
                id="image" 
                hidden 
                accept="image/*"
              />
            </div>
            
            {/* Language Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['en', 'ta', 'si'].map((lang) => (
                  <button 
                    key={lang}
                    type="button"
                    onClick={() => setActiveTab(lang)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === lang ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Content for each language */}
            {['en', 'ta', 'si'].map((lang) => (
              activeTab === lang && (
                <div key={lang} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Blog title')} ({lang.toUpperCase()})
                    </label>
                    <input
                      name={`title_${lang}`}
                      value={data[`title_${lang}`]}
                      onChange={onChangeHandler}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      type="text" 
                      placeholder={t('Type here')}
                      required={lang === 'en'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('Blog Description')} ({lang.toUpperCase()})
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <RichTextEditor 
                        value={data[`description_${lang}`]} 
                        onChange={(value) => onEditorChange(value, lang)}
                        placeholder={t('Write your blog content here...')}
                      />
                    </div>
                  </div>
                </div>
              )
            ))}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Blog category')}</label>
              <select  
                name="category" 
                onChange={onChangeHandler} 
                value={data.category} 
                className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <option value="News">{t('News')}</option>
                <option value="Blog">{t('Blog')}</option>
              </select>
            </div>
            
            <div className="pt-4 flex space-x-3">
              <button 
                type='submit' 
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 transition-colors"
                disabled={loading}
              >
                {loading ? t('Updating...') : t('Update')}
              </button>
              
              <button 
                type='button' 
                onClick={() => router.push('/admin/blogList')}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              >
                {t('Cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default EditBlogPage