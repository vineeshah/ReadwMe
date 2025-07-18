"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import spotifySearch from "../components/spotifySearch";

export default function Spotify(){
    const {data:session} = useSession()
    const [accessToken, setAccessToken] = useState("")
    const [recommendations, setRecommendations] = useState([]);
    const [books, setBooks] = useState([])
    const [selectedBook, setSelectedBook] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [topTracks, setTopTracks] = useState([]);
    // const [topArtists, setTopArtists] = useState([]);
    // const[currentBookGenres, setCurrentBookGenres] = useState([])
    const[valence, setValence] = useState("")
    const[energy, setEnergy] = useState("")
    const userId = session?.user?.id
    const spotifyTokenExpiry = session?.user?.spotifyTokenExpiry;
    // /api/spotify/refresh/route
   
    useEffect(() => {
        const refresh_token = async() =>{
            const current_time = new Date()
            const expiryTime = spotifyTokenExpiry;
            // console.log("expiryTime", expiryTime)
            if(current_time>=expiryTime){
                console.log("Spotify token has expired. Refreshing...");
                try{
                    const response = await fetch("/api/spotify/refresh",{
                        method: "POST",
                        headers:{'Content-Type': 'application/json'},
                        body: JSON.stringify({"userId":userId})
                    })
                    const data = await response.json() //avoid 429 for grok - too many requests, add checks maybe
                    setAccessToken(data.accessToken)
                    console.log("fetched successfuly!!", accessToken)
                }catch(e){
                    console.log("error in the post request for refreshing: ", e)
                }
                // setAccessToken() 
            }else{
                console.log("refresh time hasnt been reached yet!")
                setAccessToken(session?.user?.spotifyToken)
            }
            console.log("accesstoken set here", accessToken)
            
        };
        refresh_token();
    },[spotifyTokenExpiry, session?.user?.spotifyToken])

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const r = await fetch("/api/requests");
                const d = await r.json();
                setBooks(d);
            } catch (err) {
                setError(err.message);
            }
        };
    
        fetchBooks();
    }, []);

    const handleBookSelect = async (book) => {
        setSelectedBook(book);
        setValence(0.5);
        setEnergy(0.5);
    }
    const handleFindPlaylists = async () => {
        if (!selectedBook) return;
        setIsLoading(true);
        try {
            const keywords = await spotifySearch({
                valence,
                energy,
                name: selectedBook.name,
                author: selectedBook.author
            })
            handleSearch(keywords);
        } catch (error) {
            console.error("Error getting spotify keywords:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     const fetchSpotifyData = async() => {
    //         if (accessToken) {
    //             getUserTopTracks();
    //             getUserTopArtists();
    //         }else{
    //              console.log("access token problem!!", accessToken)
    //         }
    //     }
    //     fetchSpotifyData();
        
    // }, [accessToken]);

    async function handleSearch(keywords){
        try{
            const searchParams = [
                selectedBook.name,
                ...keywords, //Spreads the keywords array 
            ];
            const query2 = searchParams.join(' ');
            const query = `${keywords.join(' ')}`;

            const urls = [
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=3`,
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(selectedBook.name)}&type=playlist&limit=3`,
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query2)}&type=playlist&limit=3`,
                
                
                
            ];
            
            const responses = await Promise.all(//runs them all in parallel
                urls.map(url => 
                    fetch(url, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    })
                )//returns an array of response objects
            );
            console.log("responses", responses)

            const results = await Promise.all(
                responses.map(async(res) => {//async cuz inside the function a lot of stuff is async so they need to be awaited first before returning
                    if (!res.ok) throw new Error(`API Error: ${res.status}`);
                    const data = await res.json();
                    return data.playlists.items;
                })
            )
            console.log("results", results)

            const allPlaylists = results.flat().filter(Boolean);//combines an array of arrays into a single array and then filter(Boolean) removes aLL NULL ITEMS BEcause boolean(null) is false and filter removes false items
            const uniquePlaylists = [...new Map(
                allPlaylists.map(playlist => [playlist.id, playlist])
            ).values()];
            setRecommendations(uniquePlaylists)
    }catch(error){
            console.error('Search error:', error);
            setError('Failed to fetch playlists');
        }
        
    }

    // async function getUserTopTracks() {
    //     try {
    //         const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`
    //             }
    //         });
            
    //         if (!response.ok) {
    //             throw new Error(`Failed to fetch top tracks: ${response.status}`);
    //         }
            
    //         const data = await response.json();
    //         setTopTracks(data.items);
    //     } catch (error) {
    //         console.error("Error fetching top tracks:", error);
    //     }
    // }

    // async function getUserTopArtists() {
    //     try {
    //         const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`
    //             }
    //         });
            
    //         if (!response.ok) {
    //             throw new Error(`Failed to fetch top artists: ${response.status}`);
    //         }
            
    //         const data = await response.json();
    //         setTopArtists(data.items);
    //     } catch (error) {
    //         console.error("Error fetching top tracks:", error);
    //     }
    // }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Book Soundtrack Generator</h1>
    
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                </div>
            )}
    
            
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Choose Your Book</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map(book => (
                        <button
                            key={book.id}
                            onClick={() => handleBookSelect(book)}
                            className={`flex flex-col p-4 border rounded-lg text-left transition-all
                                ${selectedBook?.id === book.id 
                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                    : 'hover:bg-gray-50'}`}
                        >
                            <h3 className="font-medium">{book.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">By {book.author}</p>
                        </button>
                    ))}
                </div>
            </div>
    
            
            {selectedBook && (
                <div className="p-6 bg-gray-50 rounded-lg space-y-6">
                    <h2 className="text-lg font-medium text-gray-700">How you feelin?</h2>
                    
                    
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label htmlFor="valence" className="text-sm font-medium text-gray-600">
                                Valence
                            </label>
                            <span className="text-sm text-gray-500">{valence || 0.5}</span>
                        </div>
                        <input
                            type="range"
                            id="valence"
                            min="0"
                            max="1"
                            step="0.1"
                            value={valence || 0.5}
                            onChange={(e) => setValence(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Melancholic</span>
                            <span>Upbeat</span>
                        </div>
                    </div>
    
                    
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label htmlFor="energy" className="text-sm font-medium text-gray-600">
                                Energy
                            </label>
                            <span className="text-sm text-gray-500">{energy || 0.5}</span>
                        </div>
                        <input
                            type="range"
                            id="energy"
                            min="0"
                            max="1"
                            step="0.1"
                            value={energy || 0.5}
                            onChange={(e) => setEnergy(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Calm</span>
                            <span>Energetic</span>
                        </div>
                    </div>
                    <button
                        onClick={handleFindPlaylists}
                        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Find Playlists
                    </button>
                </div>
            )}
    
            
            {isLoading ? (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Finding playlists...</span>
            </div>
        ) : recommendations.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">
                    Reading Playlists for "{selectedBook?.name}"
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.filter(playlist => playlist != null).map(playlist => (
                        <div 
                            key={playlist.id}
                            className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                        >
                             {playlist.images?.[0] && (
                                 <img 
                                    src={playlist.images[0].url}
                                    alt=""
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                            )}
                            <div className="min-w-0 flex-1">
                                <a 
                                    href={playlist.external_urls.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                <h3 className="truncate">{playlist.name}</h3>
                                </a>
                                <p className="text-sm text-gray-500 truncate">
                                    {playlist.tracks.total} tracks • By {playlist.owner.display_name}
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