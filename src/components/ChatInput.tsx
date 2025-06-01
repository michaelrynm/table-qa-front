"use client";
import { db } from "@/firebase";
import { Message } from "@/type";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ImArrowUpRight2 } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import useSWR from "swr";
import { VscVscodeInsiders } from "react-icons/vsc";
import { FaSpinner } from "react-icons/fa6";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

const ChatInput = ({ id }: { id?: string }) => {
  const chatId = id;
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const [currentModel, setCurrentModel] = useState("gpt-4o");

  const frameworks = [
    {
      value: "gpt-4o",
      label: "GPT-4o",
    },
    {
      value: "o3",
      label: "o3",
    },
    {
      value: "o4-mini",
      label: "o4-mini",
    },
  ];

  const fetchModelFromFirestore = async () => {
    const match = pathname?.match(/\/chat\/([^/]+)/);
    const chatId = match?.[1];

    if (chatId && session?.user?.email) {
      try {
        const chatDocRef = doc(
          db,
          "users",
          session.user.email,
          "chats",
          chatId
        );
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setCurrentModel(chatData.model || "gpt-4o");
        } else {
          setCurrentModel("gpt-4o");
        }
      } catch (error) {
        console.error("Error fetching model:", error);
        setCurrentModel("gpt-4o");
      }
    } else {
      setCurrentModel("gpt-4o");
    }
  };

  useEffect(() => {
    fetchModelFromFirestore();
  }, [pathname, session]);

  const userEmail = session?.user
    ? (session?.user?.email as string)
    : "unknown";
  const userName = session?.user ? (session?.user?.email as string) : "unknown";

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);

    // Auto-resize logic
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const sendMessage = async (input: string) => {
    if (!input.trim()) return;

    const message: Message = {
      text: input.trim(),
      createdAt: serverTimestamp(),
      user: {
        _id: userEmail,
        name: userName,
        avatar:
          (session?.user?.image as string) ||
          "https://i.ibb.co.com/XC0YX8v/avatar.png",
      },
    };

    try {
      setLoading(true);
      let chatDocumentId = chatId;

      if (!chatId) {
        const docRef = await addDoc(
          collection(db, "users", userEmail, "chats"),
          {
            userId: userEmail,
            createdAt: serverTimestamp(),
          }
        );
        chatDocumentId = docRef.id;
        router.push(`/chat/${chatDocumentId}`);
      }

      await addDoc(
        collection(
          db,
          "users",
          userEmail,
          "chats",
          chatDocumentId as string,
          "messages"
        ),
        message
      );
      setPrompt("");

      const loadingMessage = {
        text: "",
        createdAt: serverTimestamp(),
        isLoading: true,
        user: {
          _id: "ChatGPT",
          name: "ChatGPT",
          avatar:
            "https://res.cloudinary.com/duehd78sl/image/upload/v1729227742/logoLight_amxdpz.png",
        },
      };

      const loadingDocRef = await addDoc(
        collection(
          db,
          "users",
          userEmail,
          "chats",
          chatDocumentId as string,
          "messages"
        ),
        loadingMessage
      );

      await fetch("/api/askchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          id: chatDocumentId,
          model: currentModel,
          session: userEmail,
          loadingMessageId: loadingDocRef.id,
        }),
      }).then(async (res) => {
        const data = await res.json();

        if (!data?.success) {
          console.error("Fetch error:", data?.message);
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(prompt);
      setPrompt("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center max-w-3xl mx-auto pt-3">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 rounded-2xl items-center px-4 py-2.5 w-full"
      >
        <div>
          <textarea
            rows={1}
            value={prompt}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT"
            className="bg-transparent mt-2 text-primary-foreground font-medium placeholder:text-primary-foreground/50 outline-none w-full resize-none"
            disabled={loading}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-3 items-center">
            <div className="rounded-full hover:bg-white/50 cursor-pointer">
              <IoMdAdd className="text-xl text-primary-foreground" />
            </div>
            <div className="border border-white/50 rounded-full hover:bg-white/50 cursor-pointer py-1 px-2">
              <p className="text-primary-foreground text-xs">
                {frameworks.find((f) => f.value === currentModel)?.label ||
                  currentModel}
              </p>
            </div>
            <div className="border border-white/50 rounded-full hover:bg-white/50 cursor-pointer py-1 px-2 flex gap-1 items-center">
              <VscVscodeInsiders />
              <p className="text-primary-foreground text-xs">web development</p>
            </div>
          </div>

          <button
            disabled={!prompt || loading}
            type="submit"
            className={`p-2 rounded-full text-black flex items-center justify-center transition-transform duration-200 bg-white disabled:bg-white/30`}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <ImArrowUpRight2 className="-rotate-45 text-sm text-primary/80" />
            )}
          </button>
        </div>
      </form>

      {id && (
        <p className="text-xs mt-2 font-medium tracking-wide">
          ChatGPT can make mistakes. Check important info.
        </p>
      )}
      <div className="w-full md:hidden mt-2">{/* <ModelSelection /> */}</div>
    </div>
  );
};

export default ChatInput;
