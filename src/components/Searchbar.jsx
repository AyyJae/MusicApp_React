import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ token }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track,album,playlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { albums, playlists, tracks } = response.data;
      // Navigate to the search results page and pass the search results
      navigate('/search', { state: { albums, playlists, tracks } });
    } catch (error) {
      setError('Error fetching search results');
      console.error('Search error:', error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center max-w-md bg-gray-800 p-1 rounded-md">
      <input type="text" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-grow p-2 rounded-l-md bg-gray-700 text-white placeholder-gray-400 outline-none" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
      <button type="submit" className="p-2 bg-gray-600 rounded-r-md hover:bg-gray-500 flex items-center justify-center" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
        <FaSearch className="text-white text-2xl" /> 
      </button>
      {error && <p className="text-red-500 ml-2">{error}</p>}
    </form>
  );
};

export default SearchBar;


