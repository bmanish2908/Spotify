import React from "react";
import ArtistCard from "./components/ArtistCard";
import TrackCard from "./components/TrackCard";

export default function App() {

  const[token, setToken] = React.useState("");
  const[isSignedIn, setIsSignedIn] = React.useState(false);
  const[userName, setUserName] = React.useState("");
  const[welcomeMessage, setWelcomeMessage] = React.useState("");
  const[timeFrame, setTimeFrame] = React.useState("");
  const[searchTime, setSearchTime] = React.useState("short_term");

  const[topTracks, setTopTracks] = React.useState();
  const[topArtists, setTopArtists] = React.useState();

  const[topFiveArtists, setTopFiveArtists] = React.useState();
  const[topFiveTracks, setTopFiveTracks] = React.useState();

  React.useEffect(() => {
    if(timeFrame === "4 Weeks") {
      setSearchTime("short_term");
    }

    else if (timeFrame === "6 Months"){
      setSearchTime("medium_term");
    }

    else if (timeFrame === "All Time"){
      setSearchTime("long_term");
    }
  }, [timeFrame])


  React.useEffect(() => {

    if (isSignedIn) {

      const trackEndpoint = `https://api.spotify.com/v1/me/top/tracks?time_range=${searchTime}`;
      fetch(trackEndpoint, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(res => res.json())
      .then(data => setTopTracks(data.items))
      .catch(error => console.log(error));

      const artistEndpoint = `https://api.spotify.com/v1/me/top/artists?time_range=${searchTime}`;
      fetch(artistEndpoint, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(res => res.json())
      .then(data => setTopArtists(data.items))
      .catch(error => console.log(error));

    }
  }, [searchTime, token, isSignedIn])



  React.useEffect(() => {

    if(!isSignedIn){
      setWelcomeMessage(`!`);
    }

    else setWelcomeMessage(` ${userName}!`)
  }, [userName, isSignedIn]);  
  

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const newToken = params.get("token");

    if(newToken){
      setToken(newToken);
      setIsSignedIn(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

  }, [token])
  

  function signInWithSpotify() {
    window.location.href = "http://127.0.0.1:5000/login";
  }

  React.useEffect(() => {
    if(isSignedIn){
         
      fetch("https://api.spotify.com/v1/me", {
        method: "GET", 
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(res => res.json())
      .then(data => {
        setUserName(data.display_name);
      })
      .catch(error => console.log(error));
    }
  }, [userName, isSignedIn, token])


  const signInButton = (
    <button className="sign-in-button" onClick = {signInWithSpotify}>Sign In With Spotify</button>
  )

  function handleChange(event){
    setTimeFrame(event.target.value);
  }

  const infoDiv = (
    <div>
      <select 
        className = "dropdown-menu"
        value = {timeFrame}
        onChange = {handleChange}
      >
        <option>-- Choose Time --</option>
        <option>4 Weeks</option>
        <option>6 Months</option>
        <option>All Time</option>
      </select>
    </div>
  )

  React.useEffect(() => {

    if(topArtists && topTracks) {

      const artistArray = topArtists.slice(0, 5);
      const trackArray = topTracks.slice(0, 5);

      const artistElements = artistArray.map((artist) => (
        <ArtistCard 
          key = {artist.name}
          name = {artist.name}
          followers = {artist.followers.total}
          popularity = {artist.popularity}
          url = {artist.external_urls.spotify}
          img = {artist.images[2].url}
        />
      ));

      const trackElements = trackArray.map((track) => (
        <TrackCard 
          key = {track.name}
          name = {track.name}
          artistName = {track.artists[0].name}
          albumName = {track.album.name}
          url = {track.external_urls.spotify}
          img = {track.album.images[1].url}
          
        />
      ));

      const topFiveArtists = (
        <div>
          <h2 className="section-heading">Your <span style={{ color: "white" }}>TOP 5</span> Artists:</h2>
          {artistElements}
        </div>
      )

      const topFiveTracks = (
        <div>
          <h2 className="section-heading">Your <span style={{ color: "white" }}>TOP 5</span> Tracks:</h2>
          {trackElements}
        </div>
      )

      setTopFiveArtists(topFiveArtists);
      setTopFiveTracks(topFiveTracks);
      
    }
  }, [topArtists, topTracks]);

  const style = isSignedIn ? { color: "#1ED760" } : { color: "white" };

  return (
    <div className="all-content">
      <div className="header">
        <h1 className="welcome-message">Welcome To Your Wrapped<span className="last-word" style={style}>{welcomeMessage}</span></h1>
      </div>

      <div className="both-sections">
        <div className="artists-section">
          {topFiveArtists}
        </div>

        <div className="tracks-section">
          {topFiveTracks}
        </div>
      </div>

      
      <div className="button-drop-down">
        {isSignedIn ? infoDiv : signInButton}
      </div>

    </div>
  )
}