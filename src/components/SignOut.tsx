"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PiSignOut } from "react-icons/pi";
import { signOut } from "next-auth/react";

import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const SignOut = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
    toast.success("Sign out successfully!");
    router.push("/");
  };

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <div>
      <div className="hover:bg-white/10 rounded-lg">
        <Button
          onClick={open}
          className="rounded-md p-3 text-sm font-medium text-white focus:not-data-focus:outline-none data-[focus]:bg-white/10 data-focus:outline-white data-hover:bg-black/30"
        >
          <div className="w-full gap-3 rounded-full flex items-center justify-center">
            <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
              <PiSignOut className="text-base" />
            </div>
            <p className="text-base">Sign Out</p>
          </div>
        </Button>

        <Dialog
          open={isOpen}
          as="div"
          className="relative z-[999] focus:outline-none"
          onClose={close}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <DialogPanel className="bg-gradient-to-br from-[#1a1a1a] to-[#212121] rounded-2xl shadow-2xl w-full max-w-md border border-white/10 animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="relative p-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/20">
                    <PiSignOut className="text-red-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Sign Out</h2>
                </div>
                <p className="text-sm text-gray-400">
                  Are you sure you want to log out from your account?
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
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl border border-red-500/20 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SignOut;
