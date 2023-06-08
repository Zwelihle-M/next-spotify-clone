import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const MediaPlayer = ({ globalCurrentSongId, setGlobalCurrentSongId,globalIsTrackPlaying,setGlobalIsTrackPlaying
}) => {
  const { data: session } = useSession();

  const [songInfo, setSongInfo] = useState(null);

  async function fetchSongInformation(trackId) {
    if (trackId) {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      const data = await response.json();
      setSongInfo(data);
    }
  }

  async function getCurrenltyPlaying() {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    if (response.status == 204) {
      console.log("204 response: from currenlty playing song");
      return;
    }

    const data = await response.json();
    return data;
  }

  async function handlePlayPause() {
    if (session && session.accessToken) {
      const data = await getCurrenltyPlaying();
      if (data.is_playing) {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/pause",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

       if(response.status == 204){
        setGlobalIsTrackPlaying(false)
       }
      } else {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/play",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        )

        if( response.status == 204){
          setGlobalIsTrackPlaying(true)
          setGlobalCurrentSongId(data.item.id)
        }
      }
    }
  }

  useEffect(() => {
    // fetches the current song details and allows playing
    async function f() {
      if (session && session.accessToken) {
        if (!globalCurrentSongId) {
          // get the current song playling
          const data = await getCurrenltyPlaying();
          setGlobalCurrentSongId(data?.item?.id);
          if (data.is_playing) {
            setGlobalIsTrackPlaying(true);
          }
          await fetchSongInformation(data?.item.id);
        } else {
          // just get the current song information
          await fetchSongInformation(globalCurrentSongId);
        }
      }
    }
    f();
  }, [globalCurrentSongId]);
  return (
    <div className='h-24 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-neutral-800 shadow-sm shadow-sm text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 '>
     <div className="flex items-center space-x-4">
      {/* song details */}
      {songInfo?.album.images[0].url && (
         <img
         src={songInfo.album.images[0].url}
         alt=""
         className="hidden md:inline h-20 w-20 rounded-sm"
       />
      )}

      <div>
        <p className="text-white text-sm ">{songInfo?.name}</p>
        <p className="text-gray-400 text-xs">{songInfo?.artists[0]?.name}</p>
      </div>
    </div>

    <div className="flex items-center justify-center">
      {globalIsTrackPlaying ? (
        <button onClick={handlePlayPause}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10"
            
          >
            <path
              fillRule="evenodd"
              d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : (
        <button onClick={handlePlayPause}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>

    <div></div>
    </div>
  )
}

export default MediaPlayer