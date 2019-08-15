import React, { Component } from "react";
import "./TrackList.css";
import Track from "../Track/Track";

class TrackList extends Component {
  render() {
    const { tracks, onAdd, isRemoval, onRemove, onPlay, isPlaylist } = this.props;
    
    return (
      <div className="TrackList">
        {tracks.map(track => {
          return (
            <Track key={track.ID} 
              track={track}
              onAdd={onAdd} 
              isRemoval={isRemoval} 
              onRemove={onRemove}
              onPlay={onPlay}  
              isPlaylist={isPlaylist}
            />
          )}    
        )}
      </div>
    )
  }
}

export default TrackList;
