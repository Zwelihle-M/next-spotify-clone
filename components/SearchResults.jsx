import { useSession } from "next-auth/react";

import React from "react";

const SearchResults = ({
  playlists,
  songs,
  artists,
  setView,
  setGlobalPlaylistId,
  setGlobalCurrentSongId,
  setGlobalIsTrackPlaying,
  setGlobalArtistId,
}) => {
  const { data: session } = useSession();

  async function playSong(track) {
    setGlobalCurrentSongId(track.id);
    setGlobalIsTrackPlaying(true);

    if (session && session.accessToken) {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            uris: [track.uri],
          }),
        }
      );

      console.log("on play", response.status);
    }
  }

  function selectPlaylist(playlist) {
    setView("playlist");
    setGlobalPlaylistId(playlist.id);
  }

  function selectArtist(artist) {
    setView("artist");
    setGlobalArtistId(artist.id);
  }

  function millisecondsToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);

    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  return (
    <div className="flex flex-col gap-8 px-8 h-screen ">
      {/* first row of the screen */}
      <div className="grid grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-xl">Top Result</h1>
          <div className="h-64 pr-8">
            <div
              onClick={() => selectPlaylist(playlists[0])}
              className="cursor-pointer relative group h-64 w-full bg-neutral-700 hover:bg-neutral-800 p-4 flex flex-col  gap-6 rounded-md transition duration-500"
            >
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500 shadow-2xl shadow-neutral-800  z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-600 bottom-6 group-hover:bottom-8 right-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-black"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {playlists && (
                <>
                  <img
                    src={playlists[0].images[0].url}
                    alt=""
                    className="h-28 w-28 rounded-full"
                  />
                  <p className="text-3xl  text-white truncate">
                    {playlists[0].name}
                  </p>
                  <p className="text-sm text-white">
                    By {playlists[0].owner.display_name}
                    <span className="rounded-full bg-neutral-600 text-white ml-4 py-2 px-3 text-xs">
                      Playlist
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-xl ">Top Songs</h1>

          <div className="flex flex-col ">
            {songs.slice(0, 4).map((song) => {
              return (
                <div
                  key={song.id}
                  className="cursor-defualt w-full h-16 px-4 rounded-md flex items-center gap-4 hover:bg-neutral-700"
                  onClick={() => playSong(song)}
                >
                  <img
                    src={song.album.images[0].url}
                    alt="song picture"
                    className="h-10 w-10 "
                  />

                  <div>
                    <p>{song.name}</p>
                    <p className="text-sm text-neutral-500">
                      {song.artists[0].name}
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-end">
                    <p className="text-sm text-neutral-500">
                      {millisecondsToMinutesAndSeconds(song.duration_ms)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4 ">
        <h1 className="text-xl text-white">Artists</h1>
        <div className="flex flex-wrap gap-4 ">
          {artists.slice(0, 4).map((artist) => {
            return (
              <div
                key={artist.id}
                className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4"
                onClick={() => selectArtist(artist)}
              >
                <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 shadow-2xl shadow-neutral-800  z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-600 top-[156px] group-hover:top-[148px] right-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-black"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <img
                  alt="playlist Image"
                  className="w-48 h-48 mb-4 rounded-full"
                  src={artist.images[0]?.url}
                />

                <p className="text-base text-white mb-1 w-48 truncate">
                  {artist.name}
                </p>
                <p className="text-sm text-neutral-400 mb-8 w-48 truncate">
                  Artist
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 mb-48">
        <h1 className="text-white">Playlists</h1>

        <div className="flex flex-wrap gap-4">
          {playlists.slice(0, 4).map((playlist) => {
            return (
              <div
                onClick={() => selectPlaylist(playlist)}
                key={playlist.id}
                className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4"
              >
                <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 shadow-2xl shadow-neutral-800  z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-600 top-[156px] group-hover:top-[148px] right-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                    />
                  </svg>
                </div>
                <img
                  alt="playlist Image"
                  className="w-48 h-48 mb-4"
                  src={playlist.images[0]?.url}
                />

                <p className="text-base text-white mb-1 w-48 truncate">
                  {playlist.name}
                </p>
                <p className="text-sm text-neutral-400 mb-8 w-48 truncate">
                  By {playlist.owner.display_name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
