export default async function askGroq(data) {
  const { id, sim, books } = data;

  try {
    const response = await fetch('/api/groq/askGroq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        similarity: sim,
        books: books
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const { recommendations } = await response.json();
    return recommendations;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return false;
  }
}