import React, { useState } from 'react';
import { useShortLinkStore } from '../stores/shortLinkStore';

const ShortLinkForm: React.FC = () => {
  const [original_link, setOriginal_link] = useState('');
  const [short_code, setShort_code] = useState('');
  const { createLink, isLoading } = useShortLinkStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!original_link) return;
    
    // Simple URL validation
    try {
      new URL(original_link);
    } catch (_) {
      alert('Please enter a valid URL.');
      return;
    }
    
    createLink({ original_link, short_code: short_code || undefined });
    setOriginal_link('');
    setShort_code('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Create a New Short Link</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={original_link}
          onChange={(e) => setOriginal_link(e.target.value)}
          placeholder="Enter long URL here..."
          className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          value={short_code}
          onChange={(e) => setShort_code(e.target.value)}
          placeholder="Custom code (optional)"
          className="md:w-1/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
        >
          {isLoading ? 'Creating...' : 'Shorten'}
        </button>
      </div>
    </form>
  );
};

export default ShortLinkForm;