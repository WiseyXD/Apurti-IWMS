"use client";
import React from "react";
import { Cover } from "@/components/ui/cover";
import Image from "next/image";
import ProductHunt from "../public/featured.svg";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import Mainbuttons from "./ui/main-buttons";

export default function Hero() {
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col items-center justify-center w-full h-full min-h-screen gap-4 px-4" // Full width and height
            >
                <div className="flex flex-col items-center justify-center w-full space-y-6 max-w-5xl mx-auto"> {/* Centered with max width */}

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white mt-8">
                        AI Powered Warehouse Management System for
                        <br /> <Cover>Everyone</Cover>.
                    </h1>

                    {/* Description Paragraph */}
                    <p className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl">
                        Optimize, Automate & Analyze your inventory with an Intelligent Warehouse Management System
                    </p>

                    {/* Buttons */}
                    <div className="flex space-x-6"> {/* Spacing between buttons */}
                        <Mainbuttons />
                    </div>
                </div>
            </motion.div>
        </AuroraBackground>
    );
}
