import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SpotifyLogo from "../public/images/Spotify-Logo-Svg.svg";
import FeaturedPlaylists from "./FeaturedPlaylists";
import SearchResults from "./SearchResults";

const SearchView = ({
  setView,
  setGlobalPlaylistId,
  setGlobalCurrentSongId,
  setGlobalIsTrackPlaying,
  setGlobalArtistId,
}) => {
  const { data: session } = useSession();
  const [searchData, setSearchData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  async function updateSearchResults(query) {
    const response = await fetch(
      "https://api.spotify.com/v1/search?" +
        new URLSearchParams({
          q: query,
          type: ["artist", "playlist", "track"],
        }),
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const data = await response.json();
    setSearchData(data);
  }

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);
  return (
    <div className="text-white flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <div className="text-white sticky top-0 h-20 z-10 text-4xl p-8 flex items-center font-bold px-8">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 absolute top-7 left-10 text-neutral-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          className="rounded-full bg-white w-96 pl-12 text-neutral-500 text-base py-2 font-normal outline-0"
          value={inputValue}
          onChange={async (e) => {
            setInputValue(e.target.value);
            await updateSearchResults(e.target.value);
          }}
        />
      </div>
                  {/* search result components */}
                  <div>
      {searchData === null ? (
          <FeaturedPlaylists
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId}
          />
        ) : (
          <SearchResults 
          playlists={searchData?.playlists.items}
          songs={searchData?.tracks.items}
          artists={searchData?.artists.items}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
          setGlobalCurrentSongId={setGlobalCurrentSongId}
          setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
          setGlobalArtistId={setGlobalArtistId}
          />
        )}
      </div>
    </div>
  );
};

export default SearchView;
