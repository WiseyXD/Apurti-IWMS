
"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter";
import Mainbuttons from "./ui/main-buttons";
export default function TypewriterEffectSmoothDemo() {

    const words = [
        {
            text: "Optimize",
        },
        {
            text: "your",
        },
        {
            text: "warehouse",
        },
        {
            text: "operations",
        },
        {
            text: "with",
        },
        {
            text: "Apurti.",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center h-[40rem]  ">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
                Your journey to seamless warehouse management begins here.
            </p>
            <TypewriterEffectSmooth words={words} />
            <div className="flex flex-col items-center md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                <Mainbuttons />
            </div>
        </div>
    );
}
