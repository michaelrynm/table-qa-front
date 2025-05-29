"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// Pastikan ini BUKAN async function
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex text-primary-foreground/80">
        {/* Sidebar */}
        <div className="bg-primary text-primary-foreground/80 max-w-[250px] h-screen overflow-y-auto md:min-w-[15rem]">
          <Sidebar />
        </div>
        {/* Main Content */}
        <div className="bg-[#212121] flex-1 h-screen overflow-hidden relative">
          <Header />
          {children}
        </div>
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
