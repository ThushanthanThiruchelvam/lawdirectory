// app/admin/edit-blog/[id]/page.jsx
'use client'

import { assets } from '@/Assets/assets'
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
    category: "News",
    image: ""
  })
  const router = useRouter();

  // Extract ID from params on component mount
  useEffect(() => {
    const extractId = async () => {
      const { id: blogId } = await params;
      setId(blogId);
    };
    extractId();
  }, [params]);

  // Fetch blog data for editing - get both English and Tamil content
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;

      try {
        // Make two API calls to get content for both languages
        const [responseEn, responseTa] = await Promise.all([
          axios.get(`/api/blog?id=${id}&lang=en`),
          axios.get(`/api/blog?id=${id}&lang=ta`)
        ]);
        
        console.log('API Responses:', { en: responseEn.data, ta: responseTa.data });
        
        // Process English content
        const blogEn = responseEn.data.blog;
        let title_en = "";
        let description_en = "";
        let category = "News";
        let image = "";

        if (blogEn) {
          title_en = blogEn.title || "";
          description_en = blogEn.description || "";
          category = blogEn.category || "News";
          image = blogEn.image || "";
        }

        // Process Tamil content
        const blogTa = responseTa.data.blog;
        let title_ta = "";
        let description_ta = "";

        if (blogTa) {
          title_ta = blogTa.title || "";
          description_ta = blogTa.description || "";
        }

        setData({
          title_en,
          description_en,
          title_ta,
          description_ta,
          category,
          image
        });

        console.log('Processed data:', { 
          title_en, description_en, title_ta, description_ta, category, image
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        
        // Fallback: try to get at least English content
        try {
          const responseEn = await axios.get(`/api/blog?id=${id}&lang=en`);
          if (responseEn.data.blog) {
            const blogEn = responseEn.data.blog;
            setData({
              title_en: blogEn.title || "",
              description_en: blogEn.description || "",
              title_ta: "",
              description_ta: "",
              category: blogEn.category || "News",
              image: blogEn.image || ""
            });
          }
        } catch (fallbackError) {
          console.error('Fallback fetch also failed:', fallbackError);
          toast.error(t('Failed to fetch blog data'));
        }
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
      formData.append('category', data.category);
      
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.put(`/api/blog?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Blog Post</h1>
          
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
              <label htmlFor="image" className="cursor-pointer block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Image 
                    className="mx-auto rounded" 
                    src={image ? URL.createObjectURL(image) : (data.image || assets.upload_area)} 
                    width={140} 
                    height={70} 
                    alt="Blog thumbnail"
                    style={{ width: 'auto', height: 'auto', maxWidth: '300px', maxHeight: '200px' }}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to change image
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
                <button 
                  type="button"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'en' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('en')}
                >
                  English
                </button>
                <button 
                  type="button"
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ta' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  onClick={() => setActiveTab('ta')}
                >
                  Tamil
                </button>
              </nav>
            </div>
            
            {/* English Content */}
            {activeTab === 'en' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-2">Blog Title (English)</label>
                  <input 
                    id="title_en"
                    name="title_en" 
                    onChange={onChangeHandler} 
                    value={data.title_en} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    type="text" 
                    placeholder={t('Type here')} 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-2">Blog Description (English)</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextEditor 
                      value={data.description_en} 
                      onChange={(value) => onEditorChange(value, 'en')}
                      placeholder={t('Write your blog content here...')}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Tamil Content */}
            {activeTab === 'ta' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="title_ta" className="block text-sm font-medium text-gray-700 mb-2">Blog Title (Tamil)</label>
                  <input 
                    id="title_ta"
                    name="title_ta" 
                    onChange={onChangeHandler} 
                    value={data.title_ta} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    type="text" 
                    placeholder={t('Type here')} 
                  />
                </div>
                <div>
                  <label htmlFor="description_ta" className="block text-sm font-medium text-gray-700 mb-2">Blog Description (Tamil)</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <RichTextEditor 
                      value={data.description_ta} 
                      onChange={(value) => onEditorChange(value, 'ta')}
                      placeholder={t('Write your blog content here...')}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Blog Category</label>
              <select  
                id="category"
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
                {loading ? t('Updating...') : t('Update Blog')}
              </button>
              
              <button 
                type='button' 
                onClick={() => router.push('/admin/blogList')}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default EditBlogPage