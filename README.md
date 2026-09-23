# ReadWMe

This project is a modular backend and real-time communication system that powers an AI-enhanced book platform. Designed to deliver rich metadata, intelligent Q&A, and seamless community interaction, readwme brings together modern AI and scalable infrastructure to elevate the reader’s digital experience.

## Features:
- Smart book recommendations using both a custom-built algorithm and AI-driven personalization
- Spotify playlist generation based on your reading taste and listening habits
- RAG-based AI summarizer for contextual book insights and Q&A
- Real-time chatrooms powered by Socket.IO for live community interaction
- Integrated Reddit hub delivering the latest pop culture and book-related trends

## Technologies Used:
- NextJs (Backend)
- Reactjs(Frontend)
- Socket.IO(Chatroom)
- Langchain
- Pupeteer
- Postgresql (Database)
- Tailwindcss(Styling)
- Custom mathematical formulas for personal recommendation algorithm.

## Getting Started:
1. Clone the repository.
2. Set up your environment with the necessary dependencies.
3. Run the app npm run dev!

## API: Book search & pagination

- `GET /api/requests/search?q=<text>&sort=<column>` — case-insensitive search across book names and authors (max 50 results).
- `GET /api/messages?bookName=<name>&page=<n>&limit=<n>` — chat messages are now paginated. Response includes `page`, `total` and `hasMore`.
- `DELETE /api/requests?id=<bookId>` — book id may now be passed as a query param.
- `POST /api/summariser` is rate limited to 5 requests/minute per IP and caches identical prompts.
