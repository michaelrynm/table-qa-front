"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FaTimes, FaSave, FaComments, FaRobot } from "react-icons/fa";
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
    {
      value: "gpt-4o",
      label: "GPT-4o",
      description: "Advanced reasoning model",
    },
    { value: "o3", label: "o3", description: "Latest generation model" },
    { value: "o4-mini", label: "o4-mini", description: "Fast and efficient" },
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#212121] rounded-2xl shadow-2xl w-full max-w-md border border-primary-foreground/10 animate-in zoom-in-95 duration-200">
        <div className="relative p-6 pb-4 border-b border-primary-foreground/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
              <FaComments className="text-blue-400" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">Edit Chat</h2>
          </div>
          <p className="text-sm text-gray-400">
            Ubah judul dan model AI untuk percakapan ini
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
            disabled={isLoading}
          >
            <FaTimes size={16} />
          </button>
        </div>

        <form onSubmit={handleUpdateChat} className="p-6 space-y-6">
          <div className="space-y-3">
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-semibold text-white"
            >
              <FaComments className="text-blue-400" size={14} />
              Judul Chat
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul chat..."
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-primary-foreground/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <FaRobot className="text-purple-400" size={14} />
              Model AI
            </label>
            <div className="space-y-2">
              {modelOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selectedModel === option.value
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-primary-foreground/20 bg-[#2a2a2a] hover:border-primary-foreground/30 hover:bg-primary-foreground/5"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={selectedModel === option.value}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedModel === option.value
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400"
                        }`}
                      >
                        {selectedModel === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <div className="p-1 rounded-lg bg-white/10">
                    <FaSave size={14} />
                  </div>
                  <span>Simpan Perubahan</span>
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
