import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allow",
    });
  }
  try {
    const profile = await currentProfile(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;
    if (!content || !conversationId) {
      return res.status(400).json({ error: "Missing data" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!conversation) {
      return res.status(400).json({ error: "Conversation not found" });
    }
    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    const message = await db.redirectMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversation.id,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    const channelKey = `chat:${conversation.id}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: "Internal Error" });
  }
}
