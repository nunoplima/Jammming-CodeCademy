import React, { Component } from "react";
import "./SearchBar.css";

class SearchBar extends Component {
  handleTermChange = (e) => {
    this.props.onSearch(e.target.value);
  }

  handleSearchClick = (e) => {
    this.props.onSpotifyReq(e);
  }
  
  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <button className="SearchButton" onClick={this.handleSearchClick}>SEARCH</button>
      </div>
    )
  }
}

export default SearchBar;