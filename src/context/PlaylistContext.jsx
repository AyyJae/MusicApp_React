// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create a context
// export const PlaylistContext = createContext();


import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PlayerContext } from './PlayerContext'; // Import PlayerContext

// Create a context
export const PlaylistContext = createContext();

const PlaylistProvider = ({ children, token }) => {
  const [playlists, setPlaylists] = useState([]);
  const { setTrackList } = useContext(PlayerContext); // Access PlayerContext

  // Function to fetch playlists
  const fetchPlaylists = async () => {
    try {
      const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylists(playlistResponse.data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  // Function to fetch tracks from a specific playlist
  const fetchTracksFromPlaylist = async (playlistId) => {
    try {
      const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrackList(tracksResponse.data.items.map(item => item.track)); // Update track list in PlayerContext
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  // Fetch playlists when the component mounts
  useEffect(() => {
    if (token) {
      fetchPlaylists();
    }
  }, [token]);

  return (
    <PlaylistContext.Provider value={{ playlists, fetchPlaylists, fetchTracksFromPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistProvider;



// const PlaylistProvider = ({ children, token }) => {
//   const [playlists, setPlaylists] = useState([]);

//   // Function to fetch playlists
//   const fetchPlaylists = async () => {
//     try {
//       const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlistResponse.data.items);
//     } catch (error) {
//       console.error('Error fetching playlists:', error);
//     }
//   };

//   // Fetch playlists when the component mounts
//   useEffect(() => {
//     if (token) {
//       fetchPlaylists();
//     }
//   }, [token]);

//   return (
//     <PlaylistContext.Provider value={{ playlists, fetchPlaylists }}>
//       {children}
//     </PlaylistContext.Provider>
//   );
// };

// export default PlaylistProvider;
