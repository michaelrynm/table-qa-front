import { signIn } from "@/auth";
import Image from "next/image";
import React from "react";
import { googleImage } from "../app/assets";

const SignIn = () => {
  return (
    <div className="bg-[#2F2F2F] w-96 h-96 flex flex-col gap-5 items-center justify-center rounded-lg">
      <div className="px-10 text-center">
        <p className="text-3xl font-bold tracking-wide">Welcome back</p>
        <p className="mt-2 text-base font-medium tracking-wide">
          Log in or sign up to get smarter responses, upload files and images,
          and more.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-1 px-6 py-2 text-base font-semibold duration-300 ease-in-out border rounded-md border-white/50 hover:border-white text-white/80 hover:text-white"
          >
            <Image src={googleImage} alt="googleImage" className="w-8" /> Signin
            with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
