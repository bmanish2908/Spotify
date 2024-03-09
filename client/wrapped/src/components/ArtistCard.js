import React from "react"

export default function ArtistCard(props){
    return (
        <div className="artist-card">
            <div className="artist-img-block">
                <img className="artist-image" src={props.img} alt = ""></img>
            </div>

            <div className="artist-info-block">
                
                <div><h4 className="artist-name">{props.name}</h4></div>
                <div><p className="artist-popularity">Popularity: {props.popularity}</p></div>
                <div><a className="artist-open-in-spotify" target="_blank" rel="noreferrer" href={props.url}>Open In Spotify</a></div>
            </div>
        </div>
    )
}