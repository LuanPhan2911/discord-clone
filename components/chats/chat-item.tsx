"use client";

import { Member, MemberRole, Profile } from "@prisma/client";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { roleMap } from "@/enums";
import Image from "next/image";
import { Edit, FileIcon, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import queryString from "query-string";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, any>;
}
const formSchema = z.object({
  content: z.string().min(1),
});
const ChatItem = ({
  content,
  currentMember,
  deleted,
  fileUrl,
  id,
  isUpdated,
  member,
  timestamp,
  socketQuery,
  socketUrl,
}: ChatItemProps) => {
  const fileType = fileUrl?.split(".").pop();
  const [isEditing, setEditing] = useState(false);
  const isAdmin = member.role === MemberRole.ADMIN;
  const isModerator = member.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileType === "pdf" && fileUrl;
  const isImage = !isPdf && fileUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const router = useRouter();
  const params = useParams();
  const { onOpen } = useModal();
  useEffect(() => {
    form.reset({
      content,
    });
  }, [content, form]);
  useEffect(() => {
    const cancel = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditing(false);
        form.reset({
          content,
        });
      }
    };

    document.addEventListener("keydown", cancel);
    return () => {
      document.removeEventListener("keydown", cancel);
    };
  }, [form, content]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      const res = await axios.patch(url, values);
      setEditing(false);
      form.reset();
    } catch (error) {}
  };
  const onClickMember = () => {
    if (member.id === currentMember.id) {
      return;
    }
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  const isLoading = form.formState.isSubmitting;
  return (
    <div
      className="relative group flex items-center 
  hover:bg-black/5 p-4 transition w-full"
    >
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onClickMember}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                <p>{roleMap[member.role]}</p>
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex 
            items-center bg-secondary h-48 w-48"
            >
              <Image src={fileUrl} fill alt={content} />
            </a>
          )}
          {isPdf && (
            <div className="relative flex items-center p-5 rounded-md">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                className="ml-2 text-sm 
              text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF file
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] text-zinc-400 dark:text-zinc-300 mx-2">
                  (Edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              disabled={isLoading}
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 
                            border-none focus-visible:ring-0 
                            focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-400"
                              placeholder="Edit Message"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                ></FormField>
                <Button disabled={isLoading} variant={"primary"} size={"sm"}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
        {canDeleteMessage && (
          <div
            className="hidden group-hover:flex items-center 
          gap-x-2 absolute p-1 top-2 right-5 
          bg-white dark:bg-zinc-800
          border rounded-md
          "
          >
            {canEditMessage && (
              <ActionTooltip label="Edit">
                <Edit
                  onClick={() => setEditing(true)}
                  className="w-5 h-5 cursor-auto ml-auto 
                text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
            )}
            {canDeleteMessage && (
              <ActionTooltip label="Delete">
                <Trash
                  onClick={() =>
                    onOpen("deleteMessage", {
                      socketQuery,
                      socketUrl,
                      messageId: id,
                    })
                  }
                  className="w-5 h-5 cursor-auto ml-auto 
                text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
