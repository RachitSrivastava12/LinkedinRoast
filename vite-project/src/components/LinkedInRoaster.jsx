import React, { useState } from 'react';
import axios from 'axios';

const LinkedInRoaster = () => {
  const [url, setUrl] = useState('');
  const [roast, setRoast] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoast = async () => {
    setLoading(true);
    setError('');
    setRoast('');
    setProfileData(null);

    try {
      const response = await axios.post('http://localhost:5000/api/roast', { url });
      setRoast(response.data.roast);
      setProfileData(response.data.profileData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to roast. Maybe your profile is already a joke?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">LinkedIn Roaster</h1>
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <input
            type="url"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter LinkedIn Profile URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button
          onClick={handleRoast}
          disabled={loading || !url}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Roasting...' : 'Roast Me!'}
        </button>
        {profileData && (
          <div className="mt-8 p-4 bg-gray-100 rounded">
            <h3 className="text-xl font-semibold">{profileData.name}</h3>
            <p className="text-gray-600">{profileData.title} - {profileData.location}</p>
            <p className="mt-2">Skills: {profileData.skills.join(', ')}</p>
          </div>
        )}
        {roast && (
          <div className="mt-8 p-4 bg-yellow-100 rounded">
            <h3 className="text-xl font-semibold mb-2">Roast:</h3>
            <p>{roast}</p>
          </div>
        )}
        {error && (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded">
            <strong>Error!</strong>
            <span> {error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInRoaster;