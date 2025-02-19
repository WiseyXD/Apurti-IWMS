"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { AuthSearchParams } from "@/lib/types";

interface AuthFormProps {
  mode: "login" | "signup";
  title: string;
  description: string;
  handleGoogleAuth: (redirectPath: string) => Promise<void>;
  searchParams: AuthSearchParams;
  alternateAuthLink?: {
    text: string;
    href: string;
  };
}

export default function AuthForm({
  mode,
  title,
  description,
  handleGoogleAuth,
  searchParams,
  alternateAuthLink,
}: AuthFormProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState("/dashboard");

  useEffect(() => {
    const initializeRedirectPath = async () => {
      const params = await searchParams;
      if (params?.invite) {
        setRedirectPath(`/invite/${params.invite}`);
      }
    };
    initializeRedirectPath();
  }, [searchParams]);

  const handleGoogleSubmit = async () => {
    setGoogleLoading(true);
    try {
      await handleGoogleAuth(redirectPath);
    } catch (err) {
      setError("Failed to authenticate with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-cyan-600 via-cyan-500 to-sky-600 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-sky-500/20 to-cyan-700/20 animate-gradient" />

        {/* Glass Morphism Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-cyan-200" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-100">
              Apurti
            </h1>
          </div>
          <p className="text-xl text-cyan-100">Next-Gen Warehouse Management</p>

          <div className="mt-16 space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-lg transition-all duration-300 group-hover:bg-white/20">
                  <CheckCircle2 className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Smart Analytics
                  </h3>
                  <p className="text-cyan-100">
                    AI-powered insights for optimal inventory management
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-lg transition-all duration-300 group-hover:bg-white/20">
                  <CheckCircle2 className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Sync</h3>
                  <p className="text-cyan-100">
                    Instant updates across your entire warehouse network
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-lg transition-all duration-300 group-hover:bg-white/20">
                  <CheckCircle2 className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Smart Integration
                  </h3>
                  <p className="text-cyan-100">
                    Seamless connection with your existing tech stack
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-8 p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
                99.9%
              </div>
              <div className="text-sm text-cyan-100">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
                50%
              </div>
              <div className="text-sm text-cyan-100">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200">
                24/7
              </div>
              <div className="text-sm text-cyan-100">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="border-none shadow-lg bg-white/70 backdrop-blur-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900">
                {title}
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Auth Button */}
              <form action={handleGoogleSubmit} className="space-y-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 text-white flex items-center justify-center gap-3 text-base font-medium transition-all duration-300 rounded-xl"
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {mode === "login" ? "Logging in" : "Signing up"} with
                      Google...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </form>

              {/* Alternate Auth Link */}
              {alternateAuthLink && (
                <div className="text-center pt-4">
                  <Button
                    variant="link"
                    className="text-cyan-600 hover:text-cyan-700 font-medium"
                    onClick={() =>
                      (window.location.href = alternateAuthLink.href)
                    }
                  >
                    {alternateAuthLink.text}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-cyan-50 rounded-full">
              <Sparkles className="w-4 h-4 text-cyan-600 mr-2" />
              <span className="text-sm text-cyan-700 font-medium">
                Trusted by 500+ warehouses worldwide
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center text-sm text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
