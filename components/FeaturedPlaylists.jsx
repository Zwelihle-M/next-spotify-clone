import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const FeaturedPlaylists = ({ setView, setGlobalPlaylistId }) => {
  const { data: session } = useSession();

  const [playlists, setPlaylists] = useState([]);

  function selectPlaylist(playlist) {
    setView("playlist");
    setGlobalPlaylistId(playlist.id);
  }

  useEffect(() => {
    async function f() {
      if (session && session.accessToken) {
        const response = await fetch(
          "https://api.spotify.com/v1/browse/featured-playlists?" +
            new URLSearchParams({
              country: "ZA",
            }),
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setPlaylists(data.playlists.items);
      }
    }
    f();
  }, [session]);
  return (
    <div className="text-white flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <div className="max-w-screen-xl mx-auto px-8 text-center md:text-center overflow-x-hidden ">
        <div>
          <div className="flex flex-wrap gap-6 mb-48">
            {playlists.map((playlist) => {
              return (
                <div
                  onClick={() => selectPlaylist(playlist)}
                  key={playlist.id}
                  className="cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4"
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
    </div>
  );
};

export default FeaturedPlaylists;
