"use client";
import { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";
import InvitePeopleModal from "../modals/invite-people-modal";
import EditServerModal from "../modals/edit-server-modal";
import ManageMembersModal from "../modals/manage-members-modal";

export const ModalProvider = () => {
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <InvitePeopleModal />
      <ManageMembersModal />
    </>
  );
};
