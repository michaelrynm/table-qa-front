import { auth } from "@/auth";

import HeaderClient from "./HeaderClient";

const Header = async () => {
  const session = await auth();

  // This part needs to be moved to a client component
  // The modal state cannot be in a server component
  return (
    <>
      <HeaderClient session={session} />
    </>
  );
};

export default Header;
