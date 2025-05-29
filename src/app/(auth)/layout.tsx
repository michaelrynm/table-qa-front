"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

// Pastikan ini BUKAN async function
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#212121] flex items-center justify-center">
        {children}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#000000", color: "#ffffff" },
        }}
      />
    </SessionProvider>
  );
}
