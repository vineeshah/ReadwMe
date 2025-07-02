"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Spotify(){
    const {data:session} = useSession()
    const [accessToken, setAccessToken] = useState("")
    const userId = session?.user?.id
    const spotifyTokenExpiry = session?.user?.spotifyTokenExpiry;
    // /api/spotify/refresh/route
   
    useEffect(() => {
        const refresh_token = async() =>{
            const current_time = new Date()
            const expiryTime = new Date(spotifyTokenExpiry);
            if(current_time>=expiryTime){
                console.log("Spotify token has expired. Refreshing...");
                try{
                    const response = await fetch("/api/spotify/refresh",{
                        method: "POST",
                        headers:{'Content-Type': 'application/json'},
                        body: JSON.stringify({"userId":userId})
                    })
                    const data = await response.json()
                    setAccessToken(data.accessToken)
                    // console.log("fetched successfuly!!", accessToken)
                }catch(e){
                    console.log("error in the post request for refreshing: ", e)
                }
                setAccessToken() 
            }else{
                console.log("refresh time hasnt been reached yet!")
                setAccessToken(session?.user?.spotifyToken)
            }
            
        };
        refresh_token()
        
    },[spotifyTokenExpiry, session?.user?.spotifyToken])

    async function getSpotifyRecommendations(accessToken, seedArtists, seedTracks, seedGenres) {
        const endpoint = 'https://api.spotify.com/v1/recommendations';
      
        const params = new URLSearchParams({
          seed_artists: seedArtists.join(','), // Comma-separated artist IDs
          seed_tracks: seedTracks.join(','),  // Comma-separated track IDs
          seed_genres: seedGenres.join(','),  // Comma-separated genre strings
          limit: '10',                        // Number of recommendations
        });
      
        const response = await fetch(`${endpoint}?${params.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass the user's access token
          },
        });
      
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }
      
        const data = await response.json();
        return data.tracks; // Returns an array of recommended tracks
      }



    return (
        <div>
            <h1>Spotify Integration</h1>
            {accessToken ? (
                <p>Spotify token is valid: {accessToken}</p>
            ) : (
                <p>Checking Spotify token status...</p>
            )}
        </div>
    );
}