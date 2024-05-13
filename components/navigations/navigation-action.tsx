"use client";
import { Plus } from "lucide-react";
import ActionTooltip from "../action-tooltip";

const NavigationAction = () => {
  return (
    <ActionTooltip label="Add a server" side="right" align="center">
      <button className="group flex items-center">
        <div
          className="flex mx-3 h-[48px] w-[48px] 
    bg-background dark:bg-neutral-700
    rounded-[24px] group-hover:rounded-[16px] transition-all
    overflow-hidden justify-center items-center group-hover:bg-neutral-500
    "
        >
          <Plus
            className="group-hover:text-white transition text-green-500"
            size={25}
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationAction;
