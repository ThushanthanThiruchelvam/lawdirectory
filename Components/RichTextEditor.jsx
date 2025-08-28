'use client'
import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="rich-text-editor" data-color-mode="light">
      <div className="flex justify-end mb-2">
        <button
          type="button"
          className={`px-3 py-1 text-sm ${!isPreview ? 'bg-black text-white' : 'bg-gray-200'}`}
          onClick={() => setIsPreview(false)}
        >
          Edit
        </button>
        <button
          type="button"
          className={`px-3 py-1 text-sm ${isPreview ? 'bg-black text-white' : 'bg-gray-200'}`}
          onClick={() => setIsPreview(true)}
        >
          Preview
        </button>
      </div>
      
      <MDEditor
        value={value}
        onChange={onChange}
        preview={isPreview ? 'preview' : 'edit'}
        height={400}
        textareaProps={{
          placeholder: placeholder || 'Write your content here...'
        }}
      />
    </div>
  );
};

export default RichTextEditor;