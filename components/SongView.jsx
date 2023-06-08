import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";

const SongView = ({
  sno,
  track,
  setGlobalCurrentSongId,
  setGlobalIsTrackPlaying,
  setView,
  setGlobalArtistId,
}) => {
  const { data: session } = useSession();
  const [hover, setHover] = useState(false);

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

  function millisecondsToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);

    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function selectArtist(artist) {
    setView("artist");
    setGlobalArtistId(artist.id);
  }
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid grid-cols-2 text-gray-200 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-20 rounded-lg cursor-default"
    >
      <div className="flex items-center space-x-4">
        {hover ? (
          <button onClick={async () => await playSong(track)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <p className="w-5 ">{sno + 1}</p>
        )}
{track?.album?.images[0]?.url && <img src={track.album.images[0].url} alt="" className="h-10 w-10" />}
        <div>
          <p className="w-36 lg:w-64 truncate text-white text-base ">
            {track.name}
          </p>
          <p className="w-36 truncate">
            {track.artists.map((artist, i) => {
              return (
                <>
                  <span
                    className="hover:underline"
                    onClick={() => selectArtist(artist)}
                  >
                    {artist.name}
                  </span>
                  <span>{i != track.artists.length - 1 ? "," : null}</span>
                </>
              );
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 truncate hidden md:inline">{track.album.name}</p>
        <p>{millisecondsToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </div>
  );
};

export default SongView;
