import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sesion = await auth();
  if (!sesion) {
    redirect("/");
  }
  return <div>{children}</div>;
}
