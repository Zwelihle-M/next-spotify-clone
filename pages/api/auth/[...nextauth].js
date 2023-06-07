import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import fetch from "node-fetch";

// Permissions for the user
const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-currently-playing",
  "user-modify-playback-state",
].join(", ");

const params = {
  scope: scopes,
};

const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams(params).toString();

  async function refreshAccessToken(token){
    // refresh the access token
    const params = new URLSearchParams()
    params.append("grand_type", "refresh_token")
    params.append("refresh_token", token.refreshToken)
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers:{
            'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
        },
        body: params
    })
    const data = await response.json()
    return {
      ...token,
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? token.refreshToken,
        accessTokenExpires: Date.now() + data.expires_in * 1000
    }

  }

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      authorization: "https://next-spotify-clone-rho.vercel.app/login"

      // LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        return token;
      }

      // access token is not expired

      if ( token.accessTokenExpires && Date.now() < token.accessTokenExpires * 1000) {
        return token;
      }


      //   token has expired just refreshhing
      return await refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
