"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FaTimes, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface EditChatModalProps {
  isOpen: boolean;
  chatId: string;
  initialTitle: string;
  initialModel: string;
  onClose: () => void;
}

const EditChatModal: React.FC<EditChatModalProps> = ({
  isOpen,
  chatId,
  initialTitle,
  initialModel,
  onClose,
}) => {
  const { data: session } = useSession();
  const [title, setTitle] = useState(initialTitle);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [isLoading, setIsLoading] = useState(false);

  const modelOptions = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "o3", label: "o3" },
    { value: "o4-mini", label: "o4-mini" },
  ];

  useEffect(() => {
    setTitle(initialTitle);
    setSelectedModel(initialModel);
  }, [initialTitle, initialModel]);

  const handleUpdateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chatId || !session?.user?.email) return;

    setIsLoading(true);
    try {
      await updateDoc(doc(db, "users", session.user.email, "chats", chatId), {
        title: title.trim(),
        model: selectedModel,
      });
      toast.success("Chat updated");
      onClose();
    } catch (error) {
      console.error("Error updating chat:", error);
      toast.error("Gagal memperbarui chat");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#212121] rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          disabled={isLoading}
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-semibold text-white mb-6">Edit Chat</h2>
        <form onSubmit={handleUpdateChat} className="space-y-4">
          <div>
            <label className="text-white block mb-1">Judul Chat</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
              className="w-full text-black px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <div>
            <label className="text-white block mb-1">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading}
              className="w-full text-black px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-white"
            >
              {modelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="mt-10 w-full flex items-center justify-center gap-2 px-10 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FaSave /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChatModal;
