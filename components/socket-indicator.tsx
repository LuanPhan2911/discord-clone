"use client";

import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return (
      <Badge variant={"outline"} className="bg-yellow-600 text-white">
        Fallback:Polling after 1s
      </Badge>
    );
  } else {
    return (
      <Badge variant={"outline"} className="bg-green-600 text-white">
        Live:Realtime updates
      </Badge>
    );
  }
};

export default SocketIndicator;
