import React from 'react';
import DisplayHome from './DisplayLibrary';
import DisplayAlbum from './DisplayAlbum';
import DisplayPlaylist from './DisplayPlaylist';
import SearchResults from './SearchResults';
import TopCharts from './TopCharts';
import TrackPage from './TrackPage';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';

const Display = ({ token, handleLogout }) => {
  return (
    <div className="w-[100%] m-2 px-6 pt-4 rounded bg-black text-white overflow-auto lg:w-[75%] lg:ml-0">
      {/* <SearchBar token={token} /> */}
      <Routes>
        <Route path="/library" element={<DisplayHome token={token} handleLogout={handleLogout} />} />
        {/* <Route path="/top50india" element={<DisplayPlaylist token={token} id="37i9dQZEVXbLZ52XmnySJg" />} /> */}
        <Route path="/track/:trackId" element={<TrackPage token={token} handleLogout={handleLogout} />} />
        <Route path="/album/:id" element={<DisplayAlbum token={token} handleLogout={handleLogout} />} />
        <Route path="/" element={<TopCharts token={token} handleLogout={handleLogout} />} />
        <Route path="/playlist/:id" element={<DisplayPlaylist token={token} handleLogout={handleLogout} />} />
        <Route path="/search" element={<SearchResults token={token} handleLogout={handleLogout} />} />
      </Routes>
    </div>
  );
};

export default Display;
