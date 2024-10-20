import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { FaEllipsisH } from 'react-icons/fa';
import PlaylistModal from './PlaylistModal';
import NotificationComponent from './NotificationComponent';

const DisplayHome = ({ token, handleLogout }) => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [noTracksModal, setNoTracksModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchAlbumsAndPlaylists = async () => {
    try {
      const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlbums(albumResponse.data.items);

      const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaylists(playlistResponse.data.items);
    } catch (error) {
      setError('Error fetching albums or playlists: ' + error.response?.data?.error?.message);
      console.error('Error fetching albums or playlists:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAlbumsAndPlaylists();
    }
  }, [token]);

  const handleAlbumClick = (albumId) => {
    navigate(`/album/${albumId}`);
  };

  const handlePlaylistClick = async (playlistId) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const trackCount = response.data.tracks.total;
      if (trackCount === 0) {
        setModalMessage('No tracks added yet.');
        setNoTracksModal(true);
        setTimeout(() => setNoTracksModal(false), 1000);
      } else {
        navigate(`/playlist/${playlistId}`);
      }
    } catch (error) {
      console.error('Error fetching playlist details:', error);
      setError('Error fetching playlist details.');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId));
      setDropdownOpenId(null);
    } catch (error) {
      setError('Error deleting playlist: ' + error.response?.data?.error?.message);
    }
  };

  const handleThreeDotsClick = (playlistId) => {
    setDropdownOpenId(dropdownOpenId === playlistId ? null : playlistId);
  };

  // const handlePlaylistCreated = () => {
  //   fetchAlbumsAndPlaylists(); // Refresh playlists after creating a new one
  //   setNotification({ message: `Playlist "${newPlaylist.name}" created successfully!`, type: 'success' });
  // };

  const handlePlaylistCreated = (newPlaylist) => {
    console.log('New Playlist Data:', newPlaylist);
    setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
    setNotification({ message: `Playlist "${newPlaylist.name}" created successfully!`, type: 'success' });
    setModalOpen(false); // Close the modal
  };

  const handleError = (errorMessage) => {
    setNotification({ message: errorMessage, type: 'error' });
  };

  return (
    <>
      <Navbar token={token} handleLogout={handleLogout} />

      <NotificationComponent message={notification.message} type={notification.type} />

      <div className="my-5 font-bold text-2xl">Your Albums</div>

      <div className="my-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {albums.length > 0 ? (
            albums.map((album) => (
              <div key={album.album.id} className="bg-[#1a1a1a] p-4 rounded cursor-pointer relative" onClick={() => handleAlbumClick(album.album.id)}>
                <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
                <p className="mt-2">{album.album.name}</p>
                <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
              </div>
            ))
          ) : (
            <p>No albums found</p>
          )}
        </div>
      </div>

      <div className="my-5 font-bold text-2xl">Your Playlists</div>
      <div className="my-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div key={playlist.id} className="bg-[#1a1a1a] p-4 rounded relative cursor-pointer" onMouseEnter={() => setHoveredPlaylistId(playlist.id)} onMouseLeave={() => setHoveredPlaylistId(null)} onClick={() => handlePlaylistClick(playlist.id)}>
                {playlist?.images?.length > 0 ? (
                  <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-40 object-cover rounded" />
                ) : (
                  // <img src={assets.no-image_icon} alt="Default Playlist" className="w-full h-40 object-cover rounded" />
                  <div className="w-full h-40 bg-gray-400 rounded flex items-center justify-center">
                    <p>No Image Available</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-2">
                  <p>{playlist.name}</p>

                  {hoveredPlaylistId === playlist.id && (
                    <FaEllipsisH
                      className="text-gray-400 cursor-pointer hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThreeDotsClick(playlist.id);
                      }}
                    />
                  )}
                </div>

                {dropdownOpenId === playlist.id && (
                  <div className="absolute top-10 right-2 bg-black text-white p-2 rounded shadow-lg z-50">
                    <button className="text-white hover:text-gray-400" onClick={() => handleDeletePlaylist(playlist.id)}>
                      Delete Playlist
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No playlists found</p>
          )}
        </div>
      </div>

      {noTracksModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-500 p-4 rounded shadow-lg">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <PlaylistModal
          token={token}
          closeModal={() => setModalOpen(false)}
          onPlaylistCreated={handlePlaylistCreated} // Pass handler to update state
          onError={handleError}
        />
      )}
    </>
  );
};

