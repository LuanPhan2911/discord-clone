import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";
const LIMIT = 10;
export const GET = async (req: Request) => {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const cursor = searchParams.get("cursor");
    if (!conversationId) {
      return new NextResponse("Channel Id missing", { status: 400 });
    }

    let messages: RedirectMessage[] = [];
    if (cursor) {
      messages = await db.redirectMessage.findMany({
        take: LIMIT,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.redirectMessage.findMany({
        take: LIMIT,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    let nextCursor = null;
    if (messages.length === LIMIT) {
      nextCursor = messages[LIMIT - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
};
