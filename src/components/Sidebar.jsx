import { React } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import PlaylistModal from './PlaylistModal';
import { useState } from 'react';

const Sidebar = ({ token }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle on mobile
  const location = useLocation();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar

  const linkStyle = 'flex items-center gap-3 pl-8 mt-2 cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:text-white';
  const activeLinkStyle = 'flex items-center gap-3 pl-8 py-2 cursor-pointer bg-gray-600 text-white rounded-lg transition-all duration-300';

 
    return (
      <>
        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden text-white p-4 fixed top-4 left-4 z-50 bg-black rounded-full"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>
  
        {/* Sidebar */}
        <div
          className={`fixed inset-0 lg:relative w-[70%] lg:w-[25%] h-full p-4 gap-4 flex-col text-white bg-black transition-transform duration-300 z-40 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Close Button for Mobile */}
          <button
            className="lg:hidden text-white p-2 bg-gray-700 rounded-full self-end mb-4"
            onClick={toggleSidebar}
          >
            ✕
          </button>
  
          {/* Home Link */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className={location.pathname === '/' ? activeLinkStyle : linkStyle}>
              <img className="w-6" src={assets.home_icon} alt="Home Icon" />
              <p className="font-bold">Home</p>
            </Link>
             <Link to="/library" className={location.pathname === '/library' ? activeLinkStyle : linkStyle}>
                <img className="w-6" src={assets.stack_icon} alt="Library Icon" />
                <p className="font-bold">Library</p>
             </Link>
          </div>
  
          <div className="mt-8 bg-gray-700 p-6 rounded-lg flex flex-col items-start space-y-4">
            <h1 className="text-lg font-semibold">Create your first playlist</h1>
            <button onClick={openModal} className="px-6 py-2 bg-white text-black text-sm rounded-full transition-all duration-300 hover:bg-gray-300">Create playlist</button>
          </div>
  
          {/* Playlist Modal */}
          {isModalOpen && <PlaylistModal token={token} closeModal={closeModal} />}
        </div>
  
        {/* Overlay for Mobile when Sidebar is Open */}
        {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={toggleSidebar}></div>}
      </>
    );
  };
  
  export default Sidebar;



  // return (
  //       <div className="w-[25%] h-full p-4 gap-4 flex-col text-white bg-black hidden lg:flex">
  //         {/* Home */}
  //         <div className="flex flex-col space-y-4">
  //           <Link to="/" className={location.pathname === '/' ? activeLinkStyle : linkStyle}>
  //             <img className="w-6" src={assets.home_icon} alt="Home Icon" />
  //             <p className="font-bold">Home</p>
  //           </Link>

  //           {/* <Link to="/library" className={location.pathname === '/library' ? activeLinkStyle : linkStyle}>
  //             <img className="w-6" src={assets.stack_icon} alt="Library Icon" />
  //             <p className="font-bold">Library</p>
  //           </Link> */}
  //         </div>

  //         <div className="mt-8 bg-gray-700 p-6 rounded-lg flex flex-col items-start space-y-4">
  //           <h1 className="text-lg font-semibold">Create your own playlist</h1>
  //           <button onClick={openModal} className="px-6 py-2 bg-white text-black text-sm rounded-full transition-all duration-300 hover:bg-gray-300">Create playlist</button>
  //         </div>

  //         {/* Playlist Modal */}
  //         {isModalOpen && <PlaylistModal token={token} closeModal={closeModal} />}
  //       </div>
  //     );
  //   };



//   return (
//     <>
//       <button onClick={toggleSidebar} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-700 text-white rounded-md">
//         Menu
//       </button>

//       {/* Sidebar */}
//       <div className={`fixed top-0 left-0 h-full p-4 bg-black text-white z-40 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:w-[25%] lg:flex lg:flex-col`}>
//         {/* Home */}
//         <div className="flex flex-col space-y-4">
//           <Link to="/" className={location.pathname === '/' ? activeLinkStyle : linkStyle}>
//             <img className="w-6" src={assets.home_icon} alt="Home Icon" />
//             <p className="font-bold">Home</p>
//           </Link>
//         </div>

//         <div className="mt-8 bg-gray-700 p-6 rounded-lg flex flex-col items-start space-y-4">
//           <h1 className="text-lg font-semibold">Create your own playlists</h1>
//           <button onClick={openModal} className="px-6 py-2 bg-white text-black text-sm rounded-full transition-all duration-300 hover:bg-gray-300">
//             Create playlist
//           </button>
//         </div>

//         {/* Playlist Modal */}
//         {isModalOpen && <PlaylistModal token={token} closeModal={closeModal} />}
//       </div>

//       {/* Overlay for mobile sidebar */}
//       {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" />}
//     </>
//   );
// };

// export default Sidebar;

///works well
// const Sidebar = ({ token }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const location = useLocation();
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   const linkStyle = 'flex items-center gap-3 pl-8 mt-2 cursor-pointer transition-all duration-300 hover:bg-gray-600 hover:text-white';
//   const activeLinkStyle = 'flex items-center gap-3 pl-8 py-2 cursor-pointer bg-gray-600 text-white rounded-lg transition-all duration-300';

//   return (
//     <div className="w-[25%] h-full p-4 gap-4 flex-col text-white bg-black hidden lg:flex">
//       {/* Home */}
//       <div className="flex flex-col space-y-4">
//         <Link to="/" className={location.pathname === '/' ? activeLinkStyle : linkStyle}>
//           <img className="w-6" src={assets.home_icon} alt="Home Icon" />
//           <p className="font-bold">Home</p>
//         </Link>

//         {/* <Link to="/library" className={location.pathname === '/library' ? activeLinkStyle : linkStyle}>
//           <img className="w-6" src={assets.stack_icon} alt="Library Icon" />
//           <p className="font-bold">Library</p>
//         </Link> */}
//       </div>

//       <div className="mt-8 bg-gray-700 p-6 rounded-lg flex flex-col items-start space-y-4">
//         <h1 className="text-lg font-semibold">Create your first playlist</h1>
//         <button onClick={openModal} className="px-6 py-2 bg-white text-black text-sm rounded-full transition-all duration-300 hover:bg-gray-300">Create playlist</button>
//       </div>

//       {/* Playlist Modal */}
//       {isModalOpen && <PlaylistModal token={token} closeModal={closeModal} />}
//     </div>
//   );
// };

// export default Sidebar;

///Obsolete
// const Sidebar = ({ }) => {
//    const [isModalOpen, setIsModalOpen] = useState(false);
//    const location = useLocation();
//    const openModal = () => setIsModalOpen(true);
//    const closeModal = () => setIsModalOpen(false);

//    const linkStyle = 'flex items-center gap-3 pl-8 mt-2 cursor-pointer';
//    const activeLinkStyle = 'flex items-center gap-3 pl-8 py-2 cursor-pointer bg-gray-500';

//   return (
//    <><div className="w-[25%] h-full p-2 gap-2 flex-col text-white hidden lg:flex">
//         <div className="bg-black h-[15%] flex flex-col justify-around">
//             <Link to="/" className={location.pathname === '/' ? activeLinkStyle : linkStyle}>
//               <img className="w-6" src={assets.home_icon} alt="" />
//               <p className='font-bold'>Home</p>
//             </Link>
//         </div>

//       <div className="bg-black h-[85%]">
//          <div className="flex items-center justify-between">
//             {/* <Link to="/" className="flex items-center gap-3 pl-4 cursor-pointer"> */}
//             <Link to="/library" className={location.pathname === '/library' ? activeLinkStyle : linkStyle}>
//                 <img className="w-6" src={assets.stack_icon} alt="" />
//                 <p className='font-bold'>Library</p>
//              </Link>
//          </div>
//          <div className='p-4 bg-gray-500 m-4 rounded font-semibold flex flex-col items-start justify-start pl-4'>
//             <h1>Create your first playlist</h1>
//             <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Create playlist</button>
//          </div>
//           {/* Modal for creating playlist */}
//            {/* {isModalOpen && <PlaylistModal token={token} closeModal={closeModal} />} */}
//       </div>
//    </div></>
//   )
// }

// export default Sidebar;
