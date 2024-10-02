"use client"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function FAQ() {

    const faqs = [
        {
            question: "What is Apurti?",
            answer: "Apurti is an intelligent warehouse management system designed to optimize inventory management, streamline operations, and enhance efficiency through automation and data analytics.",
        },
        {
            question: "How does Apurti work?",
            answer: "Apurti uses QR codes and RFID technology to automate stock organization, real-time inventory tracking, and reporting, helping businesses manage their warehouse operations effortlessly.",
        },
        {
            question: "What are the main features of Apurti?",
            answer: "Apurti offers features such as automated stock organization, real-time inventory tracking, stock trend analysis, warehouse space optimization, automated restocking, and cross-platform data access.",
        },
        {
            question: "Is Apurti suitable for small businesses?",
            answer: "Yes, Apurti is designed to scale with businesses of all sizes, from small warehouses to large distribution centers, providing tailored solutions for each.",
        },
        {
            question: "What kind of support does Apurti offer?",
            answer: "Apurti provides 24/7 customer support, including access to intelligent assistants, to ensure smooth warehouse operations.",
        },
        {
            question: "Can I access Apurti on mobile devices?",
            answer: "Yes, Apurti is a cloud-based platform, allowing users to access the system from any device with an internet connection, including smartphones and tablets.",
        },
        {
            question: "Are there any hidden fees with Apurti?",
            answer: "No, Apurti offers transparent pricing with no hidden fees. All features and services are clearly outlined in our pricing plans.",
        },
        {
            question: "Can I integrate Apurti with my existing systems?",
            answer: "Absolutely! Apurti is designed for seamless integration with your current warehouse systems, enhancing your operational workflows.",
        },
        {
            question: "Is there a free trial available for Apurti?",
            answer: "Yes, Apurti offers a free trial period that allows users to explore its features and functionality before committing to a subscription.",
        },
        {
            question: "How does Apurti ensure data security?",
            answer: "Apurti employs robust security measures, including data encryption and secure access protocols, to protect your warehouse data.",
        },
        {
            question: "What types of reports can I generate with Apurti?",
            answer: "Apurti allows users to generate detailed reports on stock performance, usage trends, and overall warehouse efficiency, providing valuable insights for decision-making.",
        },
        {
            question: "How can I provide feedback or request new features?",
            answer: "We value user feedback! You can submit your suggestions through our support portal, and our team will review and consider them for future updates."
        }
    ];

    return (
        <div className="min-h-screen mx-auto py-12 max-w-7xl">
            <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                Frequently Asked Questions
            </h4>

            <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                Everybody has questions.
            </p>

            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base">{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
