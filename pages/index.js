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
      </main>

      <div></div>
    </div>
  );
}
