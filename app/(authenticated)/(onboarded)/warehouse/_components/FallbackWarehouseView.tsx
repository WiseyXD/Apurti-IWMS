"use client";
import React from "react";

// Simplified 2D warehouse view as a fallback
const FallbackWarehouseView = () => {
  // Warehouse sections data
  const sections = [
    {
      name: "Receiving Dock",
      color: "#4dabf5",
      x: 40,
      y: 80,
      width: 320,
      height: 80,
    },
    {
      name: "Cold Storage",
      color: "#80deea",
      x: 80,
      y: 200,
      width: 200,
      height: 240,
    },
    {
      name: "General Storage",
      color: "#9ccc65",
      x: 440,
      y: 200,
      width: 240,
      height: 240,
    },
    {
      name: "Management Office",
      color: "#ffb74d",
      x: 160,
      y: 500,
      width: 120,
      height: 80,
    },
    {
      name: "Packaging Station",
      color: "#ba68c8",
      x: 320,
      y: 280,
      width: 160,
      height: 160,
    },
  ];

  // Paths for package movement
  const paths = [
    { from: "Receiving Dock", to: "Packaging Station", color: "#ff5722" },
    { from: "Packaging Station", to: "Shipping Dock", color: "#8d6e63" },
  ];

  return (
    <div className="w-full h-[600px] bg-gray-50 rounded-lg shadow-lg overflow-hidden p-4">
      <div className="w-full h-full relative bg-gray-100 rounded border border-gray-200">
        {/* Render warehouse sections */}
        {sections.map((section, index) => (
          <div
            key={`section-${index}`}
            className="absolute flex items-center justify-center border-2 border-gray-600 cursor-pointer transition-opacity hover:opacity-80"
            style={{
              backgroundColor: section.color,
              left: section.x,
              top: section.y,
              width: section.width,
              height: section.height,
              opacity: 0.7,
            }}
            title={section.name}
          >
            <span className="text-xs font-bold text-gray-800 bg-white px-2 py-1 rounded">
              {section.name}
            </span>
          </div>
        ))}

        {/* Add some static "packages" */}
        <div
          className="absolute w-6 h-6 bg-red-500 rounded"
          style={{ left: 200, top: 100 }}
        ></div>
        <div
          className="absolute w-5 h-5 bg-blue-500 rounded"
          style={{ left: 350, top: 280 }}
        ></div>

        {/* Add warehouse boundaries */}
        <div className="absolute w-full h-full border-4 border-gray-400 pointer-events-none"></div>

        {/* Add north indicator */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold border border-gray-400">
          N
        </div>

        {/* Add scale indicator */}
        <div className="absolute bottom-4 left-4 w-32 h-6 bg-white flex items-center justify-center text-xs border border-gray-400">
          Scale: 1:100
        </div>
      </div>
    </div>
  );
};

export default FallbackWarehouseView;
