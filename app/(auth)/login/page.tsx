"use client";

import AuthForm from "@/components/auth/AuthForm";
import { handleGoogleSignIn } from "@/actions";
import { AuthSearchParams } from "@/lib/types";

interface PageProps {
  searchParams: AuthSearchParams;
}

export default function LoginPage({ searchParams }: PageProps) {
  console.log(searchParams);
  const aryan = "12213";
  return (
    <AuthForm
      mode="login"
      title="Sign in to Apurti"
      description="Maximize your warehouse efficiency with Apurti"
      handleGoogleAuth={handleGoogleSignIn}
      searchParams={searchParams}
      alternateAuthLink={{
        text: "New to Apurti? Create an account",
        href: "/signup",
      }}
    />
  );
}
