import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

class Playlist extends React.Component {

  handleNameChange = (e) => {
    const { value } = e.target;
    this.props.onNameChange(value);
  };

  render() {
    const { playlistName, playlistTracks, onRemove, onPlay, onSave } = this.props;
    return (
      <div className="Playlist">
        <input value={playlistName} onChange={this.handleNameChange} />    
        <TrackList 
          tracks={playlistTracks} 
          isRemoval={true} 
          onRemove={onRemove} 
          onPlay={onPlay}  
          isPlaylist={true}
        />
        <button className="Playlist-save" onClick={onSave}>SAVE TO SPOTIFY</button>
      </div>
    )
  }
}

export default Playlist;