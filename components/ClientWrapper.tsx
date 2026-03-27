"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function ClientWrapper({ children }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}