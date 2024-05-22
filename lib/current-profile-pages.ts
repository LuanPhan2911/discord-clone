import { getAuth } from "@clerk/nextjs/server";
import { db } from "./db";
import { NextApiRequest } from "next";

export async function currentProfile(req: NextApiRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return null;
    }
    const profile = await db.profile.findUnique({
      where: {
        userId,
      },
    });
    return profile;
  } catch (error) {
    return null;
  }
}
