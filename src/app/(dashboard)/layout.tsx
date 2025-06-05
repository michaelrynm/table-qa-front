"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState } from "react";
import { ModelProvider } from "@/src/context/ModelContext";

// Pastikan ini BUKAN async function
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SessionProvider>
      <ModelProvider>
        <div className="flex text-primary-foreground/80 relative">
          {/* Overlay untuk mobile ketika sidebar terbuka */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`bg-primary text-primary-foreground/80 h-screen overflow-y-auto transition-all duration-300 ease-in-out z-50 ${
              sidebarOpen
                ? "fixed lg:relative w-[280px] sm:w-[300px] lg:w-[300px]"
                : "fixed lg:relative w-0 lg:w-0"
            }`}
          >
            <div className={`${sidebarOpen ? "block" : "hidden"} w-full`}>
              <Sidebar
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
              />
            </div>
          </div>

          {/* Main Content */}
          <div
            className={`bg-[#212121] flex-1 h-screen overflow-hidden transition-all duration-300 ease-in-out ${
              sidebarOpen ? "lg:ml-0" : "lg:ml-0"
            }`}
          >
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#000000", color: "#ffffff" },
          }}
        />
      </ModelProvider>
    </SessionProvider>
  );
}
