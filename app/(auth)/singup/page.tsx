"use client";

import { handleGoogleSignIn } from "@/actions";
import { AuthSearchParams } from "../../../lib/types";
import AuthForm from "@/components/AuthForm";

interface PageProps {
  searchParams: AuthSearchParams;
}

export default function SignupPage({ searchParams }: PageProps) {
  return (
    <AuthForm
      mode="signup"
      title="Create your Influencer Account"
      description="Join thousands of successful influencers"
      handleGoogleAuth={handleGoogleSignIn}
      searchParams={searchParams}
      alternateAuthLink={{
        text: "Already have an account? Sign in",
        href: "/login",
      }}
    />
  );
}
