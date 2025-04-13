"use client";;
import { use } from "react";

import AuthForm from "@/components/auth/AuthForm";
import { handleGoogleSignIn } from "@/actions";
import { AuthSearchParams } from "@/lib/types";

interface PageProps {
  searchParams: Promise<AuthSearchParams>;
}

export default function LoginPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  console.log(searchParams);
  const aryan = "13";
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