export default DisplayHome;

//OLD
// const DisplayHome = ({ token, handleLogout }) => {
//   const navigate = useNavigate();
//   const [albums, setAlbums] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null); // Track hovered playlist
//   const [dropdownOpenId, setDropdownOpenId] = useState(null); // Track which playlist's menu is open
//   const [error, setError] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [noTracksModal, setNoTracksModal] = useState(false); // Modal for "No tracks"
//   const [modalMessage, setModalMessage] = useState(''); // Modal message

//   // Fetch Albums and Playlists when the component mounts
//   const fetchAlbumsAndPlaylists = async () => {
//     try {
//       const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAlbums(albumResponse.data.items);

//       const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlistResponse.data.items);
//     } catch (error) {
//       setError('Error fetching albums or playlists: ' + error.response?.data?.error?.message);
//       console.error('Error fetching albums or playlists:', error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchAlbumsAndPlaylists();
//     }
//   }, [token]);

//   const handleAlbumClick = (albumId) => {
//     navigate(`/album/${albumId}`);
//   };

//   const handlePlaylistClick = async (playlistId) => {
//     try {
//       // Fetch the playlist details to check the number of tracks
//       const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const trackCount = response.data.tracks.total;
//       if (trackCount === 0) {
//         setModalMessage('No tracks added yet.');
//         setNoTracksModal(true);

//         setTimeout(() => {
//           setNoTracksModal(false);
//         }, 1000);
//       } else {
//         // If there are tracks, navigate to the playlist page
//         navigate(`/playlist/${playlistId}`);
//       }
//     } catch (error) {
//       console.error('Error fetching playlist details:', error);
//       setError('Error fetching playlist details.');
//     }
//   };

//   const handleDeletePlaylist = async (playlistId) => {
//     try {
//       await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId)); // Remove deleted playlist
//       setDropdownOpenId(null); // Close the dropdown
//     } catch (error) {
//       setError('Error deleting playlist: ' + error.response?.data?.error?.message);
//     }
//   };

//   const handleThreeDotsClick = (playlistId) => {
//     setDropdownOpenId(dropdownOpenId === playlistId ? null : playlistId); // Toggle dropdown menu
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="my-5 font-bold text-2xl">Your Albums</div>

//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {albums.length > 0 ? (
//             albums.map((album) => (
//               <div key={album.album.id} className="bg-[#1a1a1a] p-4 rounded cursor-pointer relative" onClick={() => handleAlbumClick(album.album.id)}>
//                 <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
//                 <p className="mt-2">{album.album.name}</p>
//                 <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No albums found</p>
//           )}
//         </div>
//       </div>

//       <div className="my-5 font-bold text-2xl">Your Playlists</div>
//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {playlists.length > 0 ? (
//             playlists.map((playlist) => (
//               <div
//                 key={playlist.id}
//                 className="bg-[#1a1a1a] p-4 rounded relative cursor-pointer"
//                 onMouseEnter={() => setHoveredPlaylistId(playlist.id)}
//                 onMouseLeave={() => setHoveredPlaylistId(null)}
//                 onClick={() => handlePlaylistClick(playlist.id)} // Check playlist tracks here
//               >
//                 {playlist?.images?.length > 0 ? (
//                   <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-40 object-cover rounded" />
//                 ) : (
//                   <div className="w-full h-40 bg-gray-400 rounded flex items-center justify-center">
//                     <p>No Image Available</p>
//                   </div>
//                 )}

//                 {/* Playlist name */}
//                 <div className="flex justify-between items-center mt-2">
//                   <p>{playlist.name}</p>

//                   {/* Conditionally show three dots on hover */}
//                   {hoveredPlaylistId === playlist.id && (
//                     <FaEllipsisH
//                       className="text-gray-400 cursor-pointer hover:text-white"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleThreeDotsClick(playlist.id);
//                       }}
//                     />
//                   )}
//                 </div>

