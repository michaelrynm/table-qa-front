"use client";
import SignInModal from "@/src/components/SignInModal";
import RegisterModal from "@/src/components/RegisterModal";
import { useState } from "react";

export default function Login() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] =
    useState<boolean>(false);

  const switchToSignIn = () => {
    setIsRegisterModalOpen(false);
    setIsSignInModalOpen(true);
  };

  const switchToRegister = () => {
    setIsSignInModalOpen(false);
    setIsRegisterModalOpen(true);
  };
  return (
    <div>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToRegister={switchToRegister}
      />
      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToSignIn={switchToSignIn}
      />
    </div>
  );
}
