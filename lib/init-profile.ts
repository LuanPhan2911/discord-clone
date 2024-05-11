import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const initProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return auth().redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
      name: `${user.firstName} ${user.lastName}`,
      userId: user.id,
    },
  });
  return newProfile;
};
