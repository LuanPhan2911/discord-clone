import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSideBarProps {
  serverId: string;
}
const iconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};
const roleMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 mr-2 text-rose-500" />,
};
const ServerSidebar = async ({ serverId }: ServerSideBarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  if (!server) {
    return redirect("/");
  }
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server.members.filter(
    (member) => member.profileId !== profile.id
  );
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => {
                  return {
                    icon: iconMap[channel.type],
                    id: channel.id,
                    name: channel.name,
                  };
                }),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels.map((channel) => {
                  return {
                    icon: iconMap[channel.type],
                    id: channel.id,
                    name: channel.name,
                  };
                }),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => {
                  return {
                    icon: iconMap[channel.type],
                    id: channel.id,
                    name: channel.name,
                  };
                }),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => {
                  return {
                    icon: roleMap[member.role],
                    id: member.id,
                    name: member.profile.name,
                  };
                }),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              label="Text Channels"
              role={role}
              server={server}
              channelType={ChannelType.TEXT}
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => {
                return (
                  <ServerChannel
                    channel={channel}
                    server={server}
                    role={role}
                    key={channel.id}
                  />
                );
              })}
            </div>
          </div>
        )}
        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              label="Audio Channel"
              role={role}
              server={server}
              channelType={ChannelType.AUDIO}
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => {
                return (
                  <ServerChannel
                    channel={channel}
                    server={server}
                    role={role}
                    key={channel.id}
                  />
                );
              })}
            </div>
          </div>
        )}
        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              label="Video Channel"
              role={role}
              server={server}
              channelType={ChannelType.VIDEO}
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => {
                return (
                  <ServerChannel
                    channel={channel}
                    server={server}
                    role={role}
                    key={channel.id}
                  />
                );
              })}
            </div>
          </div>
        )}
        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="member"
              label="Member"
              role={role}
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((member) => {
                return (
                  <ServerMember
                    key={member.id}
                    member={member}
                    server={server}
                  />
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
