import Image from "next/image";
import React, { useState, useRef } from "react";
import { googleImage } from "../app/assets";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "@/src/app/assets/images/bps-logo.png";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        alert("Login failed. Try user@example.com / password123");
        setEmail("");
        setPassword("");
      } else if (result?.ok) {
        toast.success("Sign In successfully!");
        setEmail("");
        setPassword("");
        onClose();

        router.push("/");
      } else {
        console.warn("Unexpected login result:", result);
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login exception:", error);
      alert("Login failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#212121] rounded-2xl shadow-2xl w-full max-w-md border border-white/10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10 text-center">
          <Image
            src={Logo}
            alt="logo"
            width={64}
            height={64}
            className="mx-auto"
          />
          <h2 className="text-xl font-bold text-white mt-3">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">
            Log in or sign up to get smarter responses, upload files and images,
            and more.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailLogin} className="p-6 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-[#2a2a2a] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                required
              />
              {isPasswordVisible ? (
                <FaRegEye
                  onClick={() => setIsPasswordVisible(false)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white cursor-pointer"
                />
              ) : (
                <FaRegEyeSlash
                  onClick={() => setIsPasswordVisible(true)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Sign In"
            )}
          </button>

          {/* Switch to register */}
          <p className="text-sm text-white text-center">
            Don&#39;t have an account?{" "}
            <span
              onClick={onSwitchToRegister}
              className="ml-1 font-bold text-white cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </p>

          {/* Divider */}
          <div className="flex items-center w-full gap-2 my-2">
            <div className="flex-grow border-t border-white/30" />
            <span className="text-sm font-medium text-white">or</span>
            <div className="flex-grow border-t border-white/30" />
          </div>

          {/* Google Sign in */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            type="button"
            className="flex items-center justify-center w-full gap-3 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <Image src={googleImage} alt="google" className="w-6 h-6" />
            <span>Sign in with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;
