import { NextResponse } from 'next/server';

export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_CALLBACK_URL;
  const scope = 'user-read-private user-read-email user-top-read';

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', client_id);
//   console.log(client_id)
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('redirect_uri', redirect_uri);

  return NextResponse.redirect(authUrl.toString());
}
