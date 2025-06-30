import prisma from '@/app/config/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function refreshSpotifyToken(userId) {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
  try {
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

    // Update the user's access token in the database
    await prisma.user.update({
      where: { id: userId },
      data: { spotifyToken: data.access_token },
    });

    return data.access_token;
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    throw error;
  }
}