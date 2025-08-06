export default async function validbook(data) {
  const { name, author } = data;

  if (!name || !author) {
    console.error("Missing title or author");
    return false;
  }

  try {
    const response = await fetch('/api/groq/bookVal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, author })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const { isValid } = await response.json();
    return isValid;
  } catch (error) {
    console.error("Error validating book:", error);
    return false;
  }
}