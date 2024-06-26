"use client";
import { FunctionComponent } from "react";
import ActionTooltip from "../action-tooltip";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem: FunctionComponent<NavigationItemProps> = ({
  id,
  imageUrl,
  name,
}) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionTooltip label={name} side="right" align="center">
      <button
        onClick={() => {
          router.push(`/servers/${id}`);
        }}
        className="group relative flex items-center pb-3"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId === id
              ? "h-[36px]"
              : "h-[8px] group-hover:h-[20px]"
          )}
        ></div>
        <div
          className={cn(
            `
            relative flex  mx-3 h-[48px] w-[48px] rounded-[24px]
             group-hover:rounded-[16px] transition-all overflow-hidden
            `,
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image src={imageUrl} fill alt="None" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