//                 {/* Show dropdown menu when clicked */}
//                 {dropdownOpenId === playlist.id && (
//                   <div className="absolute top-10 right-2 bg-black text-white p-2 rounded shadow-lg z-50">
//                     <button className="text-white hover:text-gray-400" onClick={() => handleDeletePlaylist(playlist.id)}>
//                       Delete Playlist
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No playlists found</p>
//           )}
//         </div>
//       </div>

//       {/* Modal for "No tracks added yet" */}
//       {noTracksModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-gray-400 p-5 rounded shadow-lg">
//             <p>{modalMessage}</p>
//           </div>
//         </div>
//       )}

//       {isModalOpen && <PlaylistModal token={token} closeModal={() => setModalOpen(false)}  existingPlaylists={playlists} />}
//     </>
//   );
// };

// export default DisplayHome;

// const DisplayHome = ({ token, handleLogout }) => {
//   const navigate = useNavigate();
//   const [albums, setAlbums] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null); // Track hovered playlist
//   const [dropdownOpenId, setDropdownOpenId] = useState(null); // Track which playlist's menu is open
//   const [error, setError] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);

//   // Fetch Albums and Playlists when the component mounts
//   const fetchAlbumsAndPlaylists = async () => {
//     try {
//       const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAlbums(albumResponse.data.items);

//       const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlistResponse.data.items);
//     } catch (error) {
//       setError('Error fetching albums or playlists: ' + error.response?.data?.error?.message);
//       console.error('Error fetching albums or playlists:', error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchAlbumsAndPlaylists();
//     }
//   }, [token]);

//   const handleAlbumClick = (albumId) => {
//     navigate(`/album/${albumId}`);
//   };

//   const handlePlaylistClick = (playlistId) => {
//     navigate(`/playlist/${playlistId}`);
//   };

//   const handleDeletePlaylist = async (playlistId) => {
//     try {
//       await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId)); // Remove deleted playlist
//       setDropdownOpenId(null); // Close the dropdown
//     } catch (error) {
//       setError('Error deleting playlist: ' + error.response?.data?.error?.message);
//     }
//   };

//   const handleThreeDotsClick = (playlistId) => {
//     setDropdownOpenId(dropdownOpenId === playlistId ? null : playlistId); // Toggle dropdown menu
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="my-5 font-bold text-2xl">Your Albums</div>

//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {albums.length > 0 ? (
//             albums.map((album) => (
//               <div
//                 key={album.album.id}
//                 className="bg-[#1a1a1a] p-4 rounded cursor-pointer relative"
//                 onClick={() => handleAlbumClick(album.album.id)}
//               >
//                 <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
//                 <p className="mt-2">{album.album.name}</p>
//                 <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No albums found</p>
//           )}
//         </div>
//       </div>

//       <div className="my-5 font-bold text-2xl">Your Playlists</div>
//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {playlists.length > 0 ? (
//             playlists.map((playlist) => (
//               <div
//                 key={playlist.id}
//                 className="bg-[#1a1a1a] p-4 rounded relative cursor-pointer"
//                 onClick={() => handlePlaylistClick(playlist.id)}
//                 onMouseEnter={() => setHoveredPlaylistId(playlist.id)}
//                 onMouseLeave={() => setHoveredPlaylistId(null)}
//               >
//                 {playlist?.images?.length > 0 ? (
//                   <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-40 object-cover rounded" />
//                 ) : (
//                   <div className="w-full h-40 bg-gray-300 rounded flex items-center justify-center">
//                     <p>No Image Available</p>
//                   </div>
//                 )}

//                 {/* Playlist name and three dots beside it */}
//                 <div className="flex justify-between items-center mt-2">
//                   <p>{playlist.name}</p>

//                   {/* Show three dots beside the playlist name */}
//                   {hoveredPlaylistId === playlist.id && (
//                   <FaEllipsisH
//                     className="text-gray-400 cursor-pointer hover:text-white"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleThreeDotsClick(playlist.id);
//                     }}
//                   />
//                   )}
//                 </div>

