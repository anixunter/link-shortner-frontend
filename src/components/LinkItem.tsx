import React, {useState} from 'react';
import { FaCopy, FaTrash, FaEdit, FaSave, FaTimes, FaMousePointer } from 'react-icons/fa';
import { useShortLinkStore } from '../stores/shortLinkStore';
import { toast } from 'react-hot-toast';

interface ShortLink {
  id: string;
  original_link: string;
  short_code: string;
  clicks: number;
}

const LinkItem: React.FC<{ link: ShortLink }> = ({ link }) => {
  const { updateLink, deleteLink } = useShortLinkStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedOriginalLink, setEditedOriginalLink] = useState(link.original_link);
  const [editedShortCode, setEditedShortCode] = useState(link.short_code);

  const shortUrl = `${window.location.origin}/${link.short_code}`;


  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  const handleCancel = () =>{
    setEditedOriginalLink(link.original_link)
    setEditedShortCode(link.short_code)
    setIsEditing(false)
  }

  const handleSave = async () =>{
    if (!editedOriginalLink.trim() || !editedShortCode.trim()){
      toast.error("Fields cannot be empty.");
      return;
    }
    await updateLink({
      id: link.id,
      original_link: editedOriginalLink,
      short_code: editedShortCode
    })
    setIsEditing(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      
      {/* Link Details Section */}
      <div className="flex-grow w-full overflow-hidden">
        {isEditing ? (
          // --- EDIT MODE VIEW ---
          <div className="flex flex-col gap-2">
            <input 
              type="text"
              value={editedOriginalLink}
              onChange={(e) => setEditedOriginalLink(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-2">
                <span className="text-gray-500">{window.location.origin}/</span>
                <input 
                type="text"
                value={editedShortCode}
                onChange={(e) => setEditedShortCode(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
          </div>
        ) : (
          // --- DISPLAY MODE VIEW ---
          <>
            <p className="text-gray-500 truncate" title={link.original_link}>{link.original_link}</p>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:underline">
              {shortUrl}
            </a>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <FaMousePointer />
                <span>{link.clicks} clicks</span>
            </div>
          </>
        )}
      </div>
      
      {/* Actions Section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isEditing ? (
            // --- EDIT MODE BUTTONS ---
            <>
                <button onClick={handleSave} className="p-2 text-green-600 hover:text-green-800 transition-colors" title="Save">
                    <FaSave size={18} />
                </button>
                <button onClick={handleCancel} className="p-2 text-red-600 hover:text-red-800 transition-colors" title="Cancel">
                    <FaTimes size={18} />
                </button>
            </>
        ) : (
            // --- DISPLAY MODE BUTTONS ---
            <>
                <button onClick={handleCopy} className="p-2 text-gray-600 hover:text-indigo-600 transition-colors" title="Copy">
                    <FaCopy size={18} />
                </button>
                <button onClick={() => setIsEditing(true)} className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Edit">
                    <FaEdit size={18} />
                </button>
                <button onClick={() => deleteLink(link.id)} className="p-2 text-gray-600 hover:text-red-600 transition-colors" title="Delete">
                    <FaTrash size={18} />
                </button>
            </>
        )}
      </div>
    </div>
  );
};

export default LinkItem;