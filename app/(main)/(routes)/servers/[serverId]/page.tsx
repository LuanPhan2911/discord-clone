import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FunctionComponent } from "react";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage: FunctionComponent<ServerIdPageProps> = async ({
  params,
}: ServerIdPageProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }
  const server = await db.server.findUnique({
    where: {
      id: params?.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const channel = server?.channels[0];
  if (!channel) {
    return null;
  }
  return redirect(`/servers/${params?.serverId}/channels/${channel.id}`);
};

export default ServerIdPage;
