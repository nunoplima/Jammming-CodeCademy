import dotenv from "dotenv";
dotenv.config();

const clientId = `client_id=${process.env.REACT_APP_CLIENTID}`;

let accessToken = "";

const Spotify = {
  getAccessToken: () => {
    const redirectUri = "redirect_uri=http:%2F%2Flocalhost:3000";
    const url = "https://accounts.spotify.com/authorize?";
    const responseType = "response_type=token";
    const state = "state=123";
    const scope = "scope=playlist-modify-public";
    // get the current url and extract the query string
    const queryString = window.location.href.split("#")[1];
    // get the params from the query string
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("access_token");
    const expiresIn = urlParams.get("expires_in");
    // if the accessToken exists, return it
    if (accessToken.length > 0) {
      return accessToken;
    // if !accessToken and we have the query params
    } else if (token && expiresIn) {
      // make sure accessToken resolves to empty string after the chosen time interval
      window.setTimeout(() => accessToken = "", expiresIn * 1000);
      // make sure the url is cleared
      window.history.pushState({}, null, "/");
      accessToken = token;
      return accessToken
    // if none of the previous conditions is met, redirect to spotify login screen, with chosen scope and so on
    } else {
      // we could save the url to a const and: window.location = url
      window.location.replace(`${url}${clientId}&${redirectUri}&${scope}&${responseType}&${state}`);
    }
  },

  search: async (term, accessToken) => {
    try {
      const url = "https://api.spotify.com/v1/search?type=track&q=";
      const headers = { 
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      };
      const rawResponse = await fetch(`${url}${term}`, headers);
      const response = await rawResponse.json();
      if (response.hasOwnProperty("tracks")) {
        const tracksArr = response.tracks.items.map(track => {
          return { "ID": track.id, "Name": track.name, "Artist": track.artists[0].name, "Album": track.album.name, "URI": track.uri };
        });
        return tracksArr
      }
    } catch(error) {
      console.log(error.message);
    }
  },

  savePlaylist: async (playlistName, trackURIsArr) => {
    try {
      // GET USER ID
      const headers = {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      };
      const rawUser = await fetch("https://api.spotify.com/v1/me", headers);
      const user = await rawUser.json();
      const { id: userId } = user; 
      // CREATE NEW PLAYLIST WITHIN USER'S SPOTIFY ACCOUNT
      const options1st = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({name: `${playlistName}`})
      };
      const rawSpotifyPlaylist = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, options1st);
      const spotifyPlaylist = await rawSpotifyPlaylist.json();
      const { id: playlistId } = spotifyPlaylist;
      // POST the track URIs to the newly-created playlist
      const options2nd = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({"uris": trackURIsArr})
      };
      const rawSnapshotId = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, options2nd);
      const snapshotId = await rawSnapshotId.json();
      console.log("Successfully created new Spotify playlist with the following snapshot id: ", snapshotId.snapshot_id);
    } catch(error) {
      console.log(error.message);
    }
  },

  playSongPreview: async (songId) => {
    const headers = {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    };
    const rawPreview = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, headers);
    const preview = await rawPreview.json();
    const previewUrl = preview.preview_url;
    const audio = new Audio(previewUrl);
    return audio
  }
}  

export default Spotify;