//                 {/* Show dropdown menu when clicked */}
//                 {dropdownOpenId === playlist.id && (
//                   <div className="absolute top-10 right-2 bg-black text-white p-2 rounded shadow-lg z-50">
//                     <button
//                       className="text-white hover:text-gray-400"
//                       onClick={() => handleDeletePlaylist(playlist.id)}
//                     >
//                       Delete Playlist
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No playlists found</p>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <PlaylistModal
//           token={token}
//           closeModal={() => setModalOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default DisplayHome;

// const DisplayHome = ({ token, handleLogout }) => {
//   const navigate = useNavigate();
//   const [albums, setAlbums] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null); // Track hovered playlist
//   const [dropdownOpenId, setDropdownOpenId] = useState(null); // Track which playlist's menu is open
//   const [error, setError] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);

//   // Fetch Albums and Playlists when the component mounts
//   const fetchAlbumsAndPlaylists = async () => {
//     try {
//       const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAlbums(albumResponse.data.items);

//       const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlistResponse.data.items);
//     } catch (error) {
//       setError('Error fetching albums or playlists: ' + error.response?.data?.error?.message);
//       console.error('Error fetching albums or playlists:', error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchAlbumsAndPlaylists();
//     }
//   }, [token]);

//   const handleAlbumClick = (albumId) => {
//     navigate(`/album/${albumId}`);
//   };

//   const handlePlaylistClick = (playlistId) => {
//     navigate(`/playlist/${playlistId}`);
//   };

//   const handleDeletePlaylist = async (playlistId) => {
//     try {
//       await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId)); // Remove deleted playlist
//       setDropdownOpenId(null); // Close the dropdown
//     } catch (error) {
//       setError('Error deleting playlist: ' + error.response?.data?.error?.message);
//     }
//   };

//   const handleThreeDotsClick = (playlistId) => {
//     setDropdownOpenId(dropdownOpenId === playlistId ? null : playlistId); // Toggle dropdown menu
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="my-5 font-bold text-2xl">Your Albums</div>

//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {albums.length > 0 ? (
//             albums.map((album) => (
//               <div
//                 key={album.album.id}
//                 className="bg-[#1a1a1a] p-4 rounded cursor-pointer relative"
//                 onClick={() => handleAlbumClick(album.album.id)}
//               >
//                 <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
//                 <p className="mt-2">{album.album.name}</p>
//                 <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No albums found</p>
//           )}
//         </div>
//       </div>

//       <div className="my-5 font-bold text-2xl">Your Playlists</div>
//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {playlists.length > 0 ? (
//             playlists.map((playlist) => (
//               <div
//                 key={playlist.id}
//                 className="bg-[#1a1a1a] p-4 rounded relative cursor-pointer"
//                 onClick={() => handlePlaylistClick(playlist.id)}
//                 onMouseEnter={() => setHoveredPlaylistId(playlist.id)}
//                 onMouseLeave={() => setHoveredPlaylistId(null)}
//               >
//                 {playlist?.images?.length > 0 ? (
//                   <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-40 object-cover rounded" />
//                 ) : (
//                   <div className="w-full h-40 bg-gray-300 rounded flex items-center justify-center">
//                     <p>No Image Available</p>
//                   </div>
//                 )}
//                 <p className="mt-2">{playlist.name}</p>

//                 {/* Show three dots on hover */}
//                 {hoveredPlaylistId === playlist.id && (
//                   <FaEllipsisH
//                     className="absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-white"
//                     onClick={() => handleThreeDotsClick(playlist.id)}
//                   />
//                 )}

//                 {/* Show dropdown menu when clicked */}
//                 {dropdownOpenId === playlist.id && (
//                   <div className="absolute top-10 right-2 bg-black text-white p-2 rounded shadow-lg z-50">
//                     <button
//                       className="text-red-500 hover:text-red-700"
//                       onClick={() => handleDeletePlaylist(playlist.id)}
//                     >
//                       Delete Playlist
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No playlists found</p>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <PlaylistModal
//           token={token}
//           closeModal={() => setModalOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default DisplayHome;

