"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";
interface FileUploadProps {
  endpoint: "messageFile" | "serverImage";
  value: string;
  onChange: (url?: string) => void;
}
const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split(".").pop();
  if (value && fileType != "pdf") {
    return (
      <div className="relative w-20 h-20">
        <Image src={value} alt="Not Found" className="rounded-full" fill />
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute 
        top-0 right-0 shadow-sm shrink-0"
          type="button"
          onClick={() => {
            onChange("");
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};

export default FileUpload;
