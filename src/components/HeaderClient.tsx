"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image, { StaticImageData } from "next/image";
import {
  FiChevronDown,
  FiChevronRight,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";
import { HiMenuAlt3 } from "react-icons/hi";
import SignOut from "./SignOut";
import { useState, useEffect } from "react";
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
import DeleteAllChatsModal from "./DeleteAllChatModal";

interface HeaderClientProps {
  session: Session | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const frameworks = [
  {
    value: "gpt-4o",
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

const HeaderClient = ({
  session: serverSession,
  sidebarOpen,
  setSidebarOpen,
}: HeaderClientProps) => {
  const { data: clientSession } = useSession();
  const session = serverSession || clientSession;
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | StaticImageData>(
    session?.user?.image || Avatar
  );
  const pathname = usePathname();
  const [title, setTitle] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [isInChatRoom, setIsInChatRoom] = useState<boolean>(false);
  const [_isUpdatingModel, setIsUpdatingModel] = useState(false);

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

  return (
    <div className="absolute top-0 left-0 grid items-center justify-between w-full grid-cols-3 px-5 py-2 shadow-xl bg-[#212121]">
      <div className="justify-self-start">
        <div className="flex items-center gap-3">
          {/* Toggle Sidebar Button - hanya muncul ketika sidebar tertutup */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 mr-2"
              title="Open sidebar"
            >
              <HiMenuAlt3 size={18} />
            </button>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                role="combobox"
                aria-expanded={open}
                className={`flex items-center gap-1 justify-between bg-[#2F2F2F] px-3 py-2 rounded-lg text-primary-foreground/80 font-semibold tracking-wide text-base hover:bg-primaryGray/50`}
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
                          setIsUpdatingModel(true);
                          const newModel = currentValue;

                          setModel(newModel);
                          setOpen(false);

                          const match = pathname?.match(/\/chat\/([^/]+)/);
                          const chatId = match?.[1];

                          if (chatId && newModel && session?.user?.email) {
                            try {
                              const chatDocRef = doc(
                                db,
                                "users",
                                session.user.email,
                                "chats",
                                chatId
                              );
                              await updateDoc(chatDocRef, { model: newModel });
                              console.log(
                                "Model updated successfully:",
                                newModel
                              );
                            } catch (error) {
                              console.error("Error updating model:", error);
                              setModel(model);
                            } finally {
                              setIsUpdatingModel(false);
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

      <div className="justify-self-center">
        {isInChatRoom && session?.user ? (
          <p className="text-lg font-bold">{title}</p>
        ) : (
          <p className="text-lg font-bold">Hello, {session?.user?.name}</p>
        )}
      </div>

      <div className="flex items-center gap-3 justify-self-end">
        <Menu>
          <MenuButton className="relative group w-10 h-10 mr-2 font-semibold tracking-wide duration-300 rounded-xl ring-2 ring-white/10 hover:ring-white/30 hover:shadow-lg hover:shadow-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm">
            <Image
              src={imageSrc}
              alt="userImage"
              width={400}
              height={400}
              priority
              className="object-cover w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageSrc("/logoLight.png")}
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2F2F2F] shadow-lg animate-pulse" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="p-1 origin-top-right mt-3 rounded-2xl border border-white/10 bg-[#2F2F2F]/95 backdrop-blur-xl text-primary-foreground w-72 shadow-2xl shadow-black/50 transition-all duration-200 data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="border-b border-white/10 px-4 py-3 bg-gradient-to-r from-white/5 to-transparent rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                  <FiUser className="text-sm text-white/80" />
                </div>
                <div>
                  <p className="text-xs text-white/60 font-medium uppercase tracking-wider">
                    Akun Aktif
                  </p>
                  <p className="text-sm text-white/90 font-medium truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2 space-y-1">
              <MenuItem>
                <button className="group flex w-full items-center gap-3 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:shadow-lg hover:shadow-white/5">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-400/40 transition-colors duration-200">
                    <FiUserPlus className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white group-hover:text-white/90 transition-colors duration-200">
                      Profil
                    </p>
                    <p className="text-xs text-white/50 group-hover:text-white/60 transition-colors duration-200">
                      Kelola informasi akun
                    </p>
                  </div>
                  <FiChevronRight className="text-white/30 group-hover:text-white/50 group-hover:translate-x-1 transition-all duration-200" />
                </button>
              </MenuItem>

              <MenuItem>
                <div
                  className="rounded-xl overflow-hidden"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DeleteAllChatsModal />
                </div>
              </MenuItem>
            </div>

            <div className="h-px mx-3 my-2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="p-2">
              <MenuItem>
                <div
                  className="rounded-xl overflow-hidden"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <SignOut />
                </div>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default HeaderClient;
