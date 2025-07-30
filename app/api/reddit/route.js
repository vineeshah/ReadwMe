import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    if (!q) {
        return res.status(400).json({ error: 'Missing query parameter ?q=' })
    }
    try {
        const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(`${q} book`)}&sort=relevance&t=all&limit=10`);
        if (!res.ok) {
            throw new Error(`Reddit API returned ${res.status}`);
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Reddit API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}