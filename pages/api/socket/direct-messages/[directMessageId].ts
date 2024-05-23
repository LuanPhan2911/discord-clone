import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Not Allow method" });
  }
  try {
    const profile = await currentProfile(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { conversationId, directMessageId } = req.query;
    const { content } = req.body;

    if (!directMessageId) {
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
    if (!member) {
      return res.status(400).json({ error: "Member not found" });
    }

    let message = await db.redirectMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
        deleted: false,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message) {
      return res.status(400).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;

    if (!isMessageOwner) {
      return res.status(400).json({ error: "Can not modify message" });
    }
    if (req.method === "DELETE") {
      message = await db.redirectMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message is deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(400).json({ error: "Can not edit message" });
      }
      message = await db.redirectMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: "Internal Error" });
  }
}
