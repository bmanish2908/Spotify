import React from "react"

export default function TrackCard(props){

    return (
        <div className="track-card">
            <div className="track-img-block">
                <img className="track-image" src={props.img} alt = ""></img>
            </div>

            <div className="track-info-block">
                <h4 className="track-name">{props.name}</h4>
                <p className="track-artist-name">Artist: {props.artistName}</p>
                <p className="track-album-name">Album: {props.albumName}</p>
                <a className="track-open-in-spotify" target="_blank" href={props.url} rel="noreferrer">Open In Spotify</a>
            </div>
        </div>
    )
}