// const DisplayHome = ({ token, handleLogout }) => {
//   const navigate = useNavigate();
//   const [albums, setAlbums] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null); // Track the hovered playlist
//   const [showOptionsId, setShowOptionsId] = useState(null); // Track which menu is open
//   const [error, setError] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);

//   // Fetch Albums and Playlists when the component mounts
//   const fetchAlbumsAndPlaylists = async () => {
//     try {
//       // Fetch user's albums
//       const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAlbums(albumResponse.data.items);

//       // Fetch user's playlists
//       const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlistResponse.data.items);
//     } catch (error) {
//       setError('Error fetching albums or playlists: ' + error.response?.data?.error?.message);
//       console.error('Error fetching albums or playlists:', error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchAlbumsAndPlaylists();
//     }
//   }, [token]);

//   const handleAlbumClick = (albumId) => {
//     navigate(`/album/${albumId}`);
//   };

//   const handlePlaylistClick = (playlistId) => {
//     navigate(`/playlist/${playlistId}`);
//   };

//   const handlePlaylistCreated = () => {
//     fetchAlbumsAndPlaylists(); // Refresh playlists after creating a new one
//   };

//   const handleDeletePlaylist = async (playlistId) => {
//     try {
//       await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlists.filter((playlist) => playlist.id !== playlistId)); // Remove the deleted playlist from the list
//       setShowOptionsId(null); // Close the options menu
//     } catch (error) {
//       console.error('Error deleting playlist:', error);
//       setError('Error deleting playlist: ' + error.response?.data?.error?.message);
//     }
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="my-5 font-bold text-2xl">Your Albums</div>

//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {albums.length > 0 ? (
//             albums.map((album) => (
//               <div key={album.album.id} className="bg-[#1a1a1a] p-4 rounded cursor-pointer" onClick={() => handleAlbumClick(album.album.id)}>
//                 <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
//                 <p className="mt-2">{album.album.name}</p>
//                 <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No albums found</p>
//           )}
//         </div>
//       </div>

//       <div className="my-5 font-bold text-2xl">Your Playlists</div>
//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {playlists.length > 0 ? (
//             playlists.map((playlist) => (
//               <div
//                 key={playlist.id}
//                 className="relative bg-[#1a1a1a] p-4 rounded cursor-pointer" onClick={() => handlePlaylistClick(playlist.id)}
//                 onMouseEnter={() => setHoveredPlaylistId(playlist.id)}
//                 onMouseLeave={() => setHoveredPlaylistId(null)}
//               >
//                 {playlist?.images?.length > 0 ? (
//                   <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-40 object-cover rounded" />
//                 ) : (
//                   <div className="w-full h-40 bg-gray-300 rounded flex items-center justify-center">
//                     <p>No Image Available</p>
//                   </div>
//                 )}
//                 <p className="mt-2">{playlist.name}</p>

//                 {/* Show three dots when hovered */}
//                 {hoveredPlaylistId === playlist.id && (
//                   <FaEllipsisH
//                     className="absolute top-4 right-4 text-gray-400 cursor-pointer"
//                     onClick={() => setShowOptionsId(playlist.id)}
//                   />
//                 )}

//                 {/* Show delete option when three dots are clicked */}
//                 {showOptionsId === playlist.id && (
//                   <div className="absolute top-10 right-4 bg-white text-black p-2 rounded shadow-lg">
//                     <button
//                       className="text-red-500 hover:text-red-700"
//                       onClick={() => handleDeletePlaylist(playlist.id)}
//                     >
//                       Delete Playlist
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p>No playlists found</p>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <PlaylistModal
//           token={token}
//           closeModal={() => setModalOpen(false)}
//           onPlaylistCreated={handlePlaylistCreated}
//         />
//       )}
//     </>
//   );
// };

// export default DisplayHome;

// const DisplayHome = ({ token, handleLogout }) => {
//   const navigate = useNavigate();
//   const [albums, setAlbums] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);

//   // Fetch Albums and Playlists when the component mounts
//   const fetchAlbumsAndPlaylists = async () => {
//     try {
//       // Fetch user's albums
//       const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setAlbums(albumResponse.data.items);

