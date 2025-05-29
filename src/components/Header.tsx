"use client";
import { useSession } from "next-auth/react";
import HeaderClient from "./HeaderClient";

const Header = () => {
  const { data: session } = useSession();
  return <HeaderClient session={session} />;
};

export default Header;
