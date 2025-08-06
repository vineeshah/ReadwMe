export default async function spotifySearch(data) {
  const { valence, energy, name: bookname, author } = data;

  try {
    const response = await fetch('/api/groq/spotifySearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: bookname,
        author,
        valence,
        energy
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const { keywords } = await response.json();
    console.log("keywords", keywords);
    return keywords;
  } catch (error) {
    console.error("Error getting keywords:", error);
    return false;
  }
}