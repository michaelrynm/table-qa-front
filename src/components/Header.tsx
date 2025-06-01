"use client";
import { useSession } from "next-auth/react";
import HeaderClient from "./HeaderClient";

interface HeaderClientProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderClientProps) => {
  const { data: session } = useSession();
  return (
    <HeaderClient
      session={session}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
};

export default Header;
