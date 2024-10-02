
import { cn } from "@/lib/utils";
import {
  IconBarcode,
  IconChartLine,
  IconCirclePlus,
  IconClock,
  IconDevices,
  IconFileText,
  IconMap,
  IconRefresh,
} from "@tabler/icons-react";

export function FeaturesSection2() {

  const features = [
    {
      title: "Automated Stock Organization",
      description:
        "Organize and categorize your stock using QR codes or RFID tags for effortless inventory management.",
      icon: <IconBarcode />,  // Changed to represent barcode/RFID
    },
    {
      title: "Real-Time Inventory Tracking",
      description:
        "Monitor stock levels in real-time with automated updates and restocking alerts.",
      icon: <IconClock />,  // Changed to represent real-time monitoring
    },
    {
      title: "Stock Trend Analysis",
      description:
        "Analyze stock movement patterns and forecast future demand using data-driven insights.",
      icon: <IconChartLine />,  // Changed to represent analytics and trends
    },
    {
      title: "Warehouse Space Optimization",
      description:
        "Maximize warehouse efficiency with intelligent recommendations for space allocation.",
      icon: <IconMap />,  // Changed to represent space/layout planning
    },
    {
      title: "Automated Restocking",
      description:
        "Automatically detect low stock levels and trigger restocking processes with ease.",
      icon: <IconRefresh />,  // Changed to represent automation and refreshing stock
    },
    {
      title: "Cross-Platform Data Access",
      description:
        "Access warehouse data across devices, ensuring seamless management from anywhere.",
      icon: <IconDevices />,  // Changed to represent cross-platform access
    },
    {
      title: "Inventory Report Generation",
      description:
        "Generate detailed reports on stock performance, usage trends, and warehouse efficiency.",
      icon: <IconFileText />,  // Changed to represent reporting and documentation
    },
    {
      title: "And More",
      description:
        "Explore additional features designed to streamline and optimize your warehouse operations.",
      icon: <IconCirclePlus />,  // Changed to represent additional features
    },
  ];
  return (

    <div className="py-20 lg:py-40">
      <div className="flex flex-col justify-center items-center gap-y-10">
        <div>
          <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
            Packed with thousands of features
          </h4>

          <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
            Literally each and everything that can come up to your mind is present inside <strong>Apurti</strong>.
          </p>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto my-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
