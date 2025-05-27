import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { googleImage } from "../app/assets";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Loader2 } from "lucide-react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
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
        // Here you would typically make an API call to register the user
        // For demo purposes, we'll just show a success message
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#2F2F2F] w-96 flex flex-col gap-5 items-center justify-center rounded-lg p-6 shadow-xl"
      >
        <div className="px-5 text-center place-items-center">
          <Image src={"/favicon.ico"} width={64} height={64} alt="logo" />
          <p className="text-3xl font-bold tracking-wide text-white">
            Create account
          </p>
          <p className="text-sm tracking-wide mt-2 font-medium text-white/70">
            Sign up to get smarter responses, upload files and images, and more.
          </p>
        </div>

        <div className="w-full">
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4 w-full"
          >
            <div>
              <label
                htmlFor="fullName"
                className="text-white text-sm mb-1 block"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 text-white w-full"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-white text-sm mb-1 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 text-white w-full"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-white text-sm mb-1 block"
              >
                Password
              </label>
              <div className="relative">
                {isPasswordVisible ? (
                  <FaRegEye
                    className="absolute text-white -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                ) : (
                  <FaRegEyeSlash
                    className="absolute text-white -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                )}
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 text-white w-full"
                />
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-white text-sm mb-1 block"
              >
                Confirm Password
              </label>
              <div className="relative">
                {isPasswordVisible ? (
                  <FaRegEye
                    className="absolute text-white -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                ) : (
                  <FaRegEyeSlash
                    className="absolute text-white -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                )}
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 text-white w-full"
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-white text-black py-2 px-6 rounded-md text-base font-semibold hover:bg-white/90 duration-300 ease-in-out mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
            <div className="text-right">
              <p className="text-sm text-white">
                Already have an account?
                <span
                  onClick={onSwitchToSignIn}
                  className="font-bold cursor-pointer ml-1 text-white"
                >
                  Sign In
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
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
