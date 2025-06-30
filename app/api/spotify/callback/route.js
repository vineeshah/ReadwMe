import { NextResponse } from 'next/server';
import prisma from '@/app/config/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getToken } from 'next-auth/jwt';

export async function GET(req) {
  const code = req.nextUrl.searchParams.get('code');
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_CALLBACK_URL;
//   const session = await getServerSession(authOptions)
  const token = await getToken({ req, secret: authOptions.secret });
  console.log("TOKEN", token);
  
  const userId = token.sub;
  console.log("userId:", userId)
  
//   console.log('Request Headers:', req.headers);

//   console.log(client_id)

//   if (!session || !session.user) {
//     return NextResponse.redirect("/auth/login");
//   }


  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri,
    client_id,
    client_secret,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json();

    const expiresIn = data.expires_in; 
    const expiryDate = new Date(Date.now() + expiresIn * 1000); 

    await prisma.user.update({
    where: { id: userId },
    data: {
        spotifyToken: data.access_token,
        spotifyRefreshToken: data.refresh_token,
        spotifyTokenExpiry: expiryDate, 
    },
    });

  return NextResponse.redirect("/");
}
