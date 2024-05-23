"use client";

import { Video, VideoOff } from "lucide-react";
import ActionTooltip from "./action-tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

export const ChatVideoButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const label = isVideo ? "End Video" : "Start Video";

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      {
        skipNull: true,
      }
    );
    router.push(url);
  };
  return (
    <ActionTooltip side="bottom" label={label}>
      <button>
        <Icon
          className="w-6 h-6 text-zinc-500 dark:text-zinc-400 mr-2"
          onClick={onClick}
        />
      </button>
    </ActionTooltip>
  );
};
