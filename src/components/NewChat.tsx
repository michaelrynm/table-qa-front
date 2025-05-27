"use client";
import React, { useState } from "react";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const NewChat = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isLoading, setIsLoading] = useState(false);

  const modelOptions = [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "o3", label: "o3" },
    { value: "o4-mini", label: "o4-mini" },
  ];

  const openModal = () => {
    setIsModalOpen(true);
    setTitle("");
    setSelectedModel("gpt-4o");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setSelectedModel("gpt-4o");
  };

  const createNewChat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Judul chat tidak boleh kosong!");
      return;
    }

    if (!session?.user?.email) {
      toast.error("Silahkan Login Terlebih Dahulu!");
      return;
    }

    setIsLoading(true);

    try {
      const doc = await addDoc(
        collection(db, "users", session?.user?.email as string, "chats"),
        {
          userId: session?.user?.email as string,
          title: title.trim(),
          model: selectedModel,
          createdAt: serverTimestamp(),
        }
      );

      closeModal();
      router.push(`/chat/${doc?.id}`);
      toast.success("New chat created");
    } catch (error) {
      console.error("Error creating new chat:", error);
      alert("Terjadi kesalahan saat membuat chat baru. Silakan coba lagi.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 text-xs md:text-base border border-primary-foreground/10 w-full rounded-md px-2 py-1 hover:bg-primary-foreground/10 duration-300 ease-in-out"
      >
        <FaPlus /> New Chat
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-[#212121] rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-700 transition-colors"
              disabled={isLoading}
            >
              <FaTimes size={16} />
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-white mb-6">
              Buat Chat Baru
            </h2>

            {/* Form */}
            <form onSubmit={createNewChat} className="space-y-4">
              {/* Title Input */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Judul Chat
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul chat..."
                  className="text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Model Selection */}
              <div>
                <label
                  htmlFor="model"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Model
                </label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="text-black w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  disabled={isLoading}
                >
                  {modelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Membuat...
                    </>
                  ) : (
                    <>
                      <FaPlus size={14} />
                      Buat Chat
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewChat;
