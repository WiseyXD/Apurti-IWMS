// components/dashboard/header.tsx
"use client";

import { Box } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export function DashboardHeader({ userEmail }: { userEmail: string }) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <Box className="w-6 h-6 text-cyan-600" />
          <span className="text-xl font-semibold text-slate-900">
            Apurti Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Image
              src="https://github.com/shadcn.png"
              alt="avatar"
              width={10}
              height={10}
              className="rounded-full bg-slate-100"
            />
            <span>{userEmail}</span>
          </div>
        </div>
        <div className="hidden md:block">
          <Button onClick={() => signOut()} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
