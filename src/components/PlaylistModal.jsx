import React, { useState } from 'react';
import axios from 'axios';

const PlaylistModal = ({ token, closeModal, onPlaylistCreated, onError }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [error, setError] = useState(null);

  const handleCreatePlaylist = async () => {
    if (!playlistName) {
      setError('Playlist name is required');
      onError('Playlist name is required');
      return;
    }

    try {
      const response = await axios.post(
        `https://api.spotify.com/v1/me/playlists`,
        { name: playlistName, public: false },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Playlist created:', response.data);
      if (onPlaylistCreated) {
        onPlaylistCreated(); // Call it after successful creation
      }
      closeModal(); // Close the modal after successful creation
    } catch (error) {
      setError('Error creating playlist');
      console.error('Error:', error);
      onError('Error creating playlist');
    }
  };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-md w-full max-w-lg md:max-w-md">
          <h2 className="text-xl mb-4 text-black">Create New Playlist</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input type="text" placeholder="Enter playlist name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} className="w-full p-2 border rounded-md mb-4 text-black" />
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
              Create
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  // return (
  //   <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
  //     <div className="bg-white p-5 rounded-md w-full max-w-md">
  //       <h2 className="text-xl mb-4 text-black">Create New Playlist</h2>
  //       {error && <p className="text-red-500">{error}</p>}
  //       <input type="text" placeholder="Enter playlist name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} className="w-full p-2 border rounded-md mb-4 text-black" />
  //       <div className="flex justify-end gap-2">
  //         <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
  //           Cancel
  //         </button>
  //         <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
  //           Create
  //         </button>
  //       </div>
  //     </div>

      {/*return (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
             <div className="bg-white p-6 rounded-md w-full">
             <h2 className="text-xl mb-4">Create New Playlist</h2>
             {error && <p className="text-red-500">{error}</p>}
             <input
              type="text"
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full p-2 border rounded-md mb-4 text-black"
              />
           <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
               Cancel
              </button>
             <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
               Create
             </button>
            </div>
         </div> */}

      {/* Media Query Styles */}
      {/* <style jsx="true">{`
        @media (max-width: 640px) {
          .w-full {
            width: 100%;
          }
          .p-6 {
            padding: 1rem;
          }
          .rounded-md {
            border-radius: 8px;
          }
        }
      `}</style> */}
   

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-md w-1/3">
//         <h2 className="text-xl mb-4">Create New Playlist</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input type="text" placeholder="Enter playlist name" value={playlistName}
//         onChange={(e) => setPlaylistName(e.target.value)}
//          className="w-full p-2 border rounded-md mb-4 text-black" />
//         <div className="flex justify-end gap-2">
//           <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
//             Cancel
//           </button>
//           <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

export default PlaylistModal;

//OLD
// const PlaylistModal = ({ token, closeModal, onPlaylistCreated, existingPlaylists }) => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [error, setError] = useState(null);

//   const handleCreatePlaylist = async () => {
//     if (!playlistName) {
//       setError('Playlist name is required');
//       return;
//     }

//     // Check for duplicate playlist name
//     // const isDuplicate = existingPlaylists.find((playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase());
//     const isDuplicate = Array.isArray(existingPlaylists) && existingPlaylists.some((playlist) => playlist.name.toLowerCase() === playlistName.toLowerCase());

//     if (isDuplicate) {
//       setError('A playlist with this name already exists');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `https://api.spotify.com/v1/me/playlists`,
//         { name: playlistName, public: false },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('Playlist created:', response.data);
//       if (onPlaylistCreated) {
//         onPlaylistCreated(); // Make sure to call it after successful creation
//       }
//       closeModal(); // Close the modal after successful creation
//     } catch (error) {
//       setError('Error creating playlist');
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-md w-1/3">
//         <h2 className="text-xl mb-4">Create New Playlist</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input type="text" placeholder="Enter playlist name" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} className="w-full p-2 border rounded-md mb-4 text-black" />
//         <div className="flex justify-end gap-2">
//           <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
//             Cancel
//           </button>
//           <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaylistModal;

// const PlaylistModal = ({ token, closeModal, onPlaylistCreated }) => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [error, setError] = useState(null);

//   const handleCreatePlaylist = async () => {
//     if (!playlistName) {
//       setError('Playlist name is required');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `https://api.spotify.com/v1/me/playlists`,
//         { name: playlistName, public: false },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('Playlist created:', response.data);
//       if (onPlaylistCreated) {
//         onPlaylistCreated(); // Make sure to call it after successful creation
//       }
//       closeModal(); // Close the modal after successful creation
//     } catch (error) {
//       setError('Error creating playlist');
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-md w-1/3">
//         <h2 className="text-xl mb-4">Create New Playlist</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="text"
//           placeholder="Enter playlist name"
//           value={playlistName}
//           onChange={(e) => setPlaylistName(e.target.value)}
//           className="w-full p-2 border rounded-md mb-4 text-black"
//         />
//         <div className="flex justify-end gap-2">
//           <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
//             Cancel
//           </button>
//           <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaylistModal;

// const PlaylistModal = ({ token, closeModal, onPlaylistCreated }) => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [error, setError] = useState(null);

//   const handleCreatePlaylist = async () => {
//     if (!playlistName) {
//       setError('Playlist name is required');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `https://api.spotify.com/v1/me/playlists`,
//         { name: playlistName, public: false },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('Playlist created:', response.data);
//       onPlaylistCreated(); // Call the callback to update playlists in DisplayHome
//       closeModal();
//     } catch (error) {
//       setError('Error creating playlist');
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-md w-1/3">
//         <h2 className="text-xl mb-4">Create New Playlist</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="text"
//           placeholder="Enter playlist name"
//           value={playlistName}
//           onChange={(e) => setPlaylistName(e.target.value)}
//           className="w-full p-2 border rounded-md mb-4 text-black"
//         />
//         <div className="flex justify-end gap-2">
//           <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
//             Cancel
//           </button>
//           <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaylistModal;

// const PlaylistModal = ({ token, closeModal }) => {
//   const [playlistName, setPlaylistName] = useState('');
//   const [error, setError] = useState(null);

//   const handleCreatePlaylist = async () => {
//     if (!playlistName) {
//       setError('Playlist name is required');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `https://api.spotify.com/v1/me/playlists`,
//         { name: playlistName, public: false },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('Playlist created:', response.data);
//       closeModal(); // Close modal after successful creation
//     } catch (error) {
//       setError('Error creating playlist');
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-md w-1/3">
//         <h2 className="text-xl mb-4">Create New Playlist</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="text"
//           placeholder="Enter playlist name"
//           value={playlistName}
//           onChange={(e) => setPlaylistName(e.target.value)}
//           className="w-full p-2 border rounded-md mb-4 text-black"
//         />
//         <div className="flex justify-end gap-2">
//           <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">
//             Cancel
//           </button>
//           <button onClick={handleCreatePlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
//             Create
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaylistModal;
