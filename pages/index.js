import ArtistView from "@/components/ArtistView";
import LibraryView from "@/components/LibraryView";
import PlaylistView from "@/components/PlaylistView";
import SearchView from "@/components/SearchView";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  // search library playlist artist media player States
  const [view, setView] = useState("search");
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);
  const [globalArtistId, setGlobalArtistId] = useState(null);
  const [globalCurrentSongId, setGlobalCurrentSongId] = useState(null);
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState(false);
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        {/* SideBar/Navigationbar */}
        <Sidebar
          view={view}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
        {/* playlistView */}
        {view === "playlist" && (
          <PlaylistView
            setView={setView}
            setGlobalArtistId={setGlobalArtistId}
            globalPlaylistId={globalPlaylistId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
          />
        )}
        {/* searchView */}
        {view === "search" && (
          <SearchView
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            setGlobalArtistId={setGlobalArtistId}
          />
        )}
        {/* library component */}
        {view === "library" && (
          <LibraryView
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId}
          />
        )}
        {/* artistView */}
        {view === "artist" && (
          <ArtistView
            setView={setView}
            globalArtistId={globalArtistId}
            setGlobalArtistId={setGlobalArtistId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
          />
        )}
      </main>

      <div></div>
    </div>
  );
}
