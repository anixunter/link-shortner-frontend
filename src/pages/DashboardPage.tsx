import React, { useEffect } from 'react';
import { useShortLinkStore } from '../stores/shortLinkStore';
import ShortLinkForm from '../components/ShortLinkForm';
import LinkItem from '../components/LinkItem';

const DashboardPage: React.FC = () => {
  const { links, isLoading, fetchLinks } = useShortLinkStore();

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return (
    <div>
      <ShortLinkForm />
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Links</h3>
        {isLoading && links.length === 0 ? (
          <p>Loading links...</p>
        ) : links.length === 0 ? (
          <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">You haven't created any links yet.</p>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <LinkItem key={link.id} link={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;