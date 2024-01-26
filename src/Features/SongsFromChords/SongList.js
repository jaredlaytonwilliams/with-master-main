const SongList = ({ songs }) => {
    if (!Array.isArray(songs)) {
        return <div>No songs available.</div>;
      }
    return (
      <div>
        {songs.map((song, index) => (
          <div key={index}>
            <a href={song.url} target="_blank" rel="noopener noreferrer">
              {song.artist} - {song.song} ({song.section})
            </a>
          </div>
        ))}
      </div>
    );
  };
  
  export default SongList;