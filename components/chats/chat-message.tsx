"use client";
import { format } from "date-fns";
import { Member } from "@prisma/client";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { MessageWithMemberWithProfile } from "@/types";
import ChatItem from "./chat-item";

interface ChatMessageProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}
const DATE_FORMAT = "d MMM yyyy, HH:mm";
const ChatMessage = ({
  apiUrl,
  chatId,
  member: currentMember,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessageProps) => {
  const queryKey = `chat:${chatId}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="w-7 h-7 text-zinc-600 animate-spin my-4 " />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="w-7 h-7 text-zinc-600 my-4 " />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1"></div>
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map(({ items, nextCursor }, i) => {
          return (
            <Fragment key={i}>
              {items?.map(
                ({
                  content,
                  id,
                  fileUrl,
                  deleted,
                  member,
                  createdAt,
                  updatedAt,
                }: MessageWithMemberWithProfile) => {
                  return (
                    <ChatItem
                      key={id}
                      content={content}
                      currentMember={currentMember}
                      member={member}
                      deleted={deleted}
                      fileUrl={fileUrl}
                      id={id}
                      isUpdated={updatedAt !== createdAt}
                      timestamp={format(new Date(createdAt), DATE_FORMAT)}
                      socketQuery={socketQuery}
                      socketUrl={socketUrl}
                    />
                  );
                }
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessage;
