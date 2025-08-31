'use client'
import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';

const Page = ({ params }) => {
    const unwrappedParams = React.use(params);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();

    const fetchBlogData = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/blog?id=${id}&lang=${i18n.language}`);
            
            if (response.data && response.data.blog) {
                setData(response.data.blog);
            } else if (response.data) {
                setData(response.data);
            } else {
                setError('Blog not found');
            }
        } catch (err) {
            setError('Failed to fetch blog data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (unwrappedParams?.id) {
            fetchBlogData(unwrappedParams.id);
        }
    }, [unwrappedParams, i18n.language]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        if (unwrappedParams?.id) {
            fetchBlogData(unwrappedParams.id);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
        </div>
    );
    
    if (error) return (
        <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-4">{error}</div>
            <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
    
    if (!data) return (
        <div className="text-center py-20">
            <div className="text-lg text-gray-600 mb-4">Blog not found</div>
            <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                Go Home
            </Link>
        </div>
    );

    return (
        <>
            <div className="bg-gray-50 py-5 px-5 md:px-12 lg:px-28">
                <div className='flex justify-between items-center'>
                    <Link href='/'>
                        <Image 
                            src={assets.logo} 
                            width={140} 
                            alt='' 
                            className='w-[100px] sm:w-auto'
                            priority
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        <select 
                            value={i18n.language} 
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
                        >
                            <option value="en">EN</option>
                            <option value="ta">TA</option>
                            <option value="si">SI</option>
                        </select>

                    </div>
                </div>
                <div className='text-center my-16'>
                    <h1 className='text-2xl sm:text-4xl font-light text-gray-800 max-w-[700px] mx-auto leading-tight'>
                        {data.title || 'Untitled Blog Post'}
                    </h1>
                    <p className='mt-4 text-gray-500 text-sm'>{data.date ? new Date(data.date).toLocaleDateString() : ''}</p>
                </div>
            </div>
            
            <div className='mx-5 max-w-[800px] md:mx-auto mt-[-80px] mb-10 bg-white p-6 md:p-8 rounded-lg'>
                {data.image && (
                    <Image 
                        className='w-full h-auto mb-8 rounded' 
                        src={data.image} 
                        width={1280} 
                        height={720} 
                        alt={data.title || 'Blog image'}
                    />
                )}
                
                <div className='prose prose-gray max-w-none'>
                  {data.description ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {data.description}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-400 text-center">No content available for this blog post.</p>
                  )}
                </div>
            </div>
            
            <Footer/>
        </>
    )
}

export default Page