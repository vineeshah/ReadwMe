/**
 * Request book recommendations from the Groq-backed `/api/groq/askGroq` route.
 *
 * @param {Object} data
 * @param {string|number} [data.id] - Caller-supplied identifier (currently unused server-side).
 * @param {number} data.sim - Similarity threshold forwarded to the model.
 * @param {Array<Object>} data.books - Candidate books used as context for the prompt.
 * @returns {Promise<Array<Object>|false>} Resolves with the recommendations array, or `false` if the request fails.
 */
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