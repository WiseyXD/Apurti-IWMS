import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Button } from './button'

export default function Mainbuttons() {
  return (
    <>
      <a href="https://nextjs-dashboard-three-pi-27.vercel.app/dashboard" className="" target="_blank">
        <Button
          variant="outline"
          className="text-black flex gap-x-3 md:px-8 md:py-4 md:text-lg rounded-full group" // Added group class for hover
        >
          Get Started
          <ArrowRight className="transition-transform duration-300 ease-in-out group-hover:translate-x-1" /> {/* Arrow moves on hover */}
        </Button>

      </a>
    </>
  )
}

