import prisma from '@/app/config/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


export async function POST(req) {
  
    // const session = await getServerSession(authOptions)

  try {
    const { userId } = await req.json(); 
    // Fetch the user's refresh token from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { spotifyRefreshToken: true },
    });
    if (!user || !user.spotifyRefreshToken) {
      throw new Error('No refresh token found for the user.');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotifyRefreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const data = await response.json();

    if (!data.access_token) {
      throw new Error('Failed to refresh Spotify token.');
    }

    const expiresIn = data.expires_in; 
    const expiryDate = new Date(Date.now() + expiresIn * 1000); 


    // Update the user's access token in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
            spotifyToken: data.access_token,
            spotifyTokenExpiry: expiryDate,
        },
    });

    return NextResponse.json({ accessToken: data.access_token });
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    throw error;
  }
}