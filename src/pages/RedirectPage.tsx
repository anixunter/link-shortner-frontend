import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api/axiosInterceptor';
import { endpoints } from '../services/endpoints';

// Define a type for our component's state
type RedirectStatus = 'loading' | 'success' | 'error';

const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [status, setStatus] = useState<RedirectStatus>('loading');

  useEffect(() => {
    // Define an async function inside the effect
    const fetchAndRedirect = async () => {
      if (!shortCode) {
        setStatus('error');
        return;
      }
      try {
        // Use our API client to call the new lookup endpoint
        const response = await apiClient.get<{ original_link: string }>(
          endpoints.links.lookup(shortCode)
        );
        
        // If the request succeeds, we get the original link
        const originalLink = response.data.original_link;
        setStatus('success');
        
        // Perform the redirect to the final destination
        window.location.href = originalLink;

      } catch (err) {
        // If the API returns an error (like 404), update the state
        console.error('Failed to find short link:', err);
        setStatus('error');
      }
    };
    
    // Call the function
    fetchAndRedirect();

  }, [shortCode]); // Dependency array ensures this runs once when the component mounts

  // Render different UI based on the status
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-700">Looking for your link...</h1>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-red-500">Oops!</h1>
          <p className="text-lg text-gray-700 mt-4">
            We couldn't find the link you were looking for.
          </p>
          <p className="text-gray-500 mt-2">
            The short link may have been deleted or there might be a typo.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // This will only be shown for a split second during a successful redirect
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700">Redirecting you now...</h1>
      </div>
    </div>
  );
};

export default RedirectPage;