"use client";

import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);

  const origin =
    window !== undefined && window?.location?.origin
      ? window.location.origin
      : "";

  if (!mount) {
    return "";
  }
  return origin;
};
