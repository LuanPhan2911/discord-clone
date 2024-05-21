"use client";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Description } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import qs from "query-string";

const DeleteChannelModal = () => {
  const { isOpen, type, data, onClose } = useModal();
  const isOpenModal = type === "deleteChannel" && isOpen;
  const router = useRouter();
  const { channel, server } = data;
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    try {
      setLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.delete(url);

      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <Description className="text-center text-zinc-500">
            Click confirm to delete channel{" "}
            <span className="text-indigo-500 font-semibold">
              {channel?.name}
            </span>
            . Are you sure?
          </Description>
        </DialogHeader>
        <DialogFooter className="bg-gray-50 px-6 py-4">
          <Button variant={"secondary"} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={"primary"} onClick={onClick} disabled={loading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
