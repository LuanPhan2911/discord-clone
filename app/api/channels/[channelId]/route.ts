import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) => {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { channelId } = params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!channelId || !serverId) {
      return new NextResponse("Missing Data", { status: 400 });
    }

    const { name, type } = await req.json();
    if (name === "general") {
      return new NextResponse("Invalid Channel Name is general", {
        status: 400,
      });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              name: {
                not: "general",
              },
            },
            data: {
              name,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", { status: 500 });
  }
};
export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      channelId: string;
    };
  }
) => {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { channelId } = params;
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!channelId || !serverId) {
      return new NextResponse("Missing Data", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", { status: 500 });
  }
};
