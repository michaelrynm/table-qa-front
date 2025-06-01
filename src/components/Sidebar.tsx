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
    <div className="flex flex-col w-full h-screen p-2 relative">
      {/* New Chat */}
      <div className="flex items-center justify-between gap-1 border-b border-white/30 py-1">
        <Link href={"/"} className="flex">
          <Image src={"/favicon.ico"} alt="logo" width={32} height={32} />
          <p className="font-semibold text-3xl">ChtGPT</p>
        </Link>
        <div className="justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200"
            title="Collapse sidebar"
          >
            <HiMenuAlt3 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <NewChat />
      </div>

      {session?.user ? (
        <>
          <p className="text-white/50 mt-4 px-2 text-sm font-medium">Today</p>
          <div className="mt-4 overflow-y-scroll h-[80%] w-full">
            {loading ? (
              <div className="flex flex-col flex-1 space-y-2 overflow-auto">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-8 rounded-md shrink-0 animate-pulse bg-zinc-800"
                  />
                ))}
              </div>
            ) : chats?.docs.length ? (
              chats?.docs?.map((chat, index) => (
                <ChatRow key={chat?.id} id={chat?.id} index={index} />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No chat history</p>
              </div>
            )}
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-sm font-medium text-center mt-10">
            <p>Please sign in to view history</p>
            <Link
              href={"/signin"}
              className="text-xs hover:text-white duration-300 mt-2 underline decoration-[1px]"
            >
              Sign in
            </Link>
          </div>
        )
      )}
      {session?.user && !loading && (
        <Link href={"/"}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group cursor-pointer">
            <AiOutlineHome
              size={20}
              className="text-white/60 group-hover:text-white/80 transition-colors duration-200"
            />
            <p className="text-white/70 font-medium group-hover:text-white/90 transition-colors duration-200">
              Beranda
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
