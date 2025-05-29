"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PiSignOut } from "react-icons/pi";
import { signOut } from "next-auth/react";

import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";

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
          className="relative z-10 focus:outline-none"
          onClose={close}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
              >
                <DialogTitle
                  as="h3"
                  className="text-base/7 font-bold text-white"
                >
                  Are you sure want to sign out?
                </DialogTitle>
                <p className="mt-2 text-sm/6 text-white/50">
                  You will be logged out from your account.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    className="inline-flex items-center gap-2 rounded-md bg-red-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SignOut;
