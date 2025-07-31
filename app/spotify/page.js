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

    return (
        <div data-theme="synthwave" className="min-h-screen p-8">
            <div className="flex justify-between items-center mt-6 mb-10">
                <h1 className="text-3xl font-bold text-primary font-extrabold">
                    Book Soundtrack Generator
                    <div className="badge badge-secondary ml-4">Spotify Integration</div>
                </h1>
            </div>
    
            {error && (
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            )}
    
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Choose Your Book</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map(book => (
                        <button
                            key={book.id}
                            onClick={() => handleBookSelect(book)}
                            className={`flex flex-col p-4 border rounded-lg text-left transition-all shadow-md hover:shadow-lg
                                ${selectedBook?.id === book.id 
                                    ? 'border-primary bg-base-200 ring-2 ring-primary' 
                                    : 'hover:bg-base-200'}`}
                        >
                            <h3 className="font-medium">{book.name}</h3>
                            <p className="text-sm opacity-70 mt-1">By {book.author}</p>
                        </button>
                    ))}
                </div>
            </div>
    
            {selectedBook && (
                <div className="card bg-base-200 shadow-xl mt-8 p-6">
                    <div className="card-body">
                        <h2 className="card-title">How you feelin?</h2>
                        
                        <div className="space-y-4 mt-4">
                            <div>
                                <div className="flex justify-between">
                                    <label htmlFor="valence" className="text-sm font-medium">
                                        Valence: {valence || 0.5}
                                    </label>
                                    <span className="text-sm">{valence || 0.5}</span>
                                </div>
                                <input
                                    type="range"
                                    id="valence"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={valence || 0.5}
                                    onChange={(e) => setValence(e.target.value)}
                                    className="range range-primary w-full"
                                />
                                <div className="flex justify-between text-xs opacity-70">
                                    <span>Melancholic</span>
                                    <span>Upbeat</span>
                                </div>
                            </div>
        
                            <div>
                                <div className="flex justify-between">
                                    <label htmlFor="energy" className="text-sm font-medium">
                                        Energy: {energy || 0.5}
                                    </label>
                                    <span className="text-sm">{energy || 0.5}</span>
                                </div>
                                <input
                                    type="range"
                                    id="energy"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={energy || 0.5}
                                    onChange={(e) => setEnergy(e.target.value)}
                                    className="range range-primary w-full"
                                />
                                <div className="flex justify-between text-xs opacity-70">
                                    <span>Calm</span>
                                    <span>Energetic</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-actions justify-end mt-4">
                            <button
                                onClick={handleFindPlaylists}
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Finding...
                                    </>
                                ) : "Find Playlists"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="loading loading-spinner text-primary"></div>
                    <span className="ml-3">Finding playlists...</span>
                </div>
            ) : recommendations.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">
                        Reading Playlists for "{selectedBook?.name}"
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendations.filter(playlist => playlist != null).map((playlist, index) => (
                            <div 
                                key={playlist.id}
                                className={`flex items-center gap-4 p-4 bg-base-100 border rounded-lg shadow-md hover:shadow-lg transition-shadow
                                    ${index < 3 ? 'border-yellow-400' : ''}`}
                            >
                                {playlist.images?.[0] && (
                                    <img 
                                        src={playlist.images[0].url}
                                        alt=""
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-start">
                                        <a 
                                            href={playlist.external_urls.spotify}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium link link-primary hover:link-hover"
                                        >
                                            <h3 className="truncate">{playlist.name}</h3>
                                        </a>
                                        {index < 3 && (
                                            <span className="badge badge-warning">
                                                Top Pick
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm opacity-70 truncate">
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