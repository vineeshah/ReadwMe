"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Spotify(){
    const {data:session} = useSession()
    const [accessToken, setAccessToken] = useState("")
    const [recommendations, setRecommendations] = useState([]);
    const [books, setBooks] = useState([])
    const [selectedBook, setSelectedBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
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
                // setAccessToken() 
            }else{
                console.log("refresh time hasnt been reached yet!")
                setAccessToken(session?.user?.spotifyToken)
            }
            
        };
        async function fetchBooks() {
            try {
              const r = await fetch("/api/requests", { 
                method: "GET",
              }); 
              const d = await r.json();
              setBooks(d);
            } catch (err) {
              setError(err.message);
            }
        };
        fetchBooks()
        refresh_token()
        
    },[spotifyTokenExpiry, session?.user?.spotifyToken])

    const handleBookSelect = async (book) => {
        setSelectedBook(book);
        setIsLoading(true);
        
        try {
            
            // const seedGenres = book.genres[0]?.genre?.name || 'pop'
            const seedTracks = topTracks.slice(0, 2).map(track => track.id);
            const seedArtists = topArtists.slice(0, 2).map(artist => artist.id);

            //fixes: allow more seeds and make it flexible according to what the user would like more
            //the genres need to be converted from book genres to music genres maybe use grok
            //if using the genre list they will be separated by spaces, use urlencoding for that
            //use fallbacks for general recs 

            //most importanty fix the access token problems

            // console.log("seedArtists", seedArtists)

            const recommendations = await getSpotifyRecommendations(
                accessToken,
                seedArtists,
                seedTracks,
                // seedGenres
            );
            
            setRecommendations(recommendations);
        } catch (error) {
            console.error("Error getting recommendations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            getUserTopTracks();
            getUserTopArtists();
        }else{
             console.log("access token problem!!")
        }
    }, [accessToken]);

    async function getUserTopTracks() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch top tracks: ${response.status}`);
            }
            
            const data = await response.json();
            setTopTracks(data.items);
        } catch (error) {
            console.error("Error fetching top tracks:", error);
        }
    }
    async function getUserTopArtists() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch top artists: ${response.status}`);
            }
            
            const data = await response.json();
            setTopArtists(data.items);
        } catch (error) {
            console.error("Error fetching top tracks:", error);
        }
    }

    async function getSpotifyRecommendations(accessToken, seedArtists, seedTracks, seedGenres) {
        // const endpoint = 'https://api.spotify.com/v1/recommendations';
      
        // const params = new URLSearchParams({
        //   seed_artists: seedArtists.join(','), 
        //   seed_tracks: seedTracks.join(','),  
        // //   seed_genres: seedGenres.join(','),  
        //   limit: '10',                        
        // });
      
        // const response = await fetch(`${endpoint}?${params.toString()}`, {
        //   method: 'GET',
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`, 
        //   },
        // });

        const response = await fetch('https://api.spotify.com/v1/recommendations?' + new URLSearchParams({
            seed_artists: '4Z8W4fKeB5YxbusRsdQVPb,0k17h0D3J5VfsdmQ1iZtE9',
            seed_tracks: '4cOdK2wGLETKBW3PvgPWqT', 
            limit: '10'
          }), {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
      
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }
      
        const data = await response.json();
        return data.tracks; 
      }

      return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Spotify Music Recommendations</h1>

            {error && (
            <div className="text-red-500 p-4 mb-4 bg-red-50 rounded">
                Error: {error}
            </div>
            )}
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Select a Book</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map(book => (
                        <button
                            key={book.id}
                            onClick={() => handleBookSelect(book)}
                            className={`p-4 border rounded-lg text-left transition-all
                                ${selectedBook?.id === book.id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'hover:border-gray-300'}`}
                        >
                            <h3 className="font-semibold">{book.name}</h3>
                            <p className="text-sm text-gray-600">By {book.author}</p>
                            {book.genres && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {book.genres.map((genre, idx) => (
                                        <span 
                                            key={idx}
                                            className="text-xs bg-gray-100 px-2 py-1 rounded"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-4">Loading recommendations...</div>
            ) : recommendations.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Recommended Tracks Based on "{selectedBook?.name}"
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.map(track => (
                            <div 
                                key={track.id}
                                className="flex items-center gap-4 p-4 border rounded-lg"
                            >
                                {track.album.images[0] && (
                                    <img 
                                        src={track.album.images[0].url}
                                        alt={track.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                )}
                                <div>
                                    <h3 className="font-semibold">{track.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {track.artists.map(a => a.name).join(', ')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}