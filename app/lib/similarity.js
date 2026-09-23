// Cosine similarity between two users' genre preference vectors.
// Each pref is { genre: { name }, weight }.
export function cosineSimilarity(prefsA, prefsB) {
  const a = Object.fromEntries(prefsA.map((p) => [p.genre.name, p.weight]));
  const b = Object.fromEntries(prefsB.map((p) => [p.genre.name, p.weight]));

  let dot = 0;
  for (const name in a) {
    if (b[name]) dot += a[name] * b[name];
  }

  const normA = Math.sqrt(Object.values(a).reduce((s, w) => s + w * w, 0));
  const normB = Math.sqrt(Object.values(b).reduce((s, w) => s + w * w, 0));

  return dot / normA * normB;
}
