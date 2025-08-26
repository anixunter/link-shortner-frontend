import React from 'react';
import { FaCopy, FaTrash } from 'react-icons/fa';
import { useShortLinkStore } from '../stores/shortLinkStore';
import { toast } from 'react-hot-toast';

interface ShortLink {
  id: string;
  original_link: string;
  short_code: string;
}

const LinkItem: React.FC<{ link: ShortLink }> = ({ link }) => {
  const { deleteLink } = useShortLinkStore();
    const shortUrl = `${window.location.origin}/${link.short_code}`;


  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-grow overflow-hidden">
        <p className="text-gray-500 truncate">{link.original_link}</p>
        <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline">
          {shortUrl}
        </a>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={handleCopy} className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
          <FaCopy size={18} />
        </button>
        <button onClick={() => deleteLink(link.id)} className="p-2 text-gray-600 hover:text-red-600 transition-colors">
          <FaTrash size={18} />
        </button>
      </div>
    </div>
  );
};

export default LinkItem;