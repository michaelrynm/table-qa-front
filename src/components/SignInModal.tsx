import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { googleImage } from "../app/assets";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Login failed. Try user@example.com / password123");
      setEmail("");
      setPassword("");
      setIsLoading(false);
    } else {
      toast.success("Sign In successfully!");
      setEmail("");
      setPassword("");
      setIsLoading(false);
      onClose(); // tutup modal dulu
      router.push("/");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-[#2F2F2F] w-96 flex flex-col gap-5 items-center justify-center rounded-lg p-6 shadow-xl"
      >
        <div className="px-5 text-center place-items-center">
          <Image src={"/favicon.ico"} alt="logo" width={64} height={64} />
          <p className="text-3xl font-bold tracking-wide text-white">
            Welcome back
          </p>
          <p className="mt-2 text-sm font-medium tracking-wide text-white/70">
            Log in or sign up to get smarter responses, upload files and images,
            and more.
          </p>
        </div>

        <div className="w-full">
          <form
            onSubmit={handleEmailLogin}
            className="flex flex-col w-full gap-5"
          >
            <div>
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 text-white w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-white">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#3A3A3A] border border-white/20 rounded-md px-4 py-2 pr-10 text-white w-full"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2 text-base font-semibold text-black duration-300 ease-in-out bg-white rounded-md hover:bg-white/90"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="text-right">
              <p className="text-sm text-white/80">
                Don&#39;t have an account?
                <span
                  onClick={onSwitchToRegister}
                  className="ml-1 font-bold text-white cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>

        <div className="flex items-center w-full gap-2 my-4">
          <div className="flex-grow border-t border-white/30" />
          <span className="text-sm font-medium text-white">or</span>
          <div className="flex-grow border-t border-white/30" />
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex items-center justify-center w-full gap-2 px-6 py-2 text-base font-semibold duration-300 ease-in-out border rounded-md border-white/50 hover:border-white text-white/80 hover:text-white"
        >
          <Image src={googleImage} alt="googleImage" className="w-6 h-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInModal;
