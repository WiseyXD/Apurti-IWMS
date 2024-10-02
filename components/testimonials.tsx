
"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./ui/moving-cards";

export function InfiniteMovingCardsDemo() {
    return (
        <div className="h-[80rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
            <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                Loved by people all over the universe
            </h4>

            <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                Hear from warehouse managers and businesses who’ve transformed their operations with Apurti, real stories of success powered by our innovative solutions.
            </p>

            <InfiniteMovingCards
                items={testimonials}
                direction="right"
                speed="slow"
            />

            <InfiniteMovingCards
                items={testimonials}
                direction="left"
                speed="slow"
            />

            <InfiniteMovingCards
                items={testimonials}
                direction="right"
                speed="slow"
            />

        </div>
    );
}

const testimonials = [
    {
        quote:
            "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
        name: "Charles Dickens",
        title: "A Tale of Two Cities",
        image: "https://ai-saas-template-aceternity.vercel.app/_next/image?url=https%3A%2F%2Fi.pravatar.cc%2F150%3Fimg%3D7&w=256&q=75",
    },
    {
        quote:
            "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
        name: "William Shakespeare",
        title: "Hamlet",
        image: "https://ai-saas-template-aceternity.vercel.app/_next/image?url=https%3A%2F%2Fi.pravatar.cc%2F150%3Fimg%3D10&w=256&q=75",
    },
    {
        quote: "All that we see or seem is but a dream within a dream.",
        name: "Edgar Allan Poe",
        title: "A Dream Within a Dream",
        image: "https://ai-saas-template-aceternity.vercel.app/_next/image?url=https%3A%2F%2Fi.pravatar.cc%2F150%3Fimg%3D13&w=256&q=75",
    },
    {
        quote:
            "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        name: "Jane Austen",
        title: "Pride and Prejudice",
        image: "https://ai-saas-template-aceternity.vercel.app/_next/image?url=https%3A%2F%2Fi.pravatar.cc%2F150%3Fimg%3D16&w=256&q=75",
    },
    {
        quote:
            "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
        name: "Herman Melville",
        title: "Moby-Dick",
        image: "https://ai-saas-template-aceternity.vercel.app/_next/image?url=https%3A%2F%2Fi.pravatar.cc%2F150%3Fimg%3D22&w=256&q=75",
    },
    {
        quote:
            "In three words I can sum up everything I've learned about life: it goes on.",
        name: "Robert Frost",
        title: "Poet and Playwright",
        image: "https://ai-saas-template-aceternity.vercel.app/_next/image?url=https%3A%2F%2Fi.pravatar.cc%2F150%3Fimg%3D4&w=256&q=75",
    },
];
