import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { PlayerContext } from '../../context/PlayerContext';

const Player = () => {
  const { track, seekBar, seekBg, playStatus, play, pause, audioRef } = useContext(PlayerContext);

  return (
    <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        {track ? (
          <>
            <img className="w-12" src={track.image} alt="" />
            <div>
              <p>{track.name}</p>
              {/* <p>{track.desc.slice(0, 12)}</p> */}
            </div>
          </>
        ) : (
          <p>No track playing</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          {/* <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" /> */}
          <img className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
          {playStatus ? <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="" /> : <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="" />}
          <img className="w-4 cursor-pointer" src={assets.next_icon} alt="" />
          {/* <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" /> */}
        </div>
        <div className="flex items-center gap-5">
          <p>0:06</p>
          <div ref={seekBg} className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
            <hr ref={seekBar} className="h-1 border-none w-0 bg-green-800 rounded-full" />
          </div>
          <p>2:20</p>
        </div>
      </div>
      <audio ref={audioRef} /> {/* Hidden audio element to play Spotify preview URLs */}
    </div>
  );
};

export default Player;

// const Player = () => {
//   const { track, seekBar, seekBg, playStatus, play, pause, nextTrack, prevTrack, audioRef } = useContext(PlayerContext);

//   return (
//     <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
//       <div className="hidden lg:flex items-center gap-4">
//         {track ? (
//           <>
//             <img className="w-12" src={track.image} alt="" />
//             <div>
//               <p>{track.name}</p>
//               {/* <p>{track.desc.slice(0, 12)}</p> */}
//             </div>
//           </>
//         ) : (
//           <p>No track playing</p>
//         )}
//       </div>
//       <div className="flex flex-col items-center gap-1 m-auto">
//         <div className="flex gap-4">
//           <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" />
//           <img className="w-4 cursor-pointer" src={assets.prev_icon} alt="Previous" onClick={prevTrack} /> {/* Previous button */}
//           {playStatus ? (
//             <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="Pause" />
//           ) : (
//             <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="Play" />
//           )}
//           <img className="w-4 cursor-pointer" src={assets.next_icon} alt="Next" onClick={nextTrack} /> {/* Next button */}
//           <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" />
//         </div>
//         <div className="flex items-center gap-5">
//           <p>1:06</p>
//           <div ref={seekBg} className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
//             <hr ref={seekBar} className="h-1 border-none w-0 bg-green-800 rounded-full" />
//           </div>
//           <p>3:20</p>
//         </div>
//       </div>
//       <audio ref={audioRef} /> {/* Hidden audio element to play Spotify preview URLs */}
//     </div>
//   );
// };

// export default Player;

// const Player = () => {
//   const { track, seekBar, seekBg, playStatus, play, pause, audioRef } = useContext(PlayerContext);

//   return (
//     <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
//       <div className="hidden lg:flex items-center gap-4">
//         {track ? (
//           <>
//             <img className="w-12" src={track.image} alt="" />
//             <div>
//               <p>{track.name}</p>
//               {/* <p>{track.desc.slice(0, 12)}</p> */}
//             </div>
//           </>
//         ) : (
//           <p>No track playing</p>
//         )}
//       </div>
//       <div className="flex flex-col items-center gap-1 m-auto">
//         <div className="flex gap-4">
//           <img className="w-4 cursor-pointer" src={assets.shuffle_icon} alt="" />
//           <img className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
//           {playStatus ? <img onClick={pause} className="w-4 cursor-pointer" src={assets.pause_icon} alt="" /> : <img onClick={play} className="w-4 cursor-pointer" src={assets.play_icon} alt="" />}
//           <img className="w-4 cursor-pointer" src={assets.next_icon} alt="" />
//           <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" />
//         </div>
//         <div className="flex items-center gap-5">
//           <p>1:06</p>
//           <div ref={seekBg} className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
//             <hr ref={seekBar} className="h-1 border-none w-0 bg-green-800 rounded-full" />
//           </div>
//           <p>3:20</p>
//         </div>
//       </div>
//       <audio ref={audioRef} /> {/* Hidden audio element to play Spotify preview URLs */}
//     </div>
//   );
// };

// export default Player;
