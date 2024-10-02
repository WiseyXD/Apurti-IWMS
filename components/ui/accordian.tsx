// "use client";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"

// export default function AccordionDemo() {
//   return (
//     <div className="w-full max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
//       <Accordion type="single" collapsible className="w-full">
//         <AccordionItem value="item-1">
//           <AccordionTrigger>Is it accessible?</AccordionTrigger>
//           <AccordionContent>
//             Yes. It adheres to the WAI-ARIA design pattern.
//           </AccordionContent>
//         </AccordionItem>
//         <AccordionItem value="item-2">
//           <AccordionTrigger>Is it styled?</AccordionTrigger>
//           <AccordionContent>
//             Yes. It comes with default styles that matches the other
//             components&apos; aesthetic.
//           </AccordionContent>
//         </AccordionItem>
//         <AccordionItem value="item-3">
//           <AccordionTrigger>Is it animated?</AccordionTrigger>
//           <AccordionContent>
//             Yes. It&apos;s animated by default, but you can disable it if you
//             prefer.
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   )
// }
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccordionDemo() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6"> {/* Increased max-width and added padding */}
      <h2 className="text-3xl font-bold mb-6 text-center"> {/* Increased font size */}
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium"> {/* Increased font size */}
            Is it accessible?
          </AccordionTrigger>
          <AccordionContent className="text-base"> {/* Adjusted font size for content */}
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-lg font-medium">
            Is it styled?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Yes. It comes with default styles that match the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-lg font-medium">
            Is it animated?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
