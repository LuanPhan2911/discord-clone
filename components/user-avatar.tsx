"use client";
import { cn } from "@/lib/utils";
import { Avatar } from "./ui/avatar";
import { AvatarImage, Fallback } from "@radix-ui/react-avatar";

interface UserAvatarProps {
  src?: string;
  className?: string;
}
const UserAvatar = ({ src, className }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage
        src={src}
        className={cn("w-7 h-7 md:w-10 md:h-10", className)}
      />
      <Fallback />
    </Avatar>
  );
};

export default UserAvatar;
