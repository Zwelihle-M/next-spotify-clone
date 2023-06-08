import { signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { shuffle } from "lodash";
import SongView from "./SongView";

const colors = [
  "from-indigo-500",
  "from-red-500",
  "from-blue-500",
  "from-sky-500",
  "from-violet-500",
  "from-yellow-500",
  "from-orange-500",
  "from-rose-500",
  "from-purple-500",
];

const ArtistView = ({
  setView,
  globalArtistId,
  setGlobalArtistId,
  setGlobalCurrentSongId,
  setGlobalIsTrackPlaying,
}) => {
  const { data: session } = useSession();
  const [color, setColor] = useState(colors[0]);
  const [opacity, setOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [artistData, setArtistData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);

  function changeOpacity(scrollPos) {
    // scrollPos = 0 -> opacity = 0
    // scrollPos = 300 -> opacity = 1, textOpacity = 0
    // scrollPos = 310 -> opacity = 1, textOpacity = 1
    const offset = 300;
    const textOffset = 10;
    if (scrollPos < offset) {
      const newOpacity = 1 - (offset - scrollPos) / offset;
      setOpacity(newOpacity);
      setTextOpacity(0);
    } else {
      setOpacity(1);
      const delta = scrollPos - offset;
      const newTextOpacity = 1 - (textOffset - delta) / textOffset;
      setTextOpacity(newTextOpacity);
    }
  }

  async function getArtistData() {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${globalArtistId}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  }

  async function getTopTracks() {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${globalArtistId}/top-tracks?` +
        new URLSearchParams({ market: "ZA" }),
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.tracks;
  }

  async function getRelatedArtists() {
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${globalArtistId}/related-artists`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data.artists;
  }

  useEffect(() => {
    async function f() {
      if (session && session.accessToken) {
        setArtistData(await getArtistData());
        setTopTracks(await getTopTracks());
        setRelatedArtists(await getRelatedArtists());
      }
    }
    f();
  }, [session, globalArtistId]);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [globalArtistId]);

  return (
    <div className="text-white flex-grow h-screen">
      <header
        style={{ opacity: opacity }}
        className="text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-950 p-8 flex items-center font-bold"
      >
        <div style={{ opacity: textOpacity }} className="flex items-center">
          {artistData && (
            <img className="h-8 w-8 mr-6" src={artistData.images[0].url} />
          )}
          <p>{artistData?.name}</p>
        </div>
      </header>

      <div
        onScroll={(e) => changeOpacity(e.target.scrollTop)}
        className="relative -top-20 h-screen overflow-y-scroll scrollbar-hide bg-black"
      >
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}
        >
          {artistData && (
            <img
              className="h-44 w-44 rounded-full"
              src={artistData.images[0].url}
            />
          )}
          <div>
            <p className="text-sm font-bold">Artist</p>
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold">
              {artistData?.name}
            </h1>
          </div>
        </section>
        <div className="space-y-4">
          <h2 className="text-xl font-bold px-8">Top tracks</h2>
          <div className="text-white px-8 flex flex-col space-y-1 pb-6">
            {topTracks.slice(0, 5).map((track, i) => {
              // song component
              return (
                <SongView
                  setView={setView}
                  setGlobalArtistId={setGlobalArtistId}
                  setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                  setGlobalCurrentSongId={setGlobalCurrentSongId}
                  key={track.id}
                  sno={i}
                  track={track}
                />
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold px-8">Related artists</h2>
          <div className="flex flex-wrap gap-4 px-8 pb-28">
            {relatedArtists.slice(0, 4).map((artist) => {
              return (
                <div
                  onClick={() => setGlobalArtistId(artist.id)}
                  key={artist.id}
                  className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4"
                >
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[148px] right-6">
                    <span>
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
                    </span>
                  </div>
                  <img
                    className="w-48 h-48 mb-4 rounded-full"
                    src={artist.images[0].url}
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
      </div>
    </div>
  );
};

export default ArtistView;
