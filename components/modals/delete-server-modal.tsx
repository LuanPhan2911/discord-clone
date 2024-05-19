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
import { useParams, useRouter } from "next/navigation";
import { ServerWithMembersWithProfiles } from "@/types";

const DeleteServerModal = () => {
  const { isOpen, type, data, onClose } = useModal();
  const isOpenModal = type === "deleteServer" && isOpen;
  const params = useParams();
  const router = useRouter();
  const { server } = data as { server: ServerWithMembersWithProfiles };
  const [loading, setLoading] = useState(false);
  const onDeleteServer = async () => {
    try {
      setLoading(true);

      const response = await axios.delete(`/api/servers/${params?.serverId}`);
      router.refresh();
      router.push("/");
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
            Delete Server
          </DialogTitle>
          <Description className="text-center text-zinc-500">
            Click confirm to delete server{" "}
            <span className="text-indigo-500 font-semibold">
              {server?.name}
            </span>
            . Are you sure?
          </Description>
        </DialogHeader>
        <DialogFooter className="bg-gray-50 px-6 py-4">
          <Button variant={"secondary"} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={"primary"}
            onClick={onDeleteServer}
            disabled={loading}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
