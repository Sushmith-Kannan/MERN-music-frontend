import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MusicPlayer from './components/musicplayer';
import SongList from './pages/latest';
import Sidebar from './components/sidebar';
import Genres from './pages/genres';

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState([]);

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
  };

  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route
              path="/"
              element={
                <Outlet>
                  <Route
                    index
                    element={<SongList playTrack={playTrack} setTracks={setTracks} tracks={tracks} />}
                  />
                  {/* Define other nested routes within the Outlet */}
                </Outlet>
              }
            />
            <Route path="/tracks" element={<SongList playTrack={playTrack} setTracks={setTracks} tracks={tracks} />} />
            <Route path="/genres" element={<Genres />} />
          </Routes>
        </div>
        <div className="w-1/4 p-4">
          <MusicPlayer tracks={tracks} currentTrackIndex={currentTrackIndex} setCurrentTrackIndex={setCurrentTrackIndex} />
        </div>
      </div>
    </Router>
  );
}

export default App;
