"use client";
import { db } from "@/firebase";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GoKebabHorizontal } from "react-icons/go";
import { IoPencil } from "react-icons/io5";

interface Props {
  id: string;
  index: number;
}

const ChatRow = ({ id }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);

  const [messages, loading] = useCollection(
    query(
      collection(
        db,
        "users",
        session?.user?.email as string,
        "chats",
        id,
        "messages"
      )
    )
  );

  // Tambahkan setelah query messages yang sudah ada
  const [chatDoc] = useDocument(
    doc(db, "users", session?.user?.email as string, "chats", id)
  );

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(id));
  }, [pathname, id]);

  const chatData = chatDoc?.data();
  const lastMessage = messages?.docs[messages?.docs?.length - 1]?.data();
  const chatText = chatData?.title || lastMessage?.text || "New Chat";
  const shouldAnimate = active;

  const [chatsSnapshot] = useCollection(
    query(
      collection(db, "users", session?.user?.email as string, "chats"),
      orderBy("createdAt", "desc")
    )
  );

  const handleRemoveChat = async () => {
    try {
      await deleteDoc(
        doc(db, "users", session?.user?.email as string, "chats", id)
      );

      toast.success("Chat deleted");

      if (active) {
        const nextChat = chatsSnapshot?.docs?.find((chat) => chat.id !== id);
        if (nextChat) {
          router.push(`/chat/${nextChat.id}`);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat, please try again.");
    }
  };

  return (
    <Link
      href={`/chat/${id}`}
      className={`flex gap-2 items-center justify-center px-2 py-1.5 hover:bg-white/10 rounded-md mb-2 duration-300 ease-in w-full ${
        active ? "bg-white/10" : "bg-transparent"
      }`}
    >
      <IoChatboxOutline />
      <div className="relative flex-1 select-none overflow-hidden text-ellipsis break-all">
        <span className="whitespace-nowrap">
          {shouldAnimate ? (
            chatText !== "New Chat" ? (
              chatText.split("").map((character: string, index: number) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100,
                    },
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  initial={shouldAnimate ? "initial" : undefined}
                  animate={shouldAnimate ? "animate" : undefined}
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                    staggerChildren: 0.05,
                  }}
                >
                  <span className="text-sm font-medium tracking-wide text-green-400">
                    {character}
                  </span>
                </motion.span>
              ))
            ) : (
              <span className="text-sm font-medium tracking-wide">
                {loading ? <span>....</span> : chatText}
              </span>
            )
          ) : (
            <span className="text-sm font-medium tracking-wide">
              {loading ? <span>....</span> : chatText}
            </span>
          )}
        </span>
      </div>

      <Menu>
        <MenuButton>
          <GoKebabHorizontal className="text-white/50 hover:text-white duration-300 ease-in-out" />
        </MenuButton>
        <MenuItems
          anchor="bottom start"
          className={"bg-[#3a3a3a] p-2 rounded-xl min-w-32"}
        >
          <MenuItem>
            <div className="flex gap-1 items-center text-white/80 hover:text-white duration-300 ease-in-out cursor-pointer hover:bg-white/20 p-2 rounded-lg">
              <IoPencil />
              <p className=" text-sm">Edit</p>
            </div>
          </MenuItem>
          <MenuItem>
            <div
              onClick={handleRemoveChat}
              className="flex gap-1 items-center text-red-500   cursor-pointer hover:bg-white/20 p-2 rounded-lg font-medium"
            >
              <BiSolidTrashAlt />
              <p className="text-sm ">Delete</p>
            </div>
          </MenuItem>
        </MenuItems>
      </Menu>
    </Link>
  );
};

export default ChatRow;
