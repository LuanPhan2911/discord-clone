"use client";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}
const ServerHeader = ({ role, server }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div
          className="w-full text-md font-semibold px-3 flex items-center h-12 
        border-neutral-200 dark:border-neutral-800 border-b-2
        hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
        >
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-30 w-56 text-xs font-medium bg-black space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() =>
              onOpen("invite", {
                server,
              })
            }
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex items-center"
          >
            Invite People <UserPlus className="h-4 w-4 ml-auto"></UserPlus>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex items-center"
          >
            Server Setting <Settings className="h-4 w-4 ml-auto"></Settings>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("manageMembers", { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex items-center"
          >
            Manage Members <Users className="h-4 w-4 ml-auto"></Users>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer flex items-center"
          >
            Create Channels{" "}
            <PlusCircle className="h-4 w-4 ml-auto"></PlusCircle>
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer flex items-center"
          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer flex items-center"
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
