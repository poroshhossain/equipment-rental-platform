"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

const LoginWithGoogleBtn = () => {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <Button onClick={signIn} variant="outline" className="mx-auto w-full">
      <FcGoogle size={20} />
      Continue with Google
    </Button>
  );
};

export default LoginWithGoogleBtn;