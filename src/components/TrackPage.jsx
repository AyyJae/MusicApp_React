import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { PlayerContext } from '../context/PlayerContext';
import { FaEllipsisH } from 'react-icons/fa';

const TrackPage = ({ token, handleLogout }) => {
  const menuRef = useRef(null); // Reference for the menu
  const { trackId } = useParams(); 
  const [playlists, setPlaylists] = useState([]); // State for playlists
  const { setTrack, play } = useContext(PlayerContext);
  const [trackDetails, setTrackDetails] = useState(null);
  const [notification, setNotification] = useState(null); 
  const [hoveredTrackId, setHoveredTrackId] = useState(null); 
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null); 

  // Fetch track details
  useEffect(() => {
    const fetchTrackDetails = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrackDetails(response.data); // Store the track details
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(playlistResponse.data.items); // Fetch and store playlists
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    if (token && trackId) {
      fetchTrackDetails(); // Fetch track data if the token and track ID exist
      fetchPlaylists(); // Fetch the user's playlists
    }
  }, [trackId, token]);

  // Handle playing the track
  const handlePlayTrack = () => {
    const trackInfo = {
      name: trackDetails.name,
      artists: trackDetails.artists.map((artist) => artist.name).join(', '),
      previewUrl: trackDetails.preview_url,
      image: trackDetails.album.images[0]?.url,
      desc: trackDetails.artists.map((artist) => artist.name).join(', '),
    };

    if (trackDetails.preview_url) {
      setTrack(trackInfo); // Set the track in PlayerContext
      play(); // Start playing the track
    } else {
      alert("This track doesn't have a preview available.");
    }
  };

  // Handle adding to a playlist
  const addToPlaylist = async (track, playlistId) => {
    try {
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
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      setNotification({ message: 'Failed to add track to playlist.', type: 'error' });
    }

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 1000);

    setShowPlaylistMenu(null); // Close the playlist menu
  };

  // Close menu on click outside
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

      {/* Notification at top-right corner */}
      {notification && <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{notification.message}</div>}

      <div className="track-page">
      {trackDetails ? (
        <div
          key={trackDetails.id}
          className="flex items-center justify-between w-full py-4 cursor-pointer border-b border-gray-200"
          onMouseEnter={() => setHoveredTrackId(trackDetails.id)}
          onMouseLeave={() => setHoveredTrackId(null)}
        >
          <div onClick={handlePlayTrack}>
            <p className="text-xl font-semibold">{trackDetails.name}</p>
            <p className="text-sm text-gray-400">
              {trackDetails.artists.map((artist) => artist.name).join(', ')}
            </p>
          </div>

          {/* Three dots on hover */}
          {hoveredTrackId === trackDetails.id && (
            <div className="relative">
              <button
                className="text-gray-500 hover:text-white"
                onClick={() => setShowPlaylistMenu(trackDetails.id)}
              >
                <FaEllipsisH className="text-lg" />
              </button>

              {/* Dropdown Menu */}
              {showPlaylistMenu === trackDetails.id && (
                <div
                  className="absolute right-0 bg-gray-600 rounded shadow-md p-2 mt-2 z-10"
                  ref={menuRef}
                >
                  <p className="text-white font-semibold mb-2">Add to playlist</p>
                  {playlists.length > 0 ? (
                    <ul>
                      {playlists.map((playlist) => (
                        <li
                          key={playlist.id}
                          className="text-gray-400 hover:text-white cursor-pointer"
                          onClick={() => addToPlaylist(trackDetails, playlist.id)}
                        >
                          {playlist.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No playlists available</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Loading track details...</p>
      )}
    </div>




{/* works */}
      {/* <div className="track-page">
        {trackDetails ? (
          <div className="relative group">
            {' '} */}
            {/* /* Added group for hover control */ }
             {/* <img src={trackDetails.album.images[0]?.url} alt={trackDetails.name} className="w-40 h-40 mt-4" /> */}
            {/* <div key={trackDetails.id} className="mt-3 cursor-pointer">
              <div onClick={handlePlayTrack}>
                <p className="text-xl font-semibold">{trackDetails.name}</p>
                <p className="text-sm text-gray-400">{trackDetails.artists.map((artist) => artist.name).join(', ')}</p>
              </div> */}

              {/* /* Ellipsis menu shown on hover */}
              {/* <div className="absolute right-4 top-4 hidden group-hover:flex items-center space-x-2">
                <button className="text-gray-400 hover:text-white" onClick={() => setShowPlaylistMenu(trackDetails.id)}>
                  <FaEllipsisH className="text-lg" />
                </button>
              </div> */}

              {/* {showPlaylistMenu === trackDetails.id && (
                <div className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2" ref={menuRef}>
                  <p className="text-white font-semibold mb-2">Add to playlist</p>
                  {playlists.length > 0 ? (
                    <ul>
                      {playlists.map((playlist) => (
                        <li key={playlist.id} className="text-gray-400 hover:text-white cursor-pointer" onClick={() => addToPlaylist(trackDetails, playlist.id)}>
                          {playlist.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No playlists available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Loading track details...</p>
        )}
      </div> */}



      {/* <div className="track-page">
        {trackDetails ? (
          <div className="relative">
            <img src={trackDetails.album.images[0]?.url} alt={trackDetails.name} className="w-40 h-40 mt-5" />

            <div key={trackDetails.id} className="mt-3 cursor-pointer" onMouseEnter={() => setHoveredTrackId(trackDetails.id)} onMouseLeave={() => setHoveredTrackId(null)}>
              <div onClick={() => handleTrackClick()}>
                <p className="text-xl font-semibold">{trackDetails.name}</p>
                <p className="text-sm text-gray-400">{trackDetails.artists.map((artist) => artist.name).join(', ')}</p>
              </div>

              {hoveredTrackId === trackDetails.id && (
                <div className="absolute right-4 top-4 flex items-center space-x-2">
                  <button className="text-gray-800 hover:text-white" onClick={() => setShowPlaylistMenu(trackDetails.id)}>
                    <FaEllipsisH className="text-lg" />
                  </button>
                </div>
              )}

              {showPlaylistMenu === trackDetails.id && (
                <div className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2" ref={menuRef}>
                  <p className="text-white font-semibold mb-2">Add to playlist</p>
                  {playlists.length > 0 ? (
                    <ul>
                      {playlists.map((playlist) => (
                        <li key={playlist.id} className="text-gray-400 hover:text-white cursor-pointer" onClick={() => addToPlaylist(trackDetails, playlist.id)}>
                          {playlist.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No playlists available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Loading track details...</p>
        )}
      </div> */}


{/* not working */}
      {/* <div className="track-page">
        {trackDetails ? (
          <div         
          >
            <img
              src={trackDetails.album.images[0]?.url}
              alt={trackDetails.name}
              className="w-40 h-40 mt-4"
            />
            <div key={trackDetails.id} className="mt-3 cursor-pointer" onMouseEnter={() => setHoveredTrackId(trackDetails.id)}
            onMouseLeave={() => setHoveredTrackId(null)}> onClick={() => handlePlayTrack()}>
              <p className="text-xl font-semibold">{trackDetails.name}</p>
              <p className="text-sm text-gray-400">
                {trackDetails.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>

            {hoveredTrackId === trackDetails.id && (
              <div className="absolute right-4 top-4 flex items-center space-x-2">
                <button
                  className="text-gray-800 hover:text-white"
                  onClick={() => setShowPlaylistMenu(trackDetails.id)}
                >
                  <FaEllipsisH className="text-lg" />
                </button>
              </div>
            )}

            {showPlaylistMenu === trackDetails.id && (
              <div
                className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2"
                ref={menuRef}
              >
                <p className="text-white font-semibold mb-2">Add to playlist</p>
                {playlists.length > 0 ? (
                  <ul>
                    {playlists.map((playlist) => (
                      <li
                        key={playlist.id}
                        className="text-gray-400 hover:text-white cursor-pointer"
                        onClick={() => addToPlaylist(trackDetails, playlist.id)}
                      >
                        {playlist.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No playlists available</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>Loading track details...</p>
        )}
      </div> */}
    </>
  );
};

export default TrackPage;

///hover not working
// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from './Navbar';
// import { PlayerContext } from '../context/PlayerContext';
// import { FaEllipsisH } from 'react-icons/fa';

// const TrackPage = ({ token, handleLogout }) => {
//   const { trackId } = useParams(); // Get track ID from the URL
//   const [trackDetails, setTrackDetails] = useState(null);
//   const { setTrack, play } = useContext(PlayerContext);
//   const [playlists, setPlaylists] = useState([]); // State for playlists
//   const [hoveredTrackId, setHoveredTrackId] = useState(null);
//   const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const menuRef = useRef(null); // Reference for the menu

//   // Fetch track details
//   useEffect(() => {
//     const fetchTrackDetails = async () => {
//       try {
//         const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setTrackDetails(response.data); // Store the track details
//       } catch (error) {
//         console.error('Error fetching track details:', error);
//       }
//     };

//     const fetchPlaylists = async () => {
//       try {
//         const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setPlaylists(playlistResponse.data.items); // Fetch and store playlists
//       } catch (error) {
//         console.error('Error fetching playlists:', error);
//       }
//     };

//     if (token && trackId) {
//       fetchTrackDetails(); // Fetch track data if the token and track ID exist
//       fetchPlaylists(); // Fetch the user's playlists
//     }
//   }, [trackId, token]);

//   // Handle playing the track
//   const handlePlayTrack = () => {
//     const trackInfo = {
//       name: trackDetails.name,
//       artists: trackDetails.artists.map((artist) => artist.name).join(', '),
//       previewUrl: trackDetails.preview_url,
//       image: trackDetails.album.images[0]?.url,
//       desc: trackDetails.artists.map((artist) => artist.name).join(', '),
//     };

//     if (trackDetails.preview_url) {
//       setTrack(trackInfo); // Set the track in PlayerContext
//       play(); // Start playing the track
//     } else {
//       alert("This track doesn't have a preview available.");
//     }
//   };

//   // Handle adding to a playlist
//   const addToPlaylist = async (track, playlistId) => {
//     try {
//       await axios.post(
//         `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//         { uris: [track.uri] },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       setNotification({ message: `${track.name} added to playlist!`, type: 'success' });
//     } catch (error) {
//       console.error('Error adding track to playlist:', error);
//       setNotification({ message: 'Failed to add track to playlist.', type: 'error' });
//     }

//     // Hide notification after 3 seconds
//     setTimeout(() => {
//       setNotification(null);
//     }, 3000);

//     setShowPlaylistMenu(null); // Close the playlist menu
//   };

//   // Close menu on click outside
//   const handleClickOutside = (event) => {
//     if (menuRef.current && !menuRef.current.contains(event.target)) {
//       setShowPlaylistMenu(null);
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
//       <Navbar token={token} handleLogout={handleLogout} />

//       {/* Notification at top-right corner */}
//       {notification && (
//         <div
//           className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg text-white ${
//             notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//           }`}
//         >
//           {notification.message}
//         </div>
//       )}

//       <div className="track-page">
//         {trackDetails ? (
//           <div
//             className="relative"
//             onMouseEnter={() => setHoveredTrackId(trackDetails.id)}
//             onMouseLeave={() => setHoveredTrackId(null)}
//           >
//             <img
//               src={trackDetails.album.images[0]?.url}
//               alt={trackDetails.name}
//               className="w-40 h-40 mt-5"
//             />
//             <div className="mt-4 cursor-pointer" onClick={() => handlePlayTrack()}>
//               <p className="text-xl font-semibold">{trackDetails.name}</p>
//               <p className="text-sm text-gray-400">
//                 {trackDetails.artists.map((artist) => artist.name).join(', ')}
//               </p>
//             </div>

//             {hoveredTrackId === trackDetails.id && (
//               <div className="absolute right-4 top-4 flex items-center space-x-2">
//                 <button
//                   className="text-gray-800 hover:text-white"
//                   onClick={() => setShowPlaylistMenu(trackDetails.id)}
//                 >
//                   <FaEllipsisH className="text-lg" />
//                 </button>
//               </div>
//             )}

//             {showPlaylistMenu === trackDetails.id && (
//               <div
//                 className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2"
//                 ref={menuRef}
//               >
//                 <p className="text-white font-semibold mb-2">Add to playlist</p>
//                 {playlists.length > 0 ? (
//                   <ul>
//                     {playlists.map((playlist) => (
//                       <li
//                         key={playlist.id}
//                         className="text-gray-400 hover:text-white cursor-pointer"
//                         onClick={() => addToPlaylist(trackDetails, playlist.id)}
//                       >
//                         {playlist.name}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-400">No playlists available</p>
//                 )}
//               </div>
//             )}
//           </div>
//         ) : (
//           <p>Loading track details...</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default TrackPage;

///without adding track to playlist
// const TrackPage = ({ token, handleLogout }) => {
//   const { trackId } = useParams(); // Get track ID from the URL
//   const [trackDetails, setTrackDetails] = useState(null);
//   const { setTrack, play } = useContext(PlayerContext);
//   // const [notification, setNotification] = useState(null); // State for notifications
//   const [hoveredTrackId, setHoveredTrackId] = useState(null);
//   const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);

//   useEffect(() => {
//     // Fetch track details
//     const fetchTrackDetails = async () => {
//       try {
//         const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setTrackDetails(response.data); // Store the track details
//       } catch (error) {
//         console.error('Error fetching track details:', error);
//       }
//     };

//     if (token && trackId) {
//       fetchTrackDetails(); // Fetch data if the token and track ID exist
//     }
//   }, [trackId, token]);

//   // Handle playing the track
//   const handlePlayTrack = () => {
//     const trackInfo = {
//       name: trackDetails.name,
//       artists: trackDetails.artists.map((artist) => artist.name).join(', '),
//       previewUrl: trackDetails.preview_url,
//       image: trackDetails.album.images[0]?.url,
//       desc: trackDetails.artists.map((artist) => artist.name).join(', '),
//     };

//     if (trackDetails.preview_url) {
//       setTrack(trackInfo); // Set the track in PlayerContext
//       play(); // Start playing the track
//     } else {
//       alert("This track doesn't have a preview available.");
//     }
//   };

//   const addToPlaylist = async (track, playlistId) => {
//     try {
//       // Check if the track is already in the playlist
//       const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const trackExists = playlistResponse.data.items.some((item) => item.track.id === track.id);

//       if (trackExists) {
//         setNotification({ message: 'Track already exists in this playlist.', type: 'duplicate' });
//         setShowPlaylistMenu(null);
//         setTimeout(() => setNotification(null), 1000);
//         return;
//       }

//       await axios.post(
//         `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//         { uris: [track.uri] },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       setNotification({ message: `${track.name} added to playlist!`, type: 'success' });
//       setShowPlaylistMenu(null);
//       setTimeout(() => setNotification(null), 1000);
//     } catch (error) {
//       console.error('Error adding track to playlist:', error);
//       setNotification({ message: 'Failed to add track to playlist.', type: 'error' });
//       setTimeout(() => setNotification(null), 1000);
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (menuRef.current && !menuRef.current.contains(event.target)) {
//       setShowPlaylistMenu(null);
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
//       <Navbar token={token} handleLogout={handleLogout} />
//       <div className="track-page">
//         {trackDetails ? (
//           <>
//             <img src={trackDetails.album.images[0]?.url} alt={trackDetails.name} className="w-40 h-40 mt-4" />
//             <div className="mt-3 cursor-pointer" onClick={() => handlePlayTrack()}>
//               <p className="text-xl font-semibold">{trackDetails.name}</p>
//               <p className="text-sm text-gray-400">{trackDetails.artists.map((artist) => artist.name).join(', ')}</p>
//             </div>
//             {hoveredTrackId === trackDetails.id && (
//               <div className="absolute right-4 flex items-center space-x-2">
//                 <button className="text-gray-800 hover:text-white" onClick={() => setShowPlaylistMenu(trackDetails.id)}>
//                   <FaEllipsisH className="text-lg" />
//                 </button>
//               </div>
//             )}

//             {showPlaylistMenu === trackDetails.id && (
//               <div className="absolute right-8 bg-gray-900 rounded shadow-md p-2 mt-2" ref={menuRef}>
//                 <p className="text-white font-semibold mb-2">Add to playlist</p>
//                 {playlists.length > 0 ? (
//                   <ul>
//                     {playlists.map((playlist) => (
//                       <li key={playlist.id} className="text-gray-400 hover:text-white cursor-pointer" onClick={() => addToPlaylist(track, playlist.id)}>
//                         {playlist.name}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-gray-400">No playlists available</p>
//                 )}
//               </div>
//             )}

//             {/* <h2>{trackDetails.name}</h2>
//           <p>{trackDetails.artists.map((artist) => artist.name).join(', ')}</p> */}

//           </>
//         ) : (
//           <p>Loading track details...</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default TrackPage;
