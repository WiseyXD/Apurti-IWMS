"use client"
import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(false); // State to toggle between monthly and yearly


  const plans = [
    {
      name: "Free",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      description: "For individuals just getting started",
      features: [
        "10 Credits",
        "Max Video Length: 5 Minutes",
        "No access to bulk features",
        "Watermarked Videos"
      ],
    },
    {
      name: "Hobbyist",
      monthlyPrice: "$9",
      yearlyPrice: "$100",
      description: "For enthusiasts and small projects",
      features: [
        "100 Credits",
        "Access to bulk features",
        "Access to all features",
        "Up to 200 minutes of video processing",
        "Priority Support from Maker",
        "Watermark Free Videos",
        "Full 1080p Videos"
      ],
    },
    {
      name: "Creator",
      monthlyPrice: "$19",
      yearlyPrice: "$200",
      description: "For professionals and growing businesses",
      features: [
        "250 Credits",
        "Access to all features",
        "Access to bulk features",
        "Up to 500 minutes of video processing",
        "Priority Support from Maker",
        "Watermark Free Videos",
        "Full 1080p Videos"
      ],
    },
    {
      name: "Pro",
      monthlyPrice: "$49",
      yearlyPrice: "$499",
      description: "For large teams and enterprises",
      features: [
        "1000 Credits",
        "Access to all features",
        "Access to bulk features",
        "Up to 2000 minutes of video processing",
        "Voice Cloning Support",
        "Priority Support from Maker",
        "Watermark Free Videos",
        "Full 1080p Videos"
      ],
    },
  ]

  return (
    <div className="container mx-auto py-12 max-w-7xl">
      <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
        Choose your plan.
      </h4>

      <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
        Unlock the power of Snapy's all-in-one video tools with flexible plans designed to fit your needs from editing to generation, we've got you covered. </p>

      {/* Toggle Button */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-md ${!isYearly ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setIsYearly(false)}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-r-md ${isYearly ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setIsYearly(true)}
        >
          Yearly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col shadow-xl border border-gray-300 rounded-lg transition-transform duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-100 to-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-gray-700">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-4xl font-extrabold mb-4">
                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                <span className="text-sm font-normal">/{isYearly ? "year" : "month"}</span>
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-black text-white hover:bg-gray-800">{plan.name === "Free" ? "Get Started" : "Subscribe"}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center mt-10">
        <h3 className="text-xl font-bold mb-4">Need a Custom Plan?</h3>
        <p className="mb-4">Contact us for a tailored solution that fits your needs.</p>
        <Button variant="outline" className="text-black border-black">Contact Us</Button>
      </div>


    </div>
  )
}
