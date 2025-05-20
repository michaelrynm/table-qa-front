"use client";
import React from "react";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FaPlus } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const NewChat = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async () => {
    // Create New Chat in Firestore
    console.log(session?.user);
    if (!session?.user?.email) {
      console.error("User email is not available in the session.");
      return;
    }
    const doc = await addDoc(
      collection(db, "users", session?.user?.email as string, "chats"),
      {
        userId: session?.user?.email as string,
        createdAt: serverTimestamp(),
      }
    );
    router.push(`/chat/${doc?.id}`);
  };

  return (
    <button
      onClick={createNewChat}
      className="flex items-center justify-center gap-2 text-xs md:text-base border border-primary-foreground/10 w-full rounded-md px-2 py-1 hover:bg-primary-foreground/10 duration-300 ease-in-out"
    >
      <FaPlus /> New Chat
    </button>
  );
};

export default NewChat;
