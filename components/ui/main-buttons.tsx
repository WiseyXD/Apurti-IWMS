import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "./button";
import Link from "next/link";

export default function Mainbuttons() {
  return (
    <>
      <Link href="/login">
        <Button
          variant="outline"
          className="text-black flex gap-x-3 md:px-8 md:py-4 md:text-lg rounded-full group"
        >
          Get Started
          <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>
      </Link>
    </>
  );
}
