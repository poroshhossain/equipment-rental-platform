"use client";

import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

const LoginWithGoogleBtn = () => {
  const signIn = async () => {
    toast.info("Redirecting to Google…");
    await authClient.signIn.social({ provider: "google" });
  };

  return (
    <Button onClick={signIn} variant="outline" className="mx-auto w-full">
      <FcGoogle size={20} />
      Continue with Google
    </Button>
  );
};

export default LoginWithGoogleBtn;