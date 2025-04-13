"use client";;
import { use } from "react";

import { handleGoogleSignIn } from "@/actions";
import { AuthSearchParams } from "../../../lib/types";
import AuthForm from "@/components/auth/AuthForm";

interface PageProps {
  searchParams: Promise<AuthSearchParams>;
}

export default function SignupPage(props: PageProps) {
  const searchParams = use(props.searchParams);
  return (
    <AuthForm
      mode="signup"
      title="Create an account with Apurti"
      description="Join thousands of successful warehouses and streamline your operations with Apurti"
      handleGoogleAuth={handleGoogleSignIn}
      searchParams={searchParams}
      alternateAuthLink={{
        text: "Already have an account? Sign in",
        href: "/login",
      }}
    />
  );
}