//       // Fetch user's playlists
//       const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setPlaylists(playlistResponse.data.items);
//     } catch (error) {
//       setError('Error fetching albums or playlists: ' + error.response?.data?.error?.message);
//       console.error('Error fetching albums or playlists:', error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchAlbumsAndPlaylists();
//     }
//   }, [token]);

//   const handleAlbumClick = (albumId) => {
//     navigate(`/album/${albumId}`);
//   };

//   const handlePlaylistClick = (playlistId) => {
//     navigate(`/playlist/${playlistId}`);
//   };

//   // Callback function to refresh playlists
//   const handlePlaylistCreated = () => {
//     fetchAlbumsAndPlaylists(); // Refresh playlists after creating a new one
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="my-5 font-bold text-2xl">Your Albums</div>

//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {albums.length > 0 ? (
//             albums.map((album) => (
//               <div key={album.album.id} className="bg-[#1a1a1a] p-4 rounded cursor-pointer" onClick={() => handleAlbumClick(album.album.id)}>
//                 <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
//                 <p className="mt-2">{album.album.name}</p>
//                 <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No albums found</p>
//           )}
//         </div>
//       </div>

//       <div className="my-5 font-bold text-2xl">Your Playlists</div>
//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {playlists.length > 0 ? (
//             playlists.map((playlist) => (
//               <div key={playlist.id} className="bg-[#1a1a1a] p-4 rounded cursor-pointer" onClick={() => handlePlaylistClick(playlist.id)}>
//                 {playlist?.images?.length > 0 ? (
//                   <img src={playlist.images[0].url} alt={playlist.name} className="w-full h-40 object-cover rounded" />
//                 ) : (
//                   <div className="w-full h-40 bg-gray-300 rounded flex items-center justify-center">
//                     <p>No Image Available</p>
//                   </div>
//                 )}
//                 {/* <img
//                   src={playlist.images[0]?.url || ''}
//                   alt={playlist.name}
//                   className="w-full h-40 object-cover rounded"
//                 /> */}
//                 <p className="mt-2">{playlist.name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No playlists found</p>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <PlaylistModal
//           token={token}
//           closeModal={() => setModalOpen(false)}
//           onPlaylistCreated={handlePlaylistCreated} // Pass the function correctly here
//         />
//       )}
//     </>
//   );
// };

// export default DisplayHome;

// const DisplayHome = ({ token, handleLogout }) => {
//   const navigate = useNavigate();
//   const [albums, setAlbums] = useState([]);
//   const [playlists, setPlaylists] = useState([]);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);

//   // Fetch Albums and Playlists when the component mounts
//   useEffect(() => {
//     const fetchAlbumsAndPlaylists = async () => {
//       try {
//         // Fetch user's albums
//         const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setAlbums(albumResponse.data.items);

//         // Fetch user's playlists
//         const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setPlaylists(playlistResponse.data.items);

//       } catch (error) {
//         setError('Error fetching albums or playlists: ' + error.response?.data?.error?.message);
//         console.error('Error fetching albums or playlists:', error);
//       }
//     };

//     if (token) {
//       fetchAlbumsAndPlaylists(); // Fetch data when the token is available
//     }
//   }, [token]);

//   // Handle album click
//   const handleAlbumClick = (albumId) => {
//     navigate(`/album/${albumId}`);
//   };

//   // Handle playlist click
//   const handlePlaylistClick = (playlistId) => {
//     navigate(`/playlist/${playlistId}`);
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="my-5 font-bold text-2xl">Your Albums</div>

//       {/* Display Albums */}
//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {albums.length > 0 ? (
//             albums.map((album) => (
//               <div
//                 key={album.album.id}
//                 className="bg-[#1a1a1a] p-4 rounded cursor-pointer"
//                 onClick={() => handleAlbumClick(album.album.id)}
//               >
//                 <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
//                 <p className="mt-2">{album.album.name}</p>
//                 <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No albums found</p>
//           )}
//         </div>
//       </div>

