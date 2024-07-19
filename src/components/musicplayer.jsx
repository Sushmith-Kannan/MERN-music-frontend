import React, { useEffect, useRef, useState } from 'react';

function MusicPlayer({ tracks, currentTrackIndex, setCurrentTrackIndex }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (tracks.length > 0) {
      playTrack(currentTrackIndex);
    }
  }, [currentTrackIndex, tracks]);

  const playTrack = (index) => {
    const track = tracks[index];
    if (track) {
      const trackUrl = `http://localhost:3000${track.src}`;
      audioRef.current.src = trackUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Playback error:', error);
          setIsPlaying(false);
        });
    } else {
      console.error(`Track at index ${index} is undefined.`);
    }
  };

  const playPauseTrack = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Playback error:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.ended) {
        clearInterval(intervalRef.current);
        nextTrack();
      } else if (audioRef.current) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    }, 1000);
  };

  const seekTrack = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(e.target.value);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    startTimer();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="p-4 bg-gray-100 bg-opacity-50 backdrop-blur-lg rounded-md shadow-md">
      <h1 className="text-xl font-bold text-center mb-4">Music Player</h1>
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-lg font-semibold">{tracks[currentTrackIndex]?.title}</h3>
          <p className="text-gray-600">{tracks[currentTrackIndex]?.artist}</p>
        </div>
        <audio
          ref={audioRef}
          onPlay={startTimer}
          onPause={() => clearInterval(intervalRef.current)}
          onEnded={nextTrack}
          onLoadedMetadata={handleLoadedMetadata}
        />
        <input
          type="range"
          value={progress}
          onChange={seekTrack}
          step="0.01"
          min="0"
          max="100"
          className="w-full bg-gray-300 rounded-full appearance-none h-3"
        />
        <div className="flex items-center justify-between text-gray-600">
          <span>{formatTime(audioRef.current ? audioRef.current.currentTime : 0)}</span>
          <span> / </span>
          <span>{duration > 0 ? formatTime(duration) : 'Loading...'}</span>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={prevTrack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md transition duration-300"
          >
            Previous
          </button>
          <button
            onClick={playPauseTrack}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition duration-300"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={nextTrack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
