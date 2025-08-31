import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

const BlogItem = ({ title, description, category, image, id }) => {
  const { t, i18n } = useTranslation();
  
  const stripMarkdown = (text) => {
    if (!text) return '';
    
    return text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '$1')
      .replace(/>\s/g, '')
      .replace(/\n/g, ' ')
      .trim();
  };

  const previewText = stripMarkdown(description).slice(0, 120);
  
  const translateCategory = (cat) => {
    switch(cat) {
      case 'News': return t('News', 'News');
      case 'Blog': return t('Blog', 'Blog');
      default: return cat;
    }
  };
  
  return (
    <div className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300'>
      <Link href={`/blogs/${id}?lang=${i18n.language}`}>
        <Image 
          src={image} 
          alt={title} 
          width={400} 
          height={240} 
          className='w-full h-48 object-cover'
        />
      </Link>
      <div className='p-5'>
        <span className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block'>
          {translateCategory(category)}
        </span>
        <h3 className='mb-3 text-lg font-semibold text-gray-900 line-clamp-2 h-14'>
          {title}
        </h3>
        <p className='mb-4 text-sm text-gray-600 line-clamp-3'>
          {previewText}{previewText.length >= 120 ? '...' : ''}
        </p>
        <Link 
          href={`/blogs/${id}?lang=${i18n.language}`} 
          className='inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors'
        >
          {t('Read more', 'Read more')}
          <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default BlogItem