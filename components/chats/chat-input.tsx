"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}
const formSchema = z.object({
  content: z.string().min(1),
});
const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      const res = await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (error) {}
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    <button
                      className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400
                  hover:bg-zinc-400 dark:hover:bg-zinc-300 transition rounded-full p-1 flex 
                  items-center justify-center "
                      type="button"
                      onClick={() => {
                        onOpen("messageFile", {
                          apiUrl,
                          query,
                        });
                      }}
                    >
                      <Plus className="text-white dark:text-[#313338]" />
                    </button>
                    <div className="absolute top-7 right-8">
                      <EmojiPicker
                        onChange={(emoji) =>
                          field.onChange(`${field.value} ${emoji}`)
                        }
                      />
                    </div>
                    <Input
                      disabled={isLoading}
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none 
                    border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-400"
                      placeholder={`Message ${
                        type === "conversation" ? name : "#" + name
                      }`}
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
