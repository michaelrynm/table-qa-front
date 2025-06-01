"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { PiTrashSimple } from "react-icons/pi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { db } from "@/firebase";
import { BiSolidTrashAlt } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useCollection } from "react-firebase-hooks/firestore";

interface DeleteChatModalProps {
  chatId: string;
}

const DeleteChatModal = ({ chatId }: DeleteChatModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const [active, setActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    setActive(pathname.includes(chatId));
  }, [pathname, chatId]);

  const [chatsSnapshot] = useCollection(
    query(
      collection(db, "users", session?.user?.email as string, "chats"),
      orderBy("createdAt", "desc")
    )
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleDeleteChat = async () => {
    if (!chatId || !session?.user?.email) return;
    try {
      setIsLoading(true);
      const chatsRef = doc(
        db,
        "users",
        session?.user?.email as string,
        "chats",
        chatId
      );
      await deleteDoc(chatsRef);

      toast.success("All chats deleted successfully!");
      router.push("/");
      close();
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={open}
        className="group flex w-full items-center  rounded-lg p-2 cursor-pointer hover:bg-white/10"
      >
        <div className=" flex items-center justify-center gap-1 text-red-500">
          <BiSolidTrashAlt className="text-base" />
          <p className="text-sm font-medium tracking-wide ">Hapus</p>
        </div>
      </div>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-[999]"
        onClose={close}
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <DialogPanel className="bg-gradient-to-br from-[#1a1a1a] to-[#212121] rounded-2xl shadow-2xl w-full max-w-md border border-white/10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/20">
                  <PiTrashSimple className="text-red-400" size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Hapus Riwayat Chat
                </h2>
              </div>
              <p className="text-sm text-gray-400">
                Apakah Anda yakin ingin menghapus semua riwayat chat ini?
              </p>
              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Actions */}
            <div className="p-6 flex justify-end gap-3">
              <button
                onClick={close}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-zinc-600 to-zinc-700 hover:from-zinc-700 hover:to-zinc-800 rounded-xl border border-white/10 transition-all duration-200"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteChat()}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl border border-red-500/20 transition-all duration-200"
              >
                {isLoading ? "Menghapus..." : "Hapus Chat"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteChatModal;
