// app/(authenticated)/(onboarded)/warehouse/_components/WarehouseComponent.tsx
"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";

// Create a simple 2D fallback component
const Fallback2DView = () => (
  <div className="w-full h-[600px] bg-gray-50 rounded-lg shadow-lg overflow-hidden p-4">
    <div className="w-full h-full relative bg-gray-100 rounded border border-gray-200">
      {/* Simplified warehouse layout */}
      <div
        className="absolute w-[320px] h-[80px] border-2 border-gray-600"
        style={{
          left: "40px",
          top: "80px",
          backgroundColor: "#4dabf5",
          opacity: 0.7,
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded">
          Receiving Dock
        </span>
      </div>
      <div
        className="absolute w-[200px] h-[240px] border-2 border-gray-600"
        style={{
          left: "80px",
          top: "200px",
          backgroundColor: "#80deea",
          opacity: 0.7,
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded">
          Cold Storage
        </span>
      </div>
      <div
        className="absolute w-[240px] h-[240px] border-2 border-gray-600"
        style={{
          left: "440px",
          top: "200px",
          backgroundColor: "#9ccc65",
          opacity: 0.7,
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded">
          General Storage
        </span>
      </div>
      <div
        className="absolute w-[120px] h-[80px] border-2 border-gray-600"
        style={{
          left: "160px",
          top: "500px",
          backgroundColor: "#ffb74d",
          opacity: 0.7,
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded">
          Management Office
        </span>
      </div>
      <div
        className="absolute w-[160px] h-[160px] border-2 border-gray-600"
        style={{
          left: "320px",
          top: "280px",
          backgroundColor: "#ba68c8",
          opacity: 0.7,
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded">
          Packaging Station
        </span>
      </div>
      <div
        className="absolute w-[120px] h-[100px] border-2 border-gray-600"
        style={{
          left: "120px",
          top: "350px",
          backgroundColor: "#f06292",
          opacity: 0.7,
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded">
          Quality Control
        </span>
      </div>
      <div
        className="absolute w-[320px] h-[80px] border-2 border-gray-600"
        style={{
          left: "280px",
          top: "80px",
          backgroundColor: "#4db6ac",
          opacity: 0.7,
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded">
          Shipping Dock
        </span>
      </div>

      {/* Add some static "packages" */}
      <div
        className="absolute w-6 h-6 bg-red-500 rounded"
        style={{ left: 200, top: 100 }}
      ></div>
      <div
        className="absolute w-5 h-5 bg-blue-500 rounded"
        style={{ left: 350, top: 280 }}
      ></div>
      <div
        className="absolute w-4 h-4 bg-green-500 rounded"
        style={{ left: 480, top: 320 }}
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

// Create a wrapper for the 3D component to handle WebGL context loss
const CreateWarehouse3DWithContextLossHandling = () => {
  // Import the 3D component with No SSR to prevent hydration errors
  return dynamic(
    () =>
      import("./Warehouse").then((mod) => {
        // Get the original component
        const OriginalWarehouse3D = mod.default;

        // Create a wrapped version with context loss handling
        const WarehouseWithContextLossHandling = (props) => {
          const containerRef = useRef(null);
          const [contextLost, setContextLost] = useState(false);

          useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            // Listen for WebGL context loss events
            const handleContextLost = (event) => {
              console.warn("WebGL context lost detected");
              event.preventDefault();
              setContextLost(true);
            };

            container.addEventListener(
              "webglcontextlost",
              handleContextLost,
              false,
            );

            // For direct THREE errors, we need to monitor console errors
            const errorHandler = (event) => {
              if (
                event.message &&
                (event.message.includes("WebGL context was lost") ||
                  event.message.includes("Context Lost") ||
                  event.message.includes("THREE.WebGLRenderer"))
              ) {
                console.warn("WebGL context lost detected via error event");
                setContextLost(true);
              }
            };

            window.addEventListener("error", errorHandler);

            return () => {
              container.removeEventListener(
                "webglcontextlost",
                handleContextLost,
              );
              window.removeEventListener("error", errorHandler);
            };
          }, []);

          if (contextLost) {
            return <Fallback2DView />;
          }

          return (
            <div ref={containerRef} className="w-full h-[600px]">
              <OriginalWarehouse3D {...props} />
            </div>
          );
        };

        return WarehouseWithContextLossHandling;
      }),
    {
      ssr: false,
      loading: () => (
        <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-600 font-medium">Loading 3D Warehouse...</p>
          </div>
        </div>
      ),
    },
  );
};

// Create the wrapped component
const Warehouse3D = CreateWarehouse3DWithContextLossHandling();

export default function WarehouseComponent() {
  const [activeView, setActiveView] = useState("3d");
  const [renderFallback, setRenderFallback] = useState(false);
  const [renderingChecked, setRenderingChecked] = useState(false);

  // Sections data for legend/info panel
  const sections = [
    {
      name: "Receiving Dock",
      color: "#4dabf5",
      description: "Packages arrive and are initially processed here",
    },
    {
      name: "Cold Storage",
      color: "#80deea",
      description: "Temperature controlled storage for perishable items",
    },
    {
      name: "General Storage",
      color: "#9ccc65",
      description: "Main storage area for non-perishable inventory",
    },
    {
      name: "Management Office",
      color: "#ffb74d",
      description: "Administrative area for warehouse staff",
    },
    {
      name: "Packaging Station",
      color: "#ba68c8",
      description: "Items are prepared for shipping here",
    },
    {
      name: "Quality Control",
      color: "#f06292",
      description: "Items are inspected before shipping",
    },
    {
      name: "Shipping Dock",
      color: "#4db6ac",
      description: "Packages are loaded onto trucks for delivery",
    },
    {
      name: "Returns Processing",
      color: "#fff176",
      description: "Returned items are processed here",
    },
  ];

  // Check for WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl", {
          failIfMajorPerformanceCaveat: true, // More strict check
          powerPreference: "default",
        }) ||
        canvas.getContext("experimental-webgl", {
          failIfMajorPerformanceCaveat: true,
          powerPreference: "default",
        });

      if (!gl) {
        console.warn("WebGL not supported or disabled");
        setRenderFallback(true);
        setRenderingChecked(true);
        return;
      }

      // Check if we have enough features for Three.js
      const extensions = [
        "ANGLE_instanced_arrays",
        "OES_element_index_uint",
        "OES_standard_derivatives",
        "OES_texture_float",
        "OES_texture_float_linear",
      ];

      const missingExtensions = extensions.filter(
        (ext) => !gl.getExtension(ext),
      );
      if (missingExtensions.length > 2) {
        console.warn(
          "WebGL is supported but missing critical extensions:",
          missingExtensions,
        );
        setRenderFallback(true);
      }

      setRenderingChecked(true);
    } catch (e) {
      console.error("Error checking WebGL support:", e);
      setRenderFallback(true);
      setRenderingChecked(true);
    }

    // Listen for specific Three.js errors in console
    const errorHandler = (event) => {
      if (
        event.message &&
        (event.message.includes("WebGL context was lost") ||
          event.message.includes("Context Lost") ||
          event.message.includes("THREE.WebGLRenderer") ||
          event.message.includes("Unable to get WebGL context"))
      ) {
        console.warn("WebGL context error detected");
        setRenderFallback(true);
      }
    };

    window.addEventListener("error", errorHandler);

    // Set a timeout to check rendering - if 3D takes too long, use fallback
    const renderTimeout = setTimeout(() => {
      if (!renderingChecked) {
        console.warn("Rendering is taking too long, switching to fallback");
        setRenderFallback(true);
        setRenderingChecked(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("error", errorHandler);
      clearTimeout(renderTimeout);
    };
  }, [renderingChecked]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Warehouse Layout</h2>

        {/* View toggle buttons */}
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md transition-all ${
              activeView === "3d"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveView("3d")}
          >
            {renderFallback ? "2D View" : "3D View"}
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-all ${
              activeView === "info"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setActiveView("info")}
          >
            Information
          </button>
        </div>
      </div>

      {/* User instructions */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700">
        <p className="font-medium mb-1">
          {renderFallback
            ? "Interactive 2D Warehouse Map"
            : "Interactive 3D Warehouse Map"}
        </p>
        <ul className="list-disc list-inside text-sm">
          {!renderFallback ? (
            <>
              <li>Click and drag to rotate the view</li>
              <li>Scroll to zoom in/out</li>
              <li>Click on warehouse sections for more details</li>
              <li>Watch the animated packages moving through the warehouse</li>
            </>
          ) : (
            <>
              <li>Hover over warehouse sections for details</li>
              <li>Static 2D representation of the warehouse layout</li>
            </>
          )}
        </ul>
      </div>

      {/* Main content based on active view */}
      {activeView === "3d" ? (
        renderFallback ? (
          <Fallback2DView />
        ) : renderingChecked ? (
          <Warehouse3D />
        ) : (
          <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-600 font-medium">
                Checking rendering capabilities...
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="w-full h-[600px] bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">
            Warehouse Areas Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <div
                key={`info-${index}`}
                className="p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: section.color,
                }}
              >
                <h4 className="font-bold text-gray-800 mb-1">{section.name}</h4>
                <p className="text-gray-600 text-sm">{section.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Warehouse Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Total Area</p>
                <p className="text-2xl font-bold">1,200 m²</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Storage Capacity</p>
                <p className="text-2xl font-bold">5,000 units</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Daily Throughput</p>
                <p className="text-2xl font-bold">850 packages</p>
              </div>
            </div>
          </div>

          {/* Troubleshooting section */}
          {renderFallback && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-yellow-700">
                3D View Troubleshooting
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                We've detected that your browser may not fully support WebGL,
                which is required for the 3D warehouse view. We're showing you a
                simplified 2D view instead. To enable the full 3D experience,
                you can try:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Using an updated version of Chrome, Firefox, or Edge</li>
                <li>Enabling hardware acceleration in your browser settings</li>
                <li>Updating your graphics drivers</li>
                <li>
                  Disabling any browser extensions that might interfere with
                  WebGL
                </li>
                <li>
                  Closing other browser tabs or applications that use graphics
                  processing
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Legend for 3D view */}
      {activeView === "3d" && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-bold mb-2">Warehouse Sections</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {sections.map((section, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-sm mr-2"
                  style={{ backgroundColor: section.color }}
                ></div>
                <span className="text-xs text-gray-700">{section.name}</span>
              </div>
            ))}
          </div>

          {/* 3D rendering status */}
          {renderFallback && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-red-500 flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                WebGL context loss detected! Using 2D fallback view.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This may be caused by insufficient graphics memory or driver
                issues. Try closing other browser tabs or restarting your
                browser.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
