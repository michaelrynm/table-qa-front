import Image from "next/image";
import React, { useState, useRef } from "react";
import { googleImage } from "../app/assets";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import Logo from "../app/assets/images/bps-logo.png";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onSwitchToSignIn,
}) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (validateForm()) {
      try {
        toast.success("Registration successful! Please sign in.");
        resetForm();
        onSwitchToSignIn();
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Registration failed. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
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
          <h2 className="text-xl font-bold text-white mt-3">Create account</h2>
          <p className="text-sm text-gray-400 mt-1">
            Sign up to get smarter responses, upload files and images, and more.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="p-6 space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-white"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-[#2a2a2a] border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
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
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={isPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-[#2a2a2a] border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
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
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Switch to sign in */}
          <p className="text-sm text-white text-center">
            Already have an account?{" "}
            <span
              onClick={onSwitchToSignIn}
              className="ml-1 font-bold text-white cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>

          {/* Divider */}
          <div className="flex items-center w-full gap-2 my-2">
            <div className="flex-grow border-t border-white/30" />
            <span className="text-sm font-medium text-white">or</span>
            <div className="flex-grow border-t border-white/30" />
          </div>

          {/* Google Sign up */}
          <button
            onClick={() => signIn("google")}
            type="button"
            className="flex items-center justify-center w-full gap-3 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <Image src={googleImage} alt="google" className="w-6 h-6" />
            <span>Sign up with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
