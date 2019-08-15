import React from "react";
import "./Track.css";
import play from "../App/play.png";

class Track extends React.Component {
  
  addTrack = (e) => {
    this.props.onAdd(this.props.track);
  };
  
  removeTrack = (e) => {
    this.props.onRemove(this.props.track, e.target);
  };

  handlePlayClick = async (e) => {  
    e.preventDefault();
    const { ID: trackId } = this.props.track;
    return this.props.onPlay(trackId, e.target);
  }
  
  renderAction = () => {
    return this.props.isRemoval ? 
      (<button className="Track-action" onClick={this.removeTrack}>-</button>) 
      : 
      (<button className="Track-action" onClick={this.addTrack}>+</button>);
  };

  renderTrack = () => {
    return this.props.isPlaylist ? 
    null
    :
    <a href="@"><img src={play} height="30" width="30" onClick={this.handlePlayClick} alt="play"/></a>
  }
  
  render() {
    const { Name, Artist, Album } = this.props.track;

    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{Name}</h3>
          <p>{Artist} | {Album}</p>
        </div>
        {this.renderTrack()}
        {this.renderAction()}
      </div>
    )
  }
}

export default Track;