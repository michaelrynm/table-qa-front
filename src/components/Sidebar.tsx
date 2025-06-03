"use client";
import { useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import NewChat from "./NewChat";
import ChatRow from "./ChatRow";
import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { HiMenuAlt3 } from "react-icons/hi";
import Logo from "@/src/app/assets/images/bps-logo.png";

const Sidebar = ({
  setSidebarOpen,
  sidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}) => {
  const { data: session } = useSession();
  const [chats, loading] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email as string, "chats"),
        orderBy("createdAt", "asc")
      )
  );
  const router = useRouter();

  useEffect(() => {
    if (
      session !== undefined &&
      !loading &&
      session?.user &&
      chats !== undefined &&
      (!chats || chats.docs.length === 0) &&
      window.location.pathname !== "/"
    ) {
      router.push("/");
    }
  }, [chats, loading, session, router]);

  return (
    <div className="flex flex-col w-full h-screen p-2 sm:p-2 relative">
      {/* New Chat */}
      <div className="flex items-center justify-between border-b border-white/30 py-1 sm:py-1">
        <Link
          href={"/"}
          className="flex gap-2 sm:gap-3 items-center min-w-0 flex-1"
        >
          <Image
            src={Logo}
            alt="logo"
            width={24}
            height={24}
            className="sm:w-8 sm:h-8 flex-shrink-0"
          />
          <p className="font-semibold text-lg sm:text-2xl md:text-3xl truncate">
            <span className="hidden sm:inline">BPS QA</span>
            <span className="sm:hidden">BPS</span>
          </p>
        </Link>
        <div className="justify-end flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 sm:p-2 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
            title="Collapse sidebar"
          >
            <HiMenuAlt3 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      <div className="mt-3 sm:mt-4">
        <NewChat />
      </div>

      {session?.user ? (
        <>
          <p className="text-white/50 mt-3 sm:mt-4 px-1 sm:px-2 text-xs sm:text-sm font-medium">
            Today
          </p>
          <div className="mt-2 sm:mt-4 overflow-y-scroll flex-1 w-full min-h-0">
            {loading ? (
              <div className="flex flex-col flex-1 space-y-2 overflow-auto">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-6 sm:h-8 rounded-md shrink-0 animate-pulse bg-zinc-800"
                  />
                ))}
              </div>
            ) : chats?.docs.length ? (
              <div className="space-y-1 sm:space-y-2">
                {chats?.docs?.map((chat, index) => (
                  <ChatRow key={chat?.id} id={chat?.id} index={index} />
                ))}
              </div>
            ) : (
              <div className="py-6 sm:py-8 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No chat history
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-xs sm:text-sm font-medium text-center mt-8 sm:mt-10 px-2">
            <p className="text-white/80">Please sign in to view history</p>
            <Link
              href={"/signin"}
              className="text-xs hover:text-white duration-300 mt-2 underline decoration-[1px] text-white/60 hover:text-white/90"
            >
              Sign in
            </Link>
          </div>
        )
      )}

      {session?.user && !loading && (
        <div className="mt-auto pt-2 sm:pt-3 border-t border-white/10">
          <Link href={"/"}>
            <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group cursor-pointer">
              <AiOutlineHome
                size={18}
                className="sm:w-5 sm:h-5 text-white/60 group-hover:text-white/80 transition-colors duration-200 flex-shrink-0"
              />
              <p className="text-sm sm:text-base text-white/70 font-medium group-hover:text-white/90 transition-colors duration-200 truncate">
                <span className="hidden sm:inline">Beranda</span>
                <span className="sm:hidden">Home</span>
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
