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

const Sidebar = () => {
  const { data: session } = useSession();
  const [chats, loading] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email as string, "chats"),
        orderBy("createdAt", "asc")
      )
  );
  const router = useRouter();

  // Versi dengan pengecekan lebih detail
  useEffect(() => {
    // Hanya redirect jika semua kondisi terpenuhi:
    if (
      session !== undefined && // Session sudah selesai loading
      !loading && // Firebase query sudah selesai
      session?.user && // User sudah login
      chats !== undefined && // Query chats sudah dijalankan
      (!chats || chats.docs.length === 0) && // Tidak ada chats
      window.location.pathname !== "/" // Bukan di homepage
    ) {
      router.push("/");
    }
  }, [chats, loading, session, router]);

  return (
    <div className="hidden md:inline-flex flex-col w-full h-screen p-2 relative">
      {/* New Chat */}
      <div className="flex items-center justify-center gap-1 border-b border-white/30">
        <Link href={"/"} className="flex">
          <Image src={"/favicon.ico"} alt="logo" width={32} height={32} />
          <p className="font-semibold text-3xl">ChtGPT</p>
        </Link>
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
    </div>
  );
};

export default Sidebar;
