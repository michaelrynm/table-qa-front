import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { googleImage } from "../app/assets";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle dummy login menggunakan NextAuth
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Login failed. Try user@example.com / password123");
    } else {
      toast.success("Sign In successfully!");
      setEmail("");
      setPassword("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#2F2F2F] w-96 flex flex-col gap-5 items-center justify-center rounded-lg p-6 shadow-xl"
      >
        <div className="px-5 text-center">
          <p className="text-3xl font-bold tracking-wide text-white">
            Welcome back
          </p>
          <p className="text-sm tracking-wide mt-2 font-medium text-white/70">
            Log in or sign up to get smarter responses, upload files and images,
            and more.
          </p>
        </div>

        <div className="w-full">
          <form
            onSubmit={handleEmailLogin}
            className="flex flex-col gap-5 w-full"
          >
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 text-white w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 text-white w-full"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-white text-black py-2 px-6 rounded-md text-base font-semibold hover:bg-white/90 duration-300 ease-in-out"
            >
              Sign In
            </button>
            <div className="text-right">
              <p className="text-sm">
                Don't have an account?
                <span
                  onClick={onSwitchToRegister}
                  className="font-bold cursor-pointer ml-1 text-white"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2 w-full my-4">
          <div className="border-t border-white/30 flex-grow" />
          <span className="text-white text-sm font-medium">or</span>
          <div className="border-t border-white/30 flex-grow" />
        </div>

        <button
          onClick={() => signIn("google")}
          className="border border-white/50 py-2 px-6 rounded-md text-base font-semibold flex items-center gap-2 hover:border-white text-white/80 hover:text-white duration-300 ease-in-out w-full justify-center"
        >
          <Image src={googleImage} alt="googleImage" className="w-6 h-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInModal;
