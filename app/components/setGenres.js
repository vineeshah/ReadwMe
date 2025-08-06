export default async function setGenres(data) {
  const { name, author } = data;

  if (!name || !author) {
    console.error("Missing required data for setGenres");
    return false;
  }

  try {
    const response = await fetch('/api/groq/setGenres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, author })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const { genreData } = await response.json();
    return genreData;
  } catch (error) {
    console.error("Error classifying genres:", error);
    return false;
  }
}