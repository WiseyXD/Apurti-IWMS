"use client";

import AuthForm from "@/components/AuthForm";
import { handleGoogleSignIn } from "@/actions";
import { AuthSearchParams } from "@/lib/types";

interface PageProps {
  searchParams: AuthSearchParams;
}

export default function LoginPage({ searchParams }: PageProps) {
  return (
    <AuthForm
      mode="login"
      title="Sign in to Influencer Portal"
      description="Maximize your influence and revenue potential"
      handleGoogleAuth={handleGoogleSignIn}
      searchParams={searchParams}
      alternateAuthLink={{
        text: "New to Infloq? Create an influencer account",
        href: "/signup",
      }}
    />
  );
}
