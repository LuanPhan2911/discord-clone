"use client";

import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
}
const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div
          className="h-[75px] w-[75px] rounded-full 
          bg-zinc-500 dark:bg-zinc-400 flex items-center justify-center"
        >
          <Hash className="w-12 h-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type == "channel" ? "Welcome to the #" : ""} {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `This is the start of the ${name} channel.`
          : `This the the start of the conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
