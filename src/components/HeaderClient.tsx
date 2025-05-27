"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image, { StaticImageData } from "next/image";
import { FiChevronDown, FiUserPlus } from "react-icons/fi";
import { PiGearSix } from "react-icons/pi";
import SignOut from "./SignOut";
import { useState, useEffect } from "react";
import SignInModal from "./SignInModal";
import RegisterModal from "./RegisterModal";
import { useSession } from "next-auth/react";
import Avatar from "@/src/app/assets/images/avatar1.png";
import { usePathname } from "next/navigation";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandSeparator } from "cmdk";
import { Session } from "next-auth";

interface HeaderClientProps {
  session: Session | null; // 👈 Tambahkan ini
}

const frameworks = [
  {
    value: "gpt-4o", // huruf kecil
    label: "GPT-4o",
    description: "Great for most tasks",
  },
  {
    value: "o3",
    label: "o3",
    description: "Uses advanced reasonings",
  },
  {
    value: "o4-mini",
    label: "o4-mini",
    description: "Fastest at advanced reasonings",
  },
];

const HeaderClient = ({ session: serverSession }: HeaderClientProps) => {
  const { data: clientSession } = useSession();

  const session = serverSession || clientSession;
  // state for combobox
  const [open, setOpen] = useState(false);

  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);
  // const { data: session } = useSession();
  const [imageSrc, setImageSrc] = useState<string | StaticImageData>(
    session?.user?.image || Avatar
  );

  const pathname = usePathname();

  const [title, setTitle] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [isInChatRoom, setIsInChatRoom] = useState<boolean>(false);

  const fetchChatData = async () => {
    const match = pathname?.match(/\/chat\/([^/]+)/);
    const chatId = match?.[1];

    if (chatId && session?.user?.email) {
      setIsInChatRoom(true);
      try {
        const chatDocRef = doc(
          db,
          "users",
          session.user.email as string,
          "chats",
          chatId
        );
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setTitle(chatData.title || "New Chat");
          setModel(chatData.model || "gpt-4o");
        } else {
          setTitle("New Chat");
          setModel("gpt-4o");
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setTitle("New Chat");
        setModel("gpt-4o");
      }
    } else {
      setIsInChatRoom(false);
      setTitle("");
      setModel("gpt-4o");
    }
  };

  useEffect(() => {
    fetchChatData();
  }, [pathname, session]);

  useEffect(() => {
    if (session?.user?.image) {
      setImageSrc(session.user.image);
    }
  }, [session]);

  const switchToSignIn = () => {
    setIsRegisterModalOpen(false);
    setIsSignInModalOpen(true);
  };

  const switchToRegister = () => {
    setIsSignInModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="absolute top-0 left-0 grid items-center justify-between w-full grid-cols-3 px-5 py-2 shadow-xl bg-[#212121]">
      <div className="justify-self-start">
        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                role="combobox"
                aria-expanded={open}
                className={`flex items-center gap-1 justify-between bg-[#2F2F2F] px-3 py-2 rounded-lg text-primary-foreground/80 font-semibold tracking-wide text-base ${
                  !session?.user || !isInChatRoom
                    ? "cursor-default opacity-60"
                    : "hover:bg-primaryGray/50"
                }`}
                disabled={!session?.user || !isInChatRoom}
              >
                {"ChatGPT"}
                {isInChatRoom && model && (
                  <span className="font-light text-white/50">
                    {frameworks.find((f) => f.value === model)?.label || model}
                  </span>
                )}
                <FiChevronDown className="text-lg" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[280px] p-0 border-none bg-[#2F2F2F] rounded-2xl"
              side="bottom"
              align="start"
            >
              <Command className="bg-[#2F2F2F] border-none rounded-2xl">
                <CommandList>
                  <CommandGroup
                    heading="Models"
                    className="p-3 text-sm text-white/50"
                  >
                    {frameworks.map((framework) => (
                      <CommandItem
                        className="py-3 text-white hover:bg-white/30 rounded-xl"
                        key={framework.value}
                        value={framework.value}
                        onSelect={async (currentValue) => {
                          if (!session?.user?.email || !isInChatRoom) return;

                          const newModel =
                            currentValue === model ? "" : currentValue;
                          setOpen(false);

                          // Update di Firestore
                          const match = pathname?.match(/\/chat\/([^/]+)/);
                          const chatId = match?.[1];

                          if (chatId && newModel && session.user.email) {
                            try {
                              const chatDocRef = doc(
                                db,
                                "users",
                                session.user.email,
                                "chats",
                                chatId
                              );
                              await updateDoc(chatDocRef, { model: newModel });
                            } catch (error) {
                              console.error("Error updating model:", error);
                            }
                          }
                        }}
                      >
                        <div>
                          {framework.label}
                          <p className="text-xs text-white/50">
                            {framework.description}
                          </p>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto",
                            model === framework.value
                              ? "opacity-100 text-white w-4 h-4"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList className="mb-2">
                  <CommandGroup>
                    <CommandItem className="text-white">
                      <p>More Models</p>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* For User Greetigns */}
      <div className="justify-self-center">
        {isInChatRoom && session?.user ? (
          <p className="text-lg font-bold">{title}</p>
        ) : session?.user ? (
          <p className="text-lg font-bold">Hello, {session.user.name}</p>
        ) : (
          <p className="text-lg font-bold">Hello</p>
        )}
      </div>

      <div className="flex items-center gap-3 justify-self-end">
        {/* <ModeToggle /> */}
        <Menu>
          {session?.user ? (
            <MenuButton className="w-8 h-8 mr-2 font-semibold tracking-wide duration-300 rounded-full ring-4 ring-white/10 hover:ring-white/50">
              <Image
                src={imageSrc}
                alt="userImage"
                width={400}
                height={400}
                priority
                className="object-cover w-full h-full rounded-full"
                onError={() => setImageSrc("/logoLight.png")}
              />
            </MenuButton>
          ) : (
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="text-sm font-semibold duration-300 hover:text-white"
            >
              Sign in
            </button>
          )}

          <MenuItems
            transition
            anchor="bottom end"
            className="p-2 origin-top-right mt-2 rounded-xl border border-primary-foreground/20 bg-[#2F2F2F] text-primary-foreground w-64"
          >
            {session?.user ? (
              <div className="border-b border-white/30 px-3 py-2">
                <p className="text-sm text-white/70">{session.user.email}</p>
              </div>
            ) : (
              ""
            )}
            <MenuItem>
              <div className="group flex w-full items-center gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <FiUserPlus className="text-base" />
                </div>
                <p className="text-sm font-medium tracking-wide">Profil</p>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="group flex w-full items-center gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <PiGearSix className="text-base" />
                </div>
                <p className="text-sm font-medium tracking-wide">Pengaturan</p>
              </div>
            </MenuItem>

            <div className="h-px my-1 bg-primary-foreground/20" />
            <MenuItem>
              <SignOut />
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {/* SignInModal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToRegister={switchToRegister}
      />
      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToSignIn={switchToSignIn}
      />
    </div>
  );
};

export default HeaderClient;
