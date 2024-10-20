import { VscAccount } from 'react-icons/vsc';
import { FaSearch } from 'react-icons/fa';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ token, handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=track,album,playlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { albums, playlists, tracks } = response.data;
      navigate('/search', { state: { albums, playlists, tracks } });
    } catch (error) {
      setError('Error fetching search results');
      console.error('Search error:', error);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-2 bg-gray-900">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex-grow flex items-center bg-gray-800 p-1 rounded-md max-w-md"
      >
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 rounded-l-md bg-gray-700 text-white placeholder-gray-400 outline-none"
          style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        />
        <button
          type="submit"
          className="p-2 bg-gray-600 rounded-r-md hover:bg-gray-500 flex items-center justify-center"
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          <FaSearch className="text-white text-2xl" />
        </button>
        {error && <p className="text-red-500 ml-2">{error}</p>}
      </form>

      {/* User Icon and Dropdown */}
      <div className="relative ml-4">
        <VscAccount
          onClick={toggleDropdown}
          className="text-3xl cursor-pointer text-white"
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-600 border border-gray-500 rounded-md shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-500 rounded-md"
              onBlur={closeDropdown}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Responsive design for mobile */}
      <style jsx="true">{`
        @media (max-width: 640px) {
          .flex-grow {
            max-width: 100%;
          }
          .ml-4 {
            margin-left: 8px;
          }
          .w-full {
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;



///...
// const Navbar = ({ token, handleLogout }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [query, setQuery] = useState('');
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const closeDropdown = () => {
//     setIsDropdownOpen(false);
//   };

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!query) return;

//     try {
//       const response = await axios.get(
//         `https://api.spotify.com/v1/search?q=${query}&type=track,album,playlist`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const { albums, playlists, tracks } = response.data;
//       navigate('/search', { state: { albums, playlists, tracks } });
//     } catch (error) {
//       setError('Error fetching search results');
//       console.error('Search error:', error);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col sm:flex-row justify-between items-center p-2 bg-gray-900">
//       {/* Search Bar */}
//       <form
//         onSubmit={handleSearch}
//         className="flex-grow flex items-center bg-gray-800 p-1 rounded-md max-w-full sm:max-w-md mb-2 sm:mb-0"
//       >
//         <input
//           type="text"
//           placeholder="Search"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="flex-grow p-2 rounded-l-md bg-gray-700 text-white placeholder-gray-400 outline-none"
//           style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
//         />
//         <button
//           type="submit"
//           className="p-2 bg-gray-600 rounded-r-md hover:bg-gray-500 flex items-center justify-center"
//           style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
//         >
//           <FaSearch className="text-white text-2xl" />
//         </button>
//         {error && <p className="text-red-500 ml-2">{error}</p>}
//       </form>

//       {/* User Icon and Dropdown */}
//       <div className="relative">
//         <VscAccount
//           onClick={toggleDropdown}
//           className="text-3xl cursor-pointer text-white"
//         />
//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-gray-600 border border-gray-500 rounded-md shadow-lg">
//             <button
//               onClick={handleLogout}
//               className="w-full text-left px-4 py-2 hover:bg-gray-500 rounded-md"
//               onBlur={closeDropdown} // Close dropdown when focus is lost
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

///not responsive but good
//   return (
//     <div className="w-full flex justify-between items-center p-2 bg-gray-900">
//       {/* Search Bar */}
//       <form
//         onSubmit={handleSearch}
//         className="flex-grow flex items-center bg-gray-800 p-1 rounded-md max-w-md"
//       >
//         <input
//           type="text"
//           placeholder="Search"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="flex-grow p-2 rounded-l-md bg-gray-700 text-white placeholder-gray-400 outline-none"
//           style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
//         />
//         <button
//           type="submit"
//           className="p-2 bg-gray-600 rounded-r-md hover:bg-gray-500 flex items-center justify-center"
//           style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
//         >
//           <FaSearch className="text-white text-2xl" />
//         </button>
//         {error && <p className="text-red-500 ml-2">{error}</p>}
//       </form>

//       {/* User Icon */}
//       <div className="relative ml-4">
//         <VscAccount
//           onClick={toggleDropdown}
//           className="text-3xl cursor-pointer text-white"
//         />
//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-gray-600 border border-gray-500 rounded-md shadow-lg">
//             <button
//               onClick={handleLogout}
//               className="w-full text-left px-4 py-2 hover:bg-gray-500 rounded-md"
//               onBlur={closeDropdown} // Close dropdown when focus is lost
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

//export default Navbar;


 ///works well with searchbar-not exactly responsive
// const Navbar = ({ handleLogout }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const closeDropdown = () => {
//     setIsDropdownOpen(false);
//   };

//   return (
//     <>
//       <div className="w-full flex justify-between items-center font-semibold">
//         <div className="flex items-center gap-2 mt-2 ml-auto">
//           {/* User icon and dropdown menu */}
//           <div className="relative">
//             <VscAccount onClick={toggleDropdown} className="text-3xl cursor-pointer relative top-[-50px]" />
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-gray-600 border border-gray-500 rounded-md shadow-lg">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-500 rounded-md"
//                   onBlur={closeDropdown} // Close dropdown when focus is lost
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
    //ALL
//       <div className="flex items-center mt-5 gap-2">
//         <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">All</p>
//       </div>
//       <div></div>
//     </>
//   );
// };

// export default Navbar;



//RESPONSIVE without searchbar
// const Navbar = ({ handleLogout }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const closeDropdown = () => {
//     setIsDropdownOpen(false);
//   };

//   return (
//     <>
//       <div className="w-full flex justify-between items-center font-semibold px-4 py-2">

//         {/* searchbar */}
  
//         <div className="flex items-center gap-2 mt-2 ml-auto">
//           {/* User icon and dropdown menu */}
//           <div className="relative">
//             <VscAccount
//               onClick={toggleDropdown}
//               className="text-3xl cursor-pointer relative top-[-20px] sm:top-[-10px]" 
//             />
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-gray-600 border border-gray-500 rounded-md shadow-lg">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full text-left px-4 py-2 hover:bg-gray-500 rounded-md"
//                   onBlur={closeDropdown} 
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center mt-5 gap-2 px-4 sm:px-2"> 
//         <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
//           All
//         </p>
//       </div>
//       <div></div>
//     </>
//   );
// };

// export default Navbar;






//Obsolete
// const Navbar = ({ handleLogout }) => {
//   return (
//     <>
//       <div className="w-full flex justify-between items-center font-semibold">
//         <div className="flex items-center gap-4 mt-2 ml-auto">
//           {/* <p className="bg-white text-black text-[15px] rounded-2xl px-4 py-1 cursor-pointer hidden md:block">Explore Premium</p> */}
//           <button onClick={handleLogout} className="bg-white hover:bg-gray-500 text-black py-1 px-3 rounded">
//             Logout
//           </button>
//         </div>
//       </div>
//       <div className="flex items-center mt-5 gap-2">
//         <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">All</p>
//         {/* <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">Music</p>
//         <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">Podcasts</p> */}
//       </div>
//       <div></div>
//     </>
//   );
// };

// export default Navbar;
