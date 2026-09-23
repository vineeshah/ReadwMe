// Normalises book titles / author names into "Title Case" so lookups
// match regardless of accents, casing, or separator characters.
export function toTitleCase(input) {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .split(/[\s\-_/]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Used for chatroom keys: "The Hobbit!" -> "thehobbit"
export function toRoomKey(input) {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}
