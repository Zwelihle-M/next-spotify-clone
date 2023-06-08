import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SpotifyLogo from "../public/images/Spotify-Logo-Svg.svg";

const Sidebar = ({ view, setView, setGlobalPlaylistId }) => {
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState([]);
  
    useEffect(() => {
      async function f() {
        if (session && session.accessToken) {
          const response = await fetch(
            "https://api.spotify.com/v1/me/playlists",
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );
          const data = await response.json();
          setPlaylists(data.items);
        }
      }
      f();
    }, [session]);
  return (
    <div className="text-gray-300 p-5 text-xs lg:text-sm border-r border-neutral-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex">

      <div className="space-y-4">
      <div className="mt-1 mb-5 ">
        <Image src={SpotifyLogo} alt="spotify logo svg" width={120}  height={100} quality={100} priority/>
      </div>
        {/* Home */}
        <button className="flex items-center space-x-2 hover:text-white">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </span>

          <p>Home</p>
        </button>
        {/* Search */}
        <button
          className={`flex items-center space-x-2  ${
            view == "search" ? "hover:text-white" : null
          }`}
          onClick={() => setView("search")}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <p>Search</p>
        </button>
        {/* library */}
        <button
          className={`flex items-center space-x-2 ${
            view == "library" ? "hover:text-white" : null
          }`}
          onClick={() => setView("library")}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.584 2.376a.75.75 0 01.832 0l9 6a.75.75 0 11-.832 1.248L12 3.901 3.416 9.624a.75.75 0 01-.832-1.248l9-6z" />
              <path
                fillRule="evenodd"
                d="M20.25 10.332v9.918H21a.75.75 0 010 1.5H3a.75.75 0 010-1.5h.75v-9.918a.75.75 0 01.634-.74A49.109 49.109 0 0112 9c2.59 0 5.134.202 7.616.592a.75.75 0 01.634.74zm-7.5 2.418a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75zm3-.75a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0v-6.75a.75.75 0 01.75-.75zM9 12.75a.75.75 0 00-1.5 0v6.75a.75.75 0 001.5 0v-6.75z"
                clipRule="evenodd"
              />
              <path d="M12 7.875a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
            </svg>
          </span>

          <p>Library</p>
        </button>
        {/* new playlist */}
        <hr className="border-black" />
        <button className="flex items-center space-x-2 hover:text-white">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          {/* Liked Songs */}
          <p>New Playist</p>
        </button>
        {/* Liked Songs */}
        <button className="flex items-center space-x-2 hover:text-white">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </span>

          <p>Liked Songs</p>
        </button>

        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </span>
          <p>Sign out</p>
        </button>

        <hr className="border-t-[0.1px] border-neutral-900 " />
        {/* displaying user playlists */}
        {playlists.map((playlist) => {
          return (
            <p
              key={playlist.id}
              className="cursor-pointer  hover:text-white w-52 "
              onClick={() => {
                setView("playlist");
                setGlobalPlaylistId(playlist.id);
              }}
            >
              {playlist.name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
