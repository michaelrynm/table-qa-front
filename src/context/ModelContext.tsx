"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { db } from "@/firebase";

type ModelContextType = {
  model: string;
  setModel: (model: string) => void;
};

const ModelContext = createContext<ModelContextType>({
  model: "gpt-4o",
  setModel: () => {},
});

export const useModel = () => useContext(ModelContext);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {
  const [model, setModel] = useState("gpt-4o");
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const match = pathname?.match(/\/chat\/([^/]+)/);
    const chatId = match?.[1];

    if (chatId && session?.user?.email) {
      const chatDocRef = doc(db, "users", session.user.email, "chats", chatId);

      const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const newModel = docSnap.data()?.model;
          if (newModel) setModel(newModel);
        }
      });

      return () => unsubscribe();
    }
  }, [pathname, session]);

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
};
