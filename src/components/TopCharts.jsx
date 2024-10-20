import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const TopCharts = ({ token, handleLogout }) => {
  const [newReleases, setNewReleases] = useState([]);
  const [topCharts, setTopCharts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchNewReleases();
      fetchTopCharts();
    }
  }, [token]);

  // Function to fetch new releases
  const fetchNewReleases = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewReleases(response.data.albums.items);
    } catch (error) {
      setError('Error fetching new releases');
      console.error('Error fetching new releases:', error);
    }
  };

  // Function to fetch top charts (Top 50 Global playlist)
  //   const fetchTopCharts = async () => {
  //     const top50GlobalPlaylistId = '37i9dQZEVXbMDoHDwVN2tF'; // This is the playlist ID for "Top 50 Global"

  //     try {
  //       const response = await axios.get(`https://api.spotify.com/v1/playlists/${top50GlobalPlaylistId}/tracks`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setTopCharts(response.data.items);
  //     } catch (error) {
  //       setError('Error fetching top charts');
  //       console.error('Error fetching top charts:', error);
  //     }
  //   };

  // Function to fetch top charts (Top 50 India playlist)
  const fetchTopCharts = async () => {
    const top50IndiaPlaylistId = '37i9dQZEVXbLZ52XmnySJg';

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${top50IndiaPlaylistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopCharts(response.data.items);
    } catch (error) {
      setError('Error fetching top charts');
      console.error('Error fetching top charts:', error);
    }
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handleTrackClick = (trackId) => {
    
    navigate(`/track/${trackId}`);
  };

  return (
    <>
      <Navbar token={token} handleLogout={handleLogout} />
      <div>
        <div className="my-5 font-bold text-2xl">New Releases</div>
        {error && <p>{error}</p>}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {newReleases.length > 0 ? (
            newReleases.map((album) => (
              <div key={album.id} className="bg-gray-900 p-4 rounded cursor-pointer" onClick={() => handleAlbumClick(album.id)}>
                <img src={album.images[0].url} alt={album.name} className="w-full h-40 object-cover rounded" />
                <p className="mt-2">{album.name}</p>
                <p className="text-sm text-gray-400">{album.artists[0].name}</p>
              </div>
            ))
          ) : (
            <p>No new releases found</p>
          )}
        </div>

        {/* <h2 className="mt-10">Top Charts (Top 50 Global)</h2> */}
        <div className="my-5 font-bold text-2xl">Top Charts (Top 50 India)</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topCharts.length > 0 ? (
            topCharts.map((track) => (
              <div key={track.track.id} className="bg-gray-900 p-4 rounded cursor-pointer" onClick={() => handleTrackClick(track.track.id)}>
                {/* <Link to={`/album/${track.album.id}`} className="hover:text-blue-400">
                     {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                   </Link> */}
                <img src={track.track.album.images[0].url} alt={track.track.name} className="w-full h-40 object-cover rounded" />
                <p className="mt-2">{track.track.name}</p>
                <p className="text-sm text-gray-400">{track.track.artists[0].name}</p>
              </div>
            ))
          ) : (
            <p>No top chart tracks found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TopCharts;
