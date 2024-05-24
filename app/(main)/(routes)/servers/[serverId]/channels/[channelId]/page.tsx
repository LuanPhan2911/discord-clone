import ChatHeader from "@/components/chats/chat-header";
import ChatInput from "@/components/chats/chat-input";
import ChatMessage from "@/components/chats/chat-message";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) {
    return redirect("/");
  }
  const onLeave = () => {
    return redirect(`/servers/${params?.serverId}`);
  };
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessage
            member={member}
            type="channel"
            name={channel.name}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            chatId={channel.id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel?.id,
              serverId: channel?.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom
          chatId={channel.id}
          video={false}
          audio={true}
          onLeave={onLeave}
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom
          chatId={channel.id}
          video={true}
          audio={false}
          onLeave={onLeave}
        />
      )}
    </div>
  );
};

export default ChannelIdPage;
