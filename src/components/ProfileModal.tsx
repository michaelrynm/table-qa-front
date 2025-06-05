"use client";
import React from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { FaUser, FaTimes, FaEnvelope, FaEdit, FaCog } from "react-icons/fa";

// Definisi interface untuk user data
interface User {
  name: string;
  email: string;
  avatar: string;
  joinedYear?: number;
}

// Props interface dengan lebih spesifik
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  user: User | null;
}

// Komponen InfoCard terpisah untuk reusability
interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor?: string;
  iconColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  label,
  value,
  bgColor = "bg-[#2a2a2a]",
  iconColor = "bg-blue-500/10",
}) => (
  <div
    className={`p-4 rounded-xl ${bgColor} border border-primary-foreground/20`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
      <div className="flex-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </label>
        <div className="text-white font-medium mt-1">{value}</div>
      </div>
    </div>
  </div>
);

// Komponen Avatar terpisah untuk reusability
interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
  editable?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 24,
  editable = true,
}) => (
  <div className="relative">
    <div
      className={`w-${size} h-${size} rounded-2xl overflow-hidden border-4 border-gradient-to-br from-blue-500/30 to-purple-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback jika gambar gagal dimuat
          const target = e.target as HTMLImageElement;
          target.src = "/default-avatar.png";
        }}
      />
    </div>
    {editable && (
      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
        <FaEdit size={12} />
      </div>
    )}
  </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpen,
  user,
}) => {
  // Early return jika user null
  if (!user) {
    return null;
  }

  const { name, email, avatar, joinedYear = 1999 } = user;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[9999]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <DialogPanel className="bg-gradient-to-br from-[#1a1a1a] to-[#212121] rounded-2xl shadow-2xl w-full max-w-md border border-primary-foreground/10 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-primary-foreground/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
                <FaUser className="text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Profile Pengguna</h2>
            </div>
            <p className="text-sm text-gray-400">
              Informasi akun dan pengaturan profil
            </p>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
              aria-label="Tutup modal"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar
                src={avatar}
                alt={`Avatar ${name}`}
                size={24}
                editable={true}
              />
            </div>

            {/* Info Cards */}
            <div className="space-y-3">
              <InfoCard
                icon={<FaUser className="text-blue-400" size={16} />}
                label="Nama Lengkap"
                value={name}
                iconColor="bg-blue-500/10"
              />

              <InfoCard
                icon={<FaEnvelope className="text-purple-400" size={16} />}
                label="Email Address"
                value={email}
                iconColor="bg-purple-500/10"
              />

              <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                <div className="text-center">
                  <div className="text-sm text-green-400 font-medium">
                    Bergabung Sejak {joinedYear}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProfileModal;
