import { shuffle } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
  "from-pink-500",
  "from-blue-500",
];

const PlaylistView = ({
  globalPlaylistId,
  setGlobalCurrentSongId,
  setGlobalIsTrackPlaying,
  setView,
  setGlobalArtistId,
}) => {
  const { data: session } = useSession();
  const [playlistData, setPlaylistData] = useState(null);
  const [color, setColor] = useState(colors[0]);
  const [opacity, setOpacity] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);

  function changeOpacity(scrollPos) {
    // Changing the opacity of the header element
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

  useEffect(() => {
    async function f() {
      if (session && session.accessToken) {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${globalPlaylistId}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setPlaylistData(data);
      }
    }
    f();
  }, [session, globalPlaylistId]);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [globalPlaylistId]);

  return (
    <div className="text-white flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header
        style={{ opacity: opacity }}
        className="text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-950 p-8 flex items-center font-bold"
      >
        <div style={{ opacity: textOpacity }} className="flex items-center">
          {playlistData && (
            <Image
              src={playlistData.images[0].url}
              alt="playlist images"
              width={8}
              height={8}
              className=" mr-8"
            />
          )}

          <p>{playlistData?.name}</p>
        </div>
      </header>
      {/* User session Image */}
      <div className="absolute z-20 top-5 right-8 flex items-center bg-black bg-opacity-60 text-white space-x-3 opacity-90 hover:opacity-70 cursor-pointer rounded-full p-1 pr-2">
        <Image
          src={session?.user.image}
          alt="Session User Image"
          width={35}
          height={30}
          quality={100}
          priority
          className="rounded-full"
        />
        <p className="text-sm">{session?.user.name}</p>
      </div>
      {/* artist */}
      <div
        onScroll={(e) => changeOpacity(e.target.scrollTop)}
        className="relative -top-20 h-screen"
      >
        <section
          className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}
        >
          {playlistData && (
           <img
           src={playlistData.images[0].url}
           alt="playlist images"
           className="h-44 w-44"
         />
          )}
          <div>
            <p className="text-md font-medium">Playlist</p>
            <p className="text-2xl font-medium md:text-4xl">
              {playlistData?.name}
            </p>
          </div>
        </section>

        {/* songs of the playlist */}
        <div className="px-8 flex flex-col space-y-1 pb-28 pt-2">
          {/* contains songs of playlist */}
          {playlistData?.tracks.items.map((track, i) => {
            // listing of tracks in playlist
            return <SongView
            key={track.track.id}
            
            sno={i}
            track={track.track}
            setView={setView}
            setGlobalArtistId={setGlobalArtistId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}/>
          })}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
