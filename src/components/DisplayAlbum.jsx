import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import axios from 'axios';
import Navbar from './Navbar';
import { FaEllipsisH } from 'react-icons/fa';

const DisplayAlbum = ({ token, handleLogout }) => {
  const { id } = useParams();
  const menuRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const { setTrack, play } = useContext(PlayerContext);
  const [albumDetails, setAlbumDetails] = useState(null);
  const [notification, setNotification] = useState(null); // State for notifications
  const [hoveredTrackId, setHoveredTrackId] = useState(null);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlbumDetails(albumResponse.data);

        const trackResponse = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTracks(trackResponse.data.items);
      } catch (error) {
        setError('Error fetching album details or tracks: ' + error.response?.data?.error?.message);
        console.error('Error fetching album details or tracks:', error);
      }
    };

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

    if (token && id) {
      fetchAlbumDetails();
      fetchPlaylists();
    }
  }, [id, token]);

  const handleTrackClick = (track) => {
    const trackInfo = {
      name: track.name,
      artists: track.artists.map((artist) => artist.name).join(', '),
      previewUrl: track.preview_url,
      image: albumDetails.images[0].url,
      desc: track.artists.map((artist) => artist.name).join(', '),
    };
    setTrack(trackInfo);
    play();
  };

  const addToPlaylist = async (track, playlistId) => {
    try {
      // Check if the track is already in the playlist
      const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const trackExists = playlistResponse.data.items.some(item => item.track.id === track.id);

      if (trackExists) {
        setNotification({ message: 'Track already exists in this playlist.', type: 'duplicate' });
        setShowPlaylistMenu(null);
        setTimeout(() => setNotification(null), 1000);
        return;
      }

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: [track.uri] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setNotification({ message: `${track.name} added to playlist!`, type: 'success' });
      setShowPlaylistMenu(null);
      setTimeout(() => setNotification(null), 1000);
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      setNotification({ message: 'Failed to add track to playlist.', type: 'error' });
      setTimeout(() => setNotification(null), 1000);
    }
  };


    //OLD
  // const addToPlaylist = async (track, playlistId) => {
  //   try {
  //     await axios.post(
  //       `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
  //       { uris: [track.uri] },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     setNotification(`${track.name} added to playlist!`); // Show success message
  //     setShowPlaylistMenu(null);
  //     setTimeout(() => setNotification(null), 1000);
  //   } catch (error) {
  //     console.error('Error adding track to playlist:', error);
  //     setNotification('Failed to add track to playlist.'); // Show error message
  //     setTimeout(() => setNotification(null), 1000);
  //   }
  // };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowPlaylistMenu(null);
    }
  };

  useEffect(() => {
    if (showPlaylistMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPlaylistMenu]);

  return (
    <>
      <Navbar token={token} handleLogout={handleLogout} />
      {notification && (
        <div className={`absolute top-5 right-7 text-white px-4 py-2 rounded shadow-md z-50 ${notification.type === 'duplicate' ? 'bg-blue-500' : 'bg-green-500'}`}>{notification.message}</div>
        // <div className="absolute top-5 right-6 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50">
        //   {notification}
        // </div>
      )}
      <div className="my-5">
        {albumDetails ? (
          <div className="album-details mb-6">
            <div className="flex items-center">
              <img src={albumDetails.images[0].url} alt={albumDetails.name} className="w-40 h-40 object-cover rounded mr-4" />
              <div>
                <h2 className="text-3xl font-bold">{albumDetails.name}</h2>
                <p className="text-lg text-gray-400">{albumDetails.artists.map((artist) => artist.name).join(', ')}</p>
                <p className="text-gray-500 mt-2">Release Date: {albumDetails.release_date}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>{error || 'Loading album details...'}</p>
        )}

        <div className="track-list">
          <h3 className="text-2xl font-semibold mb-4">Tracks</h3>
          {tracks.length > 0 ? (
            <ul>
              {tracks.map((track) => (
                <li key={track.id} className="bg-[#1a1a1a] p-4 rounded mb-2 flex justify-between items-center relative cursor-pointer" onMouseEnter={() => setHoveredTrackId(track.id)} onMouseLeave={() => setHoveredTrackId(null)}>
                  <div onClick={() => handleTrackClick(track)}>
                    <p className="text-xl font-semibold">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.artists.map((artist) => artist.name).join(', ')}</p>
                  </div>

                  {hoveredTrackId === track.id && (
                    <div className="absolute right-4 flex items-center space-x-2">
                      <button className="text-gray-800 hover:text-white" onClick={() => setShowPlaylistMenu(track.id)}>
                        <FaEllipsisH className="text-lg" />
                      </button>
                    </div>
                  )}

                  {showPlaylistMenu === track.id && (
                    <div className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2" ref={menuRef}>
                      <p className="text-white font-semibold mb-2">Add to playlist</p>
                      {playlists.length > 0 ? (
                        <ul>
                          {playlists.map((playlist) => (
                            <li key={playlist.id} className="text-gray-400 hover:text-white cursor-pointer" onClick={() => addToPlaylist(track, playlist.id)}>
                              {playlist.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">No playlists available</p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>{error || 'No tracks found'}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DisplayAlbum;

// const DisplayAlbum = ({ token, handleLogout }) => {
//   const { id } = useParams(); // Get the album ID from the URL
//   const menuRef = useRef(null); // Ref to detect outside clicks
//   const [tracks, setTracks] = useState([]);
//   const [error, setError] = useState(null);
//   const [playlists, setPlaylists] = useState([]); // Store user's playlists
//   const { setTrack, play } = useContext(PlayerContext);
//   const [albumDetails, setAlbumDetails] = useState(null);
//   const [hoveredTrackId, setHoveredTrackId] = useState(null); // Track currently hovered track
//   const [showPlaylistMenu, setShowPlaylistMenu] = useState(null); // Track which menu is open

//   useEffect(() => {
//     // Fetch album details and tracks
//     const fetchAlbumDetails = async () => {
//       try {
//         // Fetch album details
//         const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAlbumDetails(albumResponse.data); // Store album details

//         // Fetch album tracks
//         const trackResponse = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setTracks(trackResponse.data.items); // Store album tracks
//       } catch (error) {
//         setError('Error fetching album details or tracks: ' + error.response?.data?.error?.message);
//         console.error('Error fetching album details or tracks:', error);
//       }
//     };

//     // Fetch user's playlists
//     const fetchPlaylists = async () => {
//       try {
//         const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setPlaylists(playlistResponse.data.items); // Store user playlists
//       } catch (error) {
//         console.error('Error fetching playlists:', error);
//       }
//     };

//     if (token && id) {
//       fetchAlbumDetails();
//       fetchPlaylists();
//     }
//   }, [id, token]);

//   // Handle track click to play it in the player
//   const handleTrackClick = (track) => {
//     const trackInfo = {
//       name: track.name,
//       artists: track.artists.map(artist => artist.name).join(', '),
//       previewUrl: track.preview_url,
//       image: albumDetails.images[0].url,
//       desc: track.artists.map(artist => artist.name).join(', '),
//     };
//     setTrack(trackInfo); // Set track in PlayerContext
//     play(); // Start playing
//   };

//   // Handle adding a track to a playlist
//   const addToPlaylist = async (track, playlistId) => {
//     try {
//       await axios.post(
//         `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//         {
//           uris: [track.uri], // Spotify uses track URI
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       setShowPlaylistMenu(null); // Close the menu after adding to playlist
//      // alert(`${track.name} added to playlist!`);
//     } catch (error) {
//       console.error('Error adding track to playlist:', error);

//     }
//   };

//   const handleClickOutside = (event) => {
//     if (menuRef.current && !menuRef.current.contains(event.target)) {
//       setShowPlaylistMenu(null); // Close the menu if clicking outside
//     }
//   };

//   useEffect(() => {
//     if (showPlaylistMenu) {
//       document.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showPlaylistMenu]);

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="my-5">
//         {/* Display album details (name, image) */}
//         {albumDetails ? (
//           <div className="album-details mb-6">
//             <div className="flex items-center">
//               <img
//                 src={albumDetails.images[0].url}
//                 alt={albumDetails.name}
//                 className="w-40 h-40 object-cover rounded mr-4"
//               />
//               <div>
//                 <h2 className="text-3xl font-bold">{albumDetails.name}</h2>
//                 <p className="text-lg text-gray-400">
//                   {albumDetails.artists.map(artist => artist.name).join(', ')}
//                 </p>
//                 <p className="text-gray-500 mt-2">Release Date: {albumDetails.release_date}</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p>{error || 'Loading album details...'}</p>
//         )}

//         {/* Display Tracks */}
//         <div className="track-list">
//           <h3 className="text-2xl font-semibold mb-4">Tracks</h3>
//           {tracks.length > 0 ? (
//             <ul>
//               {tracks.map((track) => (
//                 <li
//                   key={track.id}
//                   className="bg-[#1a1a1a] p-4 rounded mb-2 flex justify-between items-center relative cursor-pointer"
//                   onMouseEnter={() => setHoveredTrackId(track.id)} // Show dots on hover
//                   onMouseLeave={() => setHoveredTrackId(null)} // Hide dots when not hovered
//                 >
//                   <div onClick={() => handleTrackClick(track)}>
//                     <p className="text-xl font-semibold">{track.name}</p>
//                     <p className="text-sm text-gray-400">
//                       {track.artists.map((artist) => artist.name).join(', ')}
//                     </p>
//                   </div>

//                   {/* Show three dots when hovered */}
//                   {hoveredTrackId === track.id && (
//                     <div className="absolute right-4 flex items-center space-x-2">
//                       <button
//                         className="text-gray-800 hover:text-white"
//                         onClick={() => setShowPlaylistMenu(track.id)} // Show playlist menu
//                       >
//                         <FaEllipsisH className="text-lg" />
//                       </button>
//                     </div>
//                   )}

//                   {/* Show playlist options when dots are clicked */}
//                   {showPlaylistMenu === track.id && (
//                     <div className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2"
//                     ref={menuRef} // Attach ref to detect outside clicks
//                     >
//                       <p className="text-white font-semibold mb-2">Add to playlist</p>
//                       {playlists.length > 0 ? (
//                         <ul>
//                           {playlists.map((playlist) => (
//                             <li
//                               key={playlist.id}
//                               className="text-gray-400 hover:text-white cursor-pointer"
//                               onClick={() => addToPlaylist(track, playlist.id)}
//                             >
//                               {playlist.name}
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                         <p className="text-gray-400">No playlists available</p>
//                       )}
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>{error || 'No tracks found'}</p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default DisplayAlbum;

// // const DisplayAlbum = ({ token, handleLogout }) => {
// //   const { id } = useParams(); // Get the album ID from the URL
// //   const menuRef = useRef(null); // Ref to detect outside clicks
// //   const [tracks, setTracks] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [playlists, setPlaylists] = useState([]);
// //   const { setTrack, play } = useContext(PlayerContext);
// //   const [albumDetails, setAlbumDetails] = useState(null);
// //   const [hoveredTrackId, setHoveredTrackId] = useState(null);
// //   const [showPlaylistMenu, setShowPlaylistMenu] = useState(null); // Track which menu is open
// //   const [playingTrackId, setPlayingTrackId] = useState(null); // Track currently playing

// //   useEffect(() => {
// //     // Fetch album details and tracks
// //     const fetchAlbumDetails = async () => {
// //       try {
// //         // Fetch album details
// //         const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         setAlbumDetails(albumResponse.data);
// //         // Fetch album tracks
// //         const trackResponse = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         setTracks(trackResponse.data.items); // Store album tracks
// //       } catch (error) {
// //         setError('Error fetching album details or tracks: ' + error.response?.data?.error?.message);
// //         console.error('Error fetching album details or tracks:', error);
// //       }
// //     };

// //     // Fetch user's playlists
// //     const fetchPlaylists = async () => {
// //       try {
// //         const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         setPlaylists(playlistResponse.data.items); // Store user playlists
// //       } catch (error) {
// //         console.error('Error fetching playlists:', error);
// //       }
// //     };

// //     if (token && id) {
// //       fetchAlbumDetails();
// //       fetchPlaylists();
// //     }
// //   }, [id, token]);

// //   // Handle track click to play it in the player
// //   const handleTrackClick = (track) => {
// //     const trackInfo = {
// //       name: track.name,
// //       artists: track.artists.map(artist => artist.name).join(', '),
// //       previewUrl: track.preview_url,
// //       image: albumDetails.images[0].url,
// //       desc: track.artists.map(artist => artist.name).join(', '),
// //     };
// //     setTrack(trackInfo); // Set track in PlayerContext
// //     play();
// //     setPlayingTrackId(track.id);
// //   };

// //   // Handle adding a track to a playlist
// //   const addToPlaylist = async (track, playlistId) => {
// //     try {
// //       await axios.post(
// //         `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
// //         {
// //           uris: [track.uri], // Spotify uses track URI
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );
// //       setShowPlaylistMenu(null); // Close the menu after adding to playlist
// //       alert(`${track.name} added to playlist!`);
// //     } catch (error) {
// //       console.error('Error adding track to playlist:', error);
// //       alert('Error adding track to playlist.');
// //     }
// //   };

// //   const handleClickOutside = (event) => {
// //     if (menuRef.current && !menuRef.current.contains(event.target)) {
// //       setShowPlaylistMenu(null); // Close the menu if clicking outside
// //     }
// //   };

// //   useEffect(() => {
// //     if (showPlaylistMenu) {
// //       document.addEventListener('mousedown', handleClickOutside);
// //     } else {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     }
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [showPlaylistMenu]);

// //   return (
// //     <>
// //       <Navbar handleLogout={handleLogout} />
// //       <div className="my-5">
// //         {/* Display album details (name, image) */}
// //         {albumDetails ? (
// //           <div className="album-details mb-6">
// //             <div className="flex items-center">
// //               <img
// //                 src={albumDetails.images[0].url}
// //                 alt={albumDetails.name}
// //                 className="w-40 h-40 object-cover rounded mr-4"
// //               />
// //               <div>
// //                 <h2 className="text-3xl font-bold">{albumDetails.name}</h2>
// //                 <p className="text-lg text-gray-400">
// //                   {albumDetails.artists.map(artist => artist.name).join(', ')}
// //                 </p>
// //                 <p className="text-gray-500 mt-2">Release Date: {albumDetails.release_date}</p>
// //               </div>
// //             </div>
// //           </div>
// //         ) : (
// //           <p>{error || 'Loading album details...'}</p>
// //         )}

// //         {/* Display Tracks */}
// //         <div className="track-list">
// //           <h3 className="text-2xl font-semibold mb-4">Tracks</h3>
// //           {tracks.length > 0 ? (
// //             <ul>
// //               {tracks.map((track) => (
// //                 <li
// //                   key={track.id}
// //                   className={`bg-[#1a1a1a] p-4 rounded mb-2 flex justify-between items-center relative cursor-pointer ${playingTrackId === track.id ? 'bg-gray-700' : ''}`} // Highlight currently playing track
// //                   onMouseEnter={() => setHoveredTrackId(track.id)} // Show dots on hover
// //                   onMouseLeave={() => setHoveredTrackId(null)}
// //                   onClick={() => handleTrackClick(track)}
// //                 >
// //                   <div>
// //                     <p className="text-xl font-semibold">{track.name}</p>
// //                     <p className="text-sm text-gray-400">
// //                       {track.artists.map((artist) => artist.name).join(', ')}
// //                     </p>
// //                   </div>

// //                   {/* Show three dots when hovered */}
// //                   {hoveredTrackId === track.id && (
// //                     <div className="absolute right-4 flex items-center space-x-2">
// //                       <button
// //                         className="text-gray-800 hover:text-white"
// //                         onClick={() => setShowPlaylistMenu(track.id)}
// //                       >
// //                         <FaEllipsisH className="text-lg" />
// //                       </button>
// //                     </div>
// //                   )}

// //                   {/* Show playlist options when dots are clicked */}
// //                   {showPlaylistMenu === track.id && (
// //                     <div className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2"
// //                     ref={menuRef} // Attach ref to detect outside clicks
// //                     >
// //                       <p className="text-white font-semibold mb-2">Add to playlist</p>
// //                       {playlists.length > 0 ? (
// //                         <ul>
// //                           {playlists.map((playlist) => (
// //                             <li
// //                               key={playlist.id}
// //                               className="text-gray-400 hover:text-white cursor-pointer"
// //                               onClick={() => addToPlaylist(track, playlist.id)}
// //                             >
// //                               {playlist.name}
// //                             </li>
// //                           ))}
// //                         </ul>
// //                       ) : (
// //                         <p className="text-gray-400">No playlists available</p>
// //                       )}
// //                     </div>
// //                   )}
// //                 </li>
// //               ))}
// //             </ul>
// //           ) : (
// //             <p>{error || 'No tracks found'}</p>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default DisplayAlbum;
