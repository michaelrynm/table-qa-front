"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";

// Pastikan ini BUKAN async function
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <SessionProvider>
      <div className="flex text-primary-foreground/80">
        {/* Sidebar */}
        <div
          className={`bg-primary text-primary-foreground/80 h-screen overflow-y-auto transition-all duration-300 ease-in-out relative ${
            sidebarOpen ? "w-[300px]" : "w-0 md:w-0"
          }`}
        >
          <div className={`${sidebarOpen ? "block" : "hidden"}`}>
            <Sidebar
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#212121] flex-1 h-screen overflow-hidden relative">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
