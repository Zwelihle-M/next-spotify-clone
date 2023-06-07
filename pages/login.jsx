import { signIn } from "next-auth/react";
import React from "react";
import SpotifyLogo from "../public/images/Spotify-Logo-Svg.svg";
import Image from "next/image";

const Login = () => {
  return (
    <div className="w-full h-screen flex flex-col  items-center justify-center bg-black">
      <div className="mt-1 mb-5 ">
        <Image
          src={SpotifyLogo}
          alt="spotify logo svg"
          width={200}
          height={200}
          quality={100}
          priority
        />
      </div>
      <button
        onClick={() => signIn("spotify", { callbackUrl: "/" })}
        className="bg-SpotifyGreen p-3 rounded-full text-white transition duration-300 ease-in-out shadow-lg group hover:scale-105"
      >
        {" "}
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
