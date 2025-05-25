"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { FiChevronDown, FiUserPlus } from "react-icons/fi";
import { PiGearSix } from "react-icons/pi";
import SignOut from "./SignOut";
import { useState, useEffect } from "react";
import SignInModal from "./SignInModal";
import RegisterModal from "./RegisterModal";
import { useSession } from "next-auth/react";

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
    value: "GPT-4o",
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
  const [value, setValue] = useState("");

  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);
  // const { data: session } = useSession();
  const [imageSrc, setImageSrc] = useState<string>(
    session?.user?.image || "/logoLight.png"
  );

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
    <div className="absolute top-0 left-0 grid items-center justify-between w-full grid-cols-3 px-5 py-2 shadow-xl">
      <div className="justify-self-start">
        {/* <Menu>
          <MenuButton className="flex items-center gap-1 bg-[#2F2F2F] hover:bg-primaryGray/50 px-3 py-2 rounded-lg text-primary-foreground/80 font-semibold tracking-wide">
            ChatGPT
            <FiChevronDown className="text-lg" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom start"
            className="p-2 origin-top-right mt-2 rounded-xl border border-primary-foreground/20 bg-[#2F2F2F] text-primary-foreground"
          >
            <MenuItem>
              <div className="group flex w-full items-center justify-between gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <BsStars className="text-base rotate-90" />
                </div>
                <div className="text-sm">
                  <p className="tracking-wide bold-semibold">ChatGPT Plus</p>
                  <p className="text-xs text-primary-foreground/80">
                    Our smartest model & more
                  </p>
                </div>
                <button className="text-xs font-semibold tracking-wide border border-white/20 px-4 py-1.5 ml-2 rounded-full text-primary-foreground">
                  Upgrade
                </button>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="group flex w-full items-center  gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <PiAtom className="text-base rotate-90" />
                </div>
                <div className="text-sm">
                  <p className="tracking-wide bold-semibold">ChatGPT</p>
                  <p className="text-xs text-[#B4B4B4]">
                    Great for everyday task
                  </p>
                </div>
                <div className="flex justify-end flex-1">
                  <IoCheckmarkCircleSharp className="text-xl" />
                </div>
              </div>
            </MenuItem>

            <MenuItem>
              <div className="group flex w-full items-center  gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <PiAtom className="text-base rotate-90" />
                </div>
                <div className="text-sm">
                  <p className="tracking-wide bold-semibold">ChatGPT</p>
                  <p className="text-xs text-[#B4B4B4]">
                    Great for everyday task
                  </p>
                </div>
                <div className="flex justify-end flex-1">
                  <IoCheckmarkCircleSharp className="text-xl" />
                </div>
              </div>
            </MenuItem>

            <div className="h-px my-1 bg-primary-foreground/10" />
            <MenuItem>
              <div className="group flex w-full items-center  gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <PiSelectionBackgroundLight className="text-lg" />
                </div>

                <p className="text-sm tracking-wide bold-semibold">
                  Temporary chat
                </p>

                <div className="flex justify-end flex-1">
                  <Switch className="group relative flex h-6.5 w-10 cursor-pointer rounded-full bg-transparent border border-white/30 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-primaryGreen">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-4"
                    />
                  </Switch>
                </div>
              </div>
            </MenuItem>
          </MenuItems>
        </Menu> */}

        <div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                role="combobox"
                aria-expanded={open}
                className=" flex items-center gap-1 justify-between bg-[#2F2F2F] hover:bg-primaryGray/50 px-3 py-2 rounded-lg text-primary-foreground/80 font-semibold tracking-wide text-base"
              >
                {"ChatGPT"}
                {value && (
                  <>
                    <span className="font-light text-white/50">
                      {frameworks.find((f) => f.value === value)?.label}
                    </span>
                  </>
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
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
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
                            value === framework.value
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
      <div className="justify-self-center ">
        {session?.user ? (
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
            className="p-2 origin-top-right mt-2 rounded-xl border border-primary-foreground/20 bg-[#2F2F2F] text-primary-foreground"
          >
            <MenuItem>
              <div className="group flex w-full items-center gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <FiUserPlus className="text-base" />
                </div>
                <p className="text-sm font-medium tracking-wide">Profil</p>
              </div>
            </MenuItem>
            {/* <MenuItem>
              <div className="group flex w-full items-center gap-3 rounded-lg p-3 cursor-pointer data-[focus]:bg-white/10">
                <div className="w-7 h-7 bg-[#B4B4B440] rounded-full flex items-center justify-center">
                  <MdOutlineDashboardCustomize className="text-base" />
                </div>
                <p className="text-sm font-medium tracking-wide">
                  Customize ChatGPT
                </p>
              </div>
            </MenuItem> */}
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
