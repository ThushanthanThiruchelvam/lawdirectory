import React, { useEffect, useState } from 'react'
import BlogItem from '@/Components/BlogItem'
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BlogList = () => {
    const [menu, setMenu] = useState('All');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/blog?lang=${i18n.language}`);
            setBlogs(response.data.blogs);
            setCurrentPage(1);
        } catch (err) {
            setError(t('Failed to fetch blogs'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [i18n.language]);

    useEffect(() => {
        i18n.on('languageChanged', fetchBlogs);
        return () => {
            i18n.off('languageChanged', fetchBlogs);
        };
    }, [i18n]);

    const filteredBlogs = blogs.filter((item) => 
        menu === "All" ? true : item.category === menu
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const getDisplayedPageNumbers = () => {
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            return pageNumbers;
        }
        
        const half = Math.floor(maxVisiblePages / 2);
        let start = Math.max(currentPage - half, 1);
        let end = Math.min(start + maxVisiblePages - 1, totalPages);
        
        if (end - start < maxVisiblePages - 1) {
            start = Math.max(end - maxVisiblePages + 1, 1);
        }
        
        return pageNumbers.slice(start - 1, end);
    };

    if (loading) return <div className="text-center py-10">{t('Loading...')}</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <div className='text-center my-12'>
                <h1 className='text-3xl font-semibold text-gray-800'>{t('Latest Blogs')}</h1>
            </div>
            
            <div className='flex justify-center gap-4 my-8'>
                {['All', 'News', 'Blog'].map((item) => (
                    <button 
                        key={item}
                        onClick={() => setMenu(item)} 
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            menu === item 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {t(item)}
                    </button>
                ))}
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                {currentBlogs.map((item, index) => (
                    <BlogItem 
                        key={item._id || index} 
                        id={item._id} 
                        image={item.image} 
                        title={item.title}  
                        description={item.description} 
                        category={item.category} 
                    />  
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 mb-12">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`mx-1 px-3 py-2 rounded-md text-sm ${
                            currentPage === 1 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        &larr; {t('Previous')}
                    </button>
                    
                    {getDisplayedPageNumbers().map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`mx-1 w-8 h-8 rounded-md text-sm ${
                                currentPage === number
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`mx-1 px-3 py-2 rounded-md text-sm ${
                            currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {t('Next')} &rarr;
                    </button>
                </div>
            )}
        </div>
    )
}

export default BlogList