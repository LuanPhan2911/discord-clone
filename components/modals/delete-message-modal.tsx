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
import queryString from "query-string";

const DeleteMessageModal = () => {
  const { isOpen, type, data, onClose } = useModal();
  const isOpenModal = type === "deleteMessage" && isOpen;
  const { socketUrl, socketQuery, messageId } = data;
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    try {
      setLoading(true);
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${messageId}`,
        query: socketQuery,
      });
      const response = await axios.delete(url);

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
            Delete Message
          </DialogTitle>
          <Description className="text-center text-zinc-500">
            Click confirm to delete message{" "}
            <span className="text-indigo-500 font-semibold"></span>. Are you
            sure?
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

export default DeleteMessageModal;
