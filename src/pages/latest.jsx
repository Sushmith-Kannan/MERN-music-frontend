import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SongList({ playTrack, setTracks, tracks }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tracks');
        setTracks(response.data);
        setFilteredTracks(response.data); 
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };

    fetchTracks();
  }, [setTracks]);

  useEffect(() => {

    const filtered = tracks.filter(track =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTracks(filtered);
  }, [searchQuery, tracks]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!tracks.length) {
    return <p>Loading tracks...</p>;
  }

  return (
    <div className="py-20 h-screen bg-gray-300 px-2">
      <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex">
          <div className="w-full p-3">
            <div className="relative">
              <i className="absolute fa fa-search text-gray-400 top-5 left-4"></i>
              <input
                type="text"
                placeholder="Search by title or artist..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-white h-14 w-full px-12 rounded-lg focus:outline-none hover:cursor-pointer"
              />
              <span className="absolute top-4 right-5 border-l pl-4">
                <i className="fa fa-microphone text-gray-500 hover:text-green-500 hover:cursor-pointer"></i>
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-center mt-4 mb-2">Song List</h2>
        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
              <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">Title</th>
              <th className="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">Artist</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {filteredTracks.map((track, index) => (
              <tr key={index} className="bg-gray-300 border border-grey-500 md:border-none block md:table-row" onClick={() => playTrack(index)}>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">{track.title}</td>
                <td className="p-2 md:border md:border-grey-500 text-left block md:table-cell">{track.artist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SongList;