//       <div className="my-5 font-bold text-2xl">Your Playlists</div>
//       <div className="my-5">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {playlists.length > 0 ? (
//             playlists.map((playlist) => (
//               <div
//                 key={playlist.id}
//                 className="bg-[#1a1a1a] p-4 rounded cursor-pointer"
//                 onClick={() => handlePlaylistClick(playlist.id)}
//               >
//                 <img
//                   src={playlist.images[0]?.url || 'default_image_url'}
//                   alt={playlist.name}
//                   className="w-full h-40 object-cover rounded"
//                 />
//                 <p className="mt-2">{playlist.name}</p>
//               </div>
//             ))
//           ) : (
//             <p>No playlists found</p>
//           )}
//         </div>
//       </div>
//       {isModalOpen && (
//         <PlaylistModal
//           token={token}
//           closeModal={() => setModalOpen(false)}
//           onPlaylistCreated={handlePlaylistCreated} // Pass the function correctly here
//         />
//       )}
//     </>
//   );
// };

// export default DisplayHome;

// // const DisplayHome = ({ token, handleLogout }) => {
// //   const navigate = useNavigate();
// //   const [albums, setAlbums] = useState([]);
// //   const [error, setError] = useState(null);
// //   const [playlists, setPlaylists] = useState([]);

// //   // Fetch Albums when the component mounts
// //   useEffect(() => {
// //     const fetchAlbums = async () => {
// //       try {
// //         const albumResponse = await axios.get('https://api.spotify.com/v1/me/albums', {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         setAlbums(albumResponse.data.items);
// //       } catch (error) {
// //         setError('Error fetching albums: ' + error.response?.data?.error?.message);
// //         console.error('Error fetching albums:', error);
// //       }
// //     };

// //     const fetchPlaylists = async () => {
// //       try {
// //         const playlistResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         setPlaylists(playlistResponse.data.items);
// //       } catch (error) {
// //         setError('Error fetching playlists: ' + error.response?.data?.error?.message);
// //         console.error('Error fetching playlists:', error);
// //       }
// //     };

// //     if (token) {
// //       fetchAlbums();
// //       fetchPlaylists();
// //     }
// //   }, [token]);

// //   // Handle album click
// //   const handleAlbumClick = (albumId) => {
// //     navigate(`/album/${albumId}`);
// //   };

// //   const handlePlaylistClick = (playlistId) => {
// //     navigate(`/playlist/${playlistId}`);
// //   };

// //   return (
// //     <>
// //       <Navbar handleLogout={handleLogout} />
// //       <div className="my-5 font-bold text-2xl">Your Albums</div>

// //       {/* Display Albums */}
// //       <div className="my-5">
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //           {albums.length > 0 ? (
// //             albums.map((album) => (
// //               <div
// //                 key={album.album.id}
// //                 className="bg-[#1a1a1a] p-4 rounded cursor-pointer"
// //                 onClick={() => handleAlbumClick(album.album.id)} // Handle album click
// //               >
// //                 <img src={album.album.images[0].url} alt={album.album.name} className="w-full h-40 object-cover rounded" />
// //                 <p className="mt-2">{album.album.name}</p>
// //                 <p className="text-sm text-gray-400">{album.album.artists[0].name}</p>
// //               </div>
// //             ))
// //           ) : (
// //             <p>No albums found</p>
// //           )}
// //         </div>
// //       </div>
// //       <div className="my-5 font-bold text-2xl">Your Playlists</div>
// //       <div className="my-5">
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //           {playlists.length > 0 ? (
// //             playlists.map((playlist) => (
// //               <div key={playlist.id} className="bg-[#1a1a1a] p-4 rounded cursor-pointer" onClick={() => handlePlaylistClick(playlist.id)}>
// //                 <img
// //                   src={playlist.images[0]?.url || 'default_image_url'} // Replace 'default_image_url' with an actual URL if needed
// //                   alt={playlist.name}
// //                   className="w-full h-40 object-cover rounded"
// //                 />
// //                 <p className="mt-2">{playlist.name}</p>
// //               </div>
// //             ))
// //           ) : (
// //             <p>No playlists found</p>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default DisplayHome;
