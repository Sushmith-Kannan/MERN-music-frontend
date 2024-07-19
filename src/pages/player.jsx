import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function MusicPlayer() {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genre, setGenre] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showArtists, setShowArtists] = useState(false);
  const [showAlbums, setShowAlbums] = useState(false);
  const [showGenre, setShowGenre] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tracks');
        const data = response.data;
        setTracks(data);
        setIsLoading(false);

        const uniqueArtists = [...new Set(data.map(track => track.artist))];
        const uniqueAlbums = [...new Set(data.map(track => track.album))];
        const uniqueGenre = [...new Set(data.map(track => track.genre))];
        setArtists(uniqueArtists);
        setAlbums(uniqueAlbums);
        setGenre(uniqueGenre);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadTracks = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      setTracks(data);
      setCurrentTrackIndex(0);
      playTrack(0);
      setShowArtists(false);
      setShowAlbums(false);
      setShowGenre(false);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const loadTracksByArtist = (artist) => {
    const url = `http://localhost:3000/artists/${encodeURIComponent(artist)}`;
    loadTracks(url);
  };

  const loadTracksByAlbum = (albumName) => {
    const url = `http://localhost:3000/albums/${encodeURIComponent(albumName)}`;
    loadTracks(url);
  };

  const loadTracksByGenre = (genreName) => {
    const url = `http://localhost:3000/genres/${encodeURIComponent(genreName)}`;
    loadTracks(url);
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
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
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Playback error:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.ended) {
        clearInterval(intervalRef.current);
        setIsPlaying(false);
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
    playTrack(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIndex);
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

  // Render only buttons if isLoading is true
  if (isLoading) {
    return (
      <div>
        <h1>Music Player</h1>
        <button onClick={() => setShowArtists(!showArtists)}>
          {showArtists ? 'Hide Artists' : 'Show Artists'}
        </button>
        <button onClick={() => setShowAlbums(!showAlbums)}>
          {showAlbums ? 'Hide Albums' : 'Show Albums'}
        </button>
        <button onClick={() => setShowGenre(!showGenre)}>
          {showGenre ? 'Hide Genre' : 'Show Genre'}
        </button>
        <p>Loading tracks...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Music Player</h1>

      <button onClick={() => setShowArtists(!showArtists)}>
        {showArtists ? 'Hide Artists' : 'Show Artists'}
      </button>

      <button onClick={() => setShowAlbums(!showAlbums)}>
        {showAlbums ? 'Hide Albums' : 'Show Albums'}
      </button>

      <button onClick={() => setShowGenre(!showGenre)}>
        {showGenre ? 'Hide Genre' : 'Show Genre'}
      </button>

      {showArtists && (
        <div>
          <h2>Artists</h2>
          <ul>
            {artists.map((artist, index) => (
              <li key={index} onClick={() => loadTracksByArtist(artist)}>
                {artist}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showAlbums && (
        <div>
          <h2>Albums</h2>
          <ul>
            {albums.map((album, index) => (
              <li key={index} onClick={() => loadTracksByAlbum(album)}>
                {album}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showGenre && (
        <div>
          <h2>Genres</h2>
          <ul>
            {genre.map((genreName, index) => (
              <li key={index} onClick={() => loadTracksByGenre(genreName)}>
                {genreName}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!showArtists && !showAlbums && !showGenre && (
        <div>
          <h2>{tracks.length > 0 && `Tracks by ${tracks[0].artist}`}</h2>
          <ul>
            {tracks.map((track, index) => (
              <li key={index} onClick={() => playTrack(index)}>
                {track.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3>{tracks[currentTrackIndex]?.title}</h3>
        <p>{tracks[currentTrackIndex]?.artist}</p>
        <audio
          ref={audioRef}
          src={`http://localhost:3000${tracks[currentTrackIndex]?.src}`}
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
          aria-label="Progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        />
        <div>
          <span>{formatTime(audioRef.current ? audioRef.current.currentTime : 0)}</span>
          <span> / </span>
          <span>{duration > 0 ? formatTime(duration) : 'Loading...'}</span>
        </div>
        <div>
          <button onClick={prevTrack}>Previous</button>
          <button onClick={playPauseTrack}>{isPlaying ? 'Pause' : 'Play'}</button>
          <button onClick={nextTrack}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
