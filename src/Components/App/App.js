import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";

import play from "./play.png";
import pause from "./pause.png";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      searchResults: [],
      playlistTracks: [], 
      playlistName: "New Playlist",
      isPlaying: false, 
      audio: null
    }
  }

  addTrack = (songObj) => {
    const { playlistTracks } = this.state;
    const idx = playlistTracks.findIndex(track => track.ID === songObj.ID);
    if (idx === -1) {
      this.setState({
        playlistTracks: [ ...playlistTracks, songObj ]
      })
    }
  };

  removeTrack = (songObj) => {
    const { playlistTracks } = this.state;
    this.setState({
      playlistTracks: playlistTracks.filter(track => track.ID !== songObj.ID)
    })
  };

  updatePlaylistName = (playlistName) => {
    this.setState({
      playlistName: playlistName
    })
  };

  savePlaylist = () => {
    const { playlistTracks, playlistName } = this.state;
    if (playlistTracks.length > 0 && playlistName !== "New Playlist") {
      const trackURIsArr = playlistTracks.map(track => track.URI);
      Spotify.savePlaylist(playlistName, trackURIsArr);
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []  
      })
    } else {
      alert("Is your playlist empty or nameless?");
    }
  };

  search = (term) => {
    return this.setState({ term: term });
  }

  spotifyReq = async () => {
    const accessToken = await Spotify.getAccessToken();
    if (accessToken && this.state.term) {
      const trackArr = await Spotify.search(this.state.term, accessToken);
      const playlist = this.state.playlistTracks;
      // Array.includes compares by object identity, checks if the items are references to the same object, so...
      const filteredSearchResults = trackArr.filter(track => {
        return !JSON.stringify(playlist).includes(JSON.stringify(track))
      });
      this.setState({
        searchResults: filteredSearchResults
      })
    }
  };
  
  spotifyReqKeyPress = (e) => {
    if (e.nativeEvent.key === "Enter") {
      return this.spotifyReq();
    } 
  }

  songPreview = async (trackId, button) => {
    if (!this.state.isPlaying) {
      const audio = await Spotify.playSongPreview(trackId);
      await audio.play();
      button.src = pause;
      this.setState({ isPlaying: trackId, audio: audio });
      setTimeout(() => {
        this.setState({ isPlaying: false, audio: null });
        button.src = play;
      }, audio.duration * 1000 + 1000);
    } else if (button.src === pause) {
      const { audio } = this.state;
      audio.pause();
      button.src = play;
      this.setState({ isPlaying: false, audio: null });
    }
  }

  componentDidMount = () => {
    const loading = document.getElementById("loading");
    loading.style.display = "none";
  }

  render() {
    return (
      <div onKeyPress={this.spotifyReqKeyPress}>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} onSpotifyReq={this.spotifyReq} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
              onPlay={this.songPreview}
            /> 
            <Playlist playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} 
              playlistName={this.state.playlistName}
              onSave={this.savePlaylist}
              onPlay={this.songPreview}
            />
          </div>
        </div>
      </div>
    );
  }  
}

export default App;
