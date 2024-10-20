import React, { useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import { PlayerContext } from '../context/PlayerContext';
import Navbar from './Navbar';

const SearchResults = ({ token, handleLogout }) => {
  const location = useLocation();
  const { albums, playlists, tracks } = location.state || {}; // Fetch albums, playlists, and tracks from location state
  const { setTrack, play } = useContext(PlayerContext); // Access the player context
  const [currentTrackId, setCurrentTrackId] = useState(null); 
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success' or 'error'
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Check if no search results are passed and redirect to home
  // if (!albums && !playlists && !tracks) {
  //   return (
  //     <div>
  //       <p>No search results found. Redirecting to home...</p>
  //       {setTimeout(() => navigate('/'), 3000)} {/* Redirect after 3 seconds */}
  //     </div>
  //   );
  // }

  const handleTrackClick = (track) => {
    const trackInfo = {
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      previewUrl: track.preview_url,
      image: track.album.images[0]?.url, 
      desc: track.artists.map(artist => artist.name).join(', '),
    };

    if (track.preview_url) {
      setTrack(trackInfo); // Set track in PlayerContext
      play(); 
      setCurrentTrackId(track.id);
    } else {
      alert("This track doesn't have a preview available.");
    }
  };

  const showModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setIsModalVisible(true);

    // Hide the modal after 2 seconds
    setTimeout(() => {
      setIsModalVisible(false);
    }, 2000);
  };

  const handleAddToPlaylist = (track) => {
    // Simulate adding track to a playlist
    const success = Math.random() > 0.5; // Random success/failure for demonstration

    if (success) {
      showModal(`Track "${track.name}" added to the playlist!`, 'success');
    } else {
      showModal(`Failed to add track "${track.name}" to the playlist.`, 'error');
    }
  };

  return (
    <>
      <Navbar token={token} handleLogout={handleLogout} />
      <div className="search-results">
        {/* Display Albums */}
        {albums?.items.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4 mt-3">Albums</h2>
            <ul>
              {albums.items.map((album) => (
                <li key={album.id}>
                  {/* Link to the album's page */}
                  <Link to={`/album/${album.id}`} className="hover:text-blue-400">
                    {album.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display Playlists */}
        {playlists?.items.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4 mt-3">Playlists</h2>
            <ul>
              {playlists.items.map((playlist) => (
                <li key={playlist.id}>
                  {/* Link to the playlist's page */}
                  <Link to={`/playlist/${playlist.id}`} className="hover:text-blue-400">
                    {playlist.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display Tracks */}
        {tracks?.items.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4 mt-3">Tracks</h2>
            <ul>
              {tracks.items.map((track) => (
                <li
                  key={track.id}
                  className={`cursor-pointer p-2 ${track.id === currentTrackId ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}`} // Highlight the currently playing track
                  onClick={() => handleTrackClick(track)}
                >
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display a message if no results were found */}
        {(!albums || albums.items.length === 0) && (!playlists || playlists.items.length === 0) && (!tracks || tracks.items.length === 0) && (
          <p>No results found</p>
        )}
      </div>

      {/* Modal Popup */}
      {isModalVisible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-md text-white ${
            modalType === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {modalMessage}
        </div>
      )}
    </>
  );
};

export default SearchResults;


// const SearchResults = ({ token, handleLogout }) => {
//   const location = useLocation();
//   const { albums, playlists, tracks } = location.state || {}; // Fetch albums, playlists, and tracks from location state
//   const { setTrack, play } = useContext(PlayerContext); // Access the player context
//   const [currentTrackId, setCurrentTrackId] = useState(null); 
//   const [modalMessage, setModalMessage] = useState('');
//   const [modalType, setModalType] = useState(''); // 'success' or 'error'
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const handleTrackClick = (track) => {
//     const trackInfo = {
//       name: track.name,
//       artists: track.artists.map(artist => artist.name).join(', '),
//       previewUrl: track.preview_url,
//       image: track.album.images[0]?.url, 
//       desc: track.artists.map(artist => artist.name).join(', '),
//     };

//     if (track.preview_url) {
//       setTrack(trackInfo); // Set track in PlayerContext
//       play(); 
//       setCurrentTrackId(track.id);
//     } else {
//       alert("This track doesn't have a preview available.");
//     }
//   };

//   const showModal = (message, type) => {
//     setModalMessage(message);
//     setModalType(type);
//     setIsModalVisible(true);

//     // Hide the modal after 2 seconds
//     setTimeout(() => {
//       setIsModalVisible(false);
//     }, 2000);
//   };

//   const handleAddToPlaylist = (track) => {
//     // Simulate adding track to a playlist
//     const success = Math.random() > 0.5; // Random success/failure for demonstration

//     if (success) {
//       showModal(`Track "${track.name}" added to the playlist!`, 'success');
//     } else {
//       showModal(`Failed to add track "${track.name}" to the playlist.`, 'error');
//     }
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="search-results">
//         {/* Display Albums */}
//         {albums?.items.length > 0 && (
//           <div>
//             <h2 className="text-2xl mb-4 mt-3">Albums</h2>
//             <ul>
//               {albums.items.map((album) => (
//                 <li key={album.id}>
//                   {/* Link to the album's page */}
//                   <Link to={`/album/${album.id}`} className="hover:text-blue-400">
//                     {album.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Display Playlists */}
//         {playlists?.items.length > 0 && (
//           <div>
//             <h2 className="text-2xl mb-4 mt-3">Playlists</h2>
//             <ul>
//               {playlists.items.map((playlist) => (
//                 <li key={playlist.id}>
//                   {/* Link to the playlist's page */}
//                   <Link to={`/playlist/${playlist.id}`} className="hover:text-blue-400">
//                     {playlist.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Display Tracks */}
//         {tracks?.items.length > 0 && (
//           <div>
//             <h2 className="text-2xl mb-4 mt-3">Tracks</h2>
//             <ul>
//               {tracks.items.map((track) => (
//                 <li
//                   key={track.id}
//                   className={`cursor-pointer p-2 ${track.id === currentTrackId ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}`} // Highlight the currently playing track
//                   onClick={() => handleTrackClick(track)}
//                 >
//                   <Link to={`/album/${track.album.id}`} className="hover:text-blue-400">
//                     {track.name} by {track.artists.map(artist => artist.name).join(', ')}
//                   </Link>
                 
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Display a message if no results were found */}
//         {(!albums || albums.items.length === 0) && (!playlists || playlists.items.length === 0) && (!tracks || tracks.items.length === 0) && (
//           <p>No results found</p>
//         )}
//       </div>

//       {/* Modal Popup */}
//       {isModalVisible && (
//         <div
//           className={`fixed top-4 right-4 p-4 rounded-lg shadow-md text-white ${
//             modalType === 'success' ? 'bg-green-500' : 'bg-red-500'
//           }`}
//         >
//           {modalMessage}
//         </div>
//       )}
//     </>
//   );
// };

// export default SearchResults;



  //OLD
// const SearchResults = ({ token, handleLogout }) => {
//   const location = useLocation();
//   const { albums, playlists, tracks } = location.state || {}; // Fetch albums, playlists, and tracks from location state
//   const { setTrack, play } = useContext(PlayerContext); // Access the player context
//   const [currentTrackId, setCurrentTrackId] = useState(null); 

//   const handleTrackClick = (track) => {
//     const trackInfo = {
//       name: track.name,
//       artists: track.artists.map(artist => artist.name).join(', '),
//       previewUrl: track.preview_url,
//       image: track.album.images[0]?.url, 
//       desc: track.artists.map(artist => artist.name).join(', '),
//     };

//     if (track.preview_url) {
//       setTrack(trackInfo); // Set track in PlayerContext
//       play(); 
//       setCurrentTrackId(track.id);
//     } else {
//       alert("This track doesn't have a preview available.");
//     }
//   };

//   return (
//     <>
//       <Navbar handleLogout={handleLogout} />
//       <div className="search-results">
//         {/* Display Albums */}
//         {albums?.items.length > 0 && (
//           <div>
//             <h2 className="text-2xl mb-4 mt-3">Albums</h2>
//             <ul>
//               {albums.items.map((album) => (
//                 <li key={album.id}>
//                   {/* Link to the album's page */}
//                   <Link to={`/album/${album.id}`} className="hover:text-blue-400">
//                     {album.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Display Playlists */}
//         {playlists?.items.length > 0 && (
//           <div>
//             <h2 className="text-2xl mb-4 mt-3">Playlists</h2>
//             <ul>
//               {playlists.items.map((playlist) => (
//                 <li key={playlist.id}>
//                   {/* Link to the playlist's page */}
//                   <Link to={`/playlist/${playlist.id}`} className="hover:text-blue-400">
//                     {playlist.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Display Tracks */}
//         {tracks?.items.length > 0 && (
//           <div>
//             <h2 className="text-2xl mb-4 mt-3">Tracks</h2>
//             <ul>
//               {tracks.items.map((track) => (
//                 <li
//                   key={track.id}
//                   className={`cursor-pointer p-2 ${track.id === currentTrackId ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300'}`} // Highlight the currently playing track
//                   onClick={() => handleTrackClick(track)}
//                 >
//                   <Link to={`/album/${track.album.id}`} className="hover:text-blue-400">
//                     {track.name} by {track.artists.map(artist => artist.name).join(', ')}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Display a message if no results were found */}
//         {(!albums || albums.items.length === 0) && (!playlists || playlists.items.length === 0) && (!tracks || tracks.items.length === 0) && (
//           <p>No results found</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default SearchResults;


