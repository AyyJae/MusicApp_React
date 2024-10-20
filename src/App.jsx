import { Sidebar, Display } from './components';
import React, { useState, useEffect, useContext } from 'react';
import Player from './components/MusicPlayer/Player';
import { PlayerContext } from './context/PlayerContext';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI; // Replace with your Redirect URI
const AUTH_ENDPOINT = process.env.REACT_APP_AUTH_ENDPOINT;
const RESPONSE_TYPE = 'token';
const SCOPES = [
  'user-top-read',
  'user-library-read', // To read albums saved in the user's library
  'playlist-modify-public',
  'playlist-modify-private',
  'user-modify-playback-state',
  'user-read-playback-state',
  'playlist-read-private',
  'user-read-private',
  'streaming',
].join('%20');

function App() {
  const [token, setToken] = useState('');
  const { audioRef, track } = useContext(PlayerContext) || {};

  useEffect(() => {
    // Get token from URL after redirect
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    setToken('');
    window.location.href = 'https://accounts.spotify.com/en/logout';
  //  setGoogleUser(null);
  };

  return (
    <div className="h-screen bg-black">
      {!token ? (
        <div className="w-full text-center">
          <h1 className="text-4xl text-white font-bold mt-6 mb-8 sm:text-2xl"> 
            Spotify API Integration
          </h1>
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
            className="mt-20 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xl">
            Login to Spotify
          </a>
        </div>
      ) : (
        <div className="h-[90%] flex w-full relative flex-col sm:flex-row"> 
          <Sidebar token={token} className="w-full sm:w-1/4" /> {/* Full width on mobile, 1/4 on larger screens */}
          <Display token={token} handleLogout={handleLogout} className="w-full sm:w-3/4" /> 
          
          <div className="fixed bottom-0 w-full">
            <Player />
            {track && track.file ? (
              <audio ref={audioRef} src={track.file} preload="auto"></audio>
            ) : (
              <audio ref={audioRef} preload="auto"></audio>
            )}
          </div>
        </div>
      )}
    </div>
  );
  


  // return (
  //   <div className="h-screen bg-black">
     
  //     {!token ? (
  //       <div className="w-full text-center">
  //         <h1 className="text-4xl text-white font-bold mt-2 mb-8">Spotify API Integration</h1>
  //         <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`} className="mt-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
  //           Login to Spotify
  //         </a>
  //       </div>
  //     ) : (
  //       <div className="h-[90%] flex w-full relative">
  //         <Sidebar token={token} />
  //         <Display token={token} handleLogout={handleLogout} /> {/* Passing token to Display */}

  //         <div className="fixed bottom-0 w-full">
  //           <Player />
  //           {track && track.file ? (
  //             <audio ref={audioRef} src={track.file} preload="auto"></audio>
  //           ) : (
  //             <audio ref={audioRef} preload="auto"></audio> // Hidden audio element if no track
  //           )}
  //           {/* <audio ref={audioRef} src={track.file} preload="auto"></audio> */}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}

export default App;

