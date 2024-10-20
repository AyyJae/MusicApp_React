import { createContext, useRef } from 'react';
import { useState } from 'react';
import { songsData } from './../assets/assets';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBar = useRef();
  const seekBg = useRef();

  const [track, setTrack] = useState(songsData[1]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    if (audioRef.current && track.previewUrl) {
      audioRef.current.src = track.previewUrl; // Set the preview URL
      audioRef.current.play();
      setPlayStatus(true)
  }
}

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false)
  }

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,setTrack,
    playStatus,setPlayStatus,
    time,setTime,
    play,pause
  };

  return <PlayerContext.Provider value={contextValue}>{props.children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;







// // // export const PlayerContext = createContext();

// // // const PlayerContextProvider = (props) => {
// // //   const audioRef = useRef();
// // //   const seekBar = useRef();
// // //   const seekBg = useRef();

// // //   const [track, setTrack] = useState(songsData[1]);
// // //   const [playStatus, setPlayStatus] = useState(false);
// // //   const [time, setTime] = useState({
// // //     currentTime: {
// // //       second: 0,
// // //       minute: 0,
// // //     },
// // //     totalTime: {
// // //       second: 0,
// // //       minute: 0,
// // //     },
// // //   });

// // //   const play = () => {
// // //     if (audioRef.current && track.previewUrl) {
// // //       audioRef.current.src = track.previewUrl; // Set the preview URL
// // //       audioRef.current.play();
// // //       setPlayStatus(true)
// // //   }
// // // }

// // //   const pause = () => {
// // //     audioRef.current.pause();
// // //     setPlayStatus(false)
// // //   }

// // //   const contextValue = {
// // //     audioRef,
// // //     seekBar,
// // //     seekBg,
// // //     track,setTrack,
// // //     playStatus,setPlayStatus,
// // //     time,setTime,
// // //     play,pause
// // //   };

// // //   return <PlayerContext.Provider value={contextValue}>{props.children}</PlayerContext.Provider>;
// // // };

// // // export default PlayerContextProvider;
