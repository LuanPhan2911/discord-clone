"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  VideoConference,
  ControlBar,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}
export const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) {
      return;
    }
    const name = `${user?.firstName} ${user?.lastName}`;
    (async () => {
      try {
        let res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await res.json();
        setToken(data?.token);
      } catch (error) {}
    })();
  }, [user, token, chatId]);
  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-600 animate-spin py-4" />
        <p className="text-xs text-zinc-400 dark:text-zinc-300">Loading...</p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      audio={audio}
      video={video}
      data-lk-theme="default"
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
