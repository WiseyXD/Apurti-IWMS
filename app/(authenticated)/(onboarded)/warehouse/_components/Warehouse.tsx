// app/(authenticated)/(onboarded)/warehouse/_components/Warehouse.tsx
"use client";
import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Box,
  Plane,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

// Types for the warehouse sections
interface SectionProps {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  description?: string;
}

// Types for moving packages
interface PackageProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  speed: number;
  path: [number, number, number][];
}

// Memory management - dispose unused resources
const MemoryManager = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Configure renderer for better memory usage
    gl.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1);

    // Lower texture quality
    if (gl.capabilities) {
      gl.capabilities.precision = "lowp";
    }

    // Return cleanup function
    return () => {
      // Dispose of scene resources when unmounting
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    };
  }, [gl, scene]);

  return null;
};

// Error boundary for WebGL context loss
class WebGLErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WebGL error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render a fallback UI here if needed
      return null;
    }

    return this.props.children;
  }
}

// Simplified warehouse floor
const Floor = () => {
  return (
    <>
      {/* Main floor */}
      <Plane
        args={[40, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={false}
      >
        <meshStandardMaterial color="#c5c5c5" roughness={0.8} metalness={0.2} />
      </Plane>

      {/* Just a few main grid lines for orientation */}
      {[-20, -10, 0, 10, 20].map((pos, i) => (
        <React.Fragment key={`grid-${i}`}>
          {/* Horizontal lines */}
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={(self) => {
                const points = [
                  new THREE.Vector3(-20, 0.01, pos),
                  new THREE.Vector3(20, 0.01, pos),
                ];
                self.setFromPoints(points);
              }}
            />
            <lineBasicMaterial
              attach="material"
              color="#555555"
              linewidth={1}
            />
          </line>

          {/* Vertical lines */}
          <line>
            <bufferGeometry
              attach="geometry"
              onUpdate={(self) => {
                const points = [
                  new THREE.Vector3(pos, 0.01, -15),
                  new THREE.Vector3(pos, 0.01, 15),
                ];
                self.setFromPoints(points);
              }}
            />
            <lineBasicMaterial
              attach="material"
              color="#555555"
              linewidth={1}
            />
          </line>
        </React.Fragment>
      ))}
    </>
  );
};

// Simplified warehouse walls
const Walls = () => {
  return (
    <>
      {/* Back wall */}
      <Plane
        args={[40, 8]}
        position={[0, 4, -15]}
        receiveShadow={false}
        castShadow={false}
      >
        <meshStandardMaterial color="#e8e8e8" roughness={0.7} metalness={0.1} />
      </Plane>

      {/* Left wall */}
      <Plane
        args={[30, 8]}
        position={[-20, 4, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow={false}
        castShadow={false}
      >
        <meshStandardMaterial color="#e8e8e8" roughness={0.7} metalness={0.1} />
      </Plane>

      {/* Right wall */}
      <Plane
        args={[30, 8]}
        position={[20, 4, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow={false}
        castShadow={false}
      >
        <meshStandardMaterial color="#e8e8e8" roughness={0.7} metalness={0.1} />
      </Plane>
    </>
  );
};

// Simplified warehouse section
const WarehouseSection = ({
  name,
  position,
  size,
  color,
  description = "",
}: SectionProps) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Use simple material without complex shading
  return (
    <group>
      <Box
        args={size}
        position={position}
        castShadow={false}
        receiveShadow={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setActive(!active)}
      >
        <meshBasicMaterial
          color={hovered ? "#ffffff" : color}
          transparent
          opacity={0.8}
        />
      </Box>

      {/* Section name */}
      <Text
        position={[position[0], position[1] + size[1] / 2 + 0.5, position[2]]}
        color="black"
        fontSize={0.7}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>

      {/* Show description when active - only when clicked */}
      {active && description && (
        <Text
          position={[position[0], position[1] + size[1] / 2 + 1.2, position[2]]}
          color="#333333"
          fontSize={0.4}
          maxWidth={4}
          anchorX="center"
          anchorY="middle"
        >
          {description}
        </Text>
      )}
    </group>
  );
};

// Simplified moving package component
const MovingPackage = ({
  position,
  size,
  color,
  speed,
  path,
}: PackageProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [pathIndex, setPathIndex] = useState(0);
  const [lerpFactor, setLerpFactor] = useState(0);

  // Simpler animation logic to reduce CPU usage
  useFrame((state, delta) => {
    if (meshRef.current && path.length > 1) {
      // Calculate next position along the path
      const currentPathPoint = path[pathIndex];
      const nextPathPoint = path[(pathIndex + 1) % path.length];

      // Use smaller step size for more stable performance
      const step = delta * speed * 0.5;

      // Increment lerp factor based on speed
      setLerpFactor((prev) => {
        const newFactor = prev + step;
        if (newFactor >= 1) {
          // Move to next path point
          setPathIndex((prev) => (prev + 1) % path.length);
          return 0;
        }
        return newFactor;
      });

      // Interpolate position
      const newX = THREE.MathUtils.lerp(
        currentPathPoint[0],
        nextPathPoint[0],
        lerpFactor,
      );
      const newY = THREE.MathUtils.lerp(
        currentPathPoint[1],
        nextPathPoint[1],
        lerpFactor,
      );
      const newZ = THREE.MathUtils.lerp(
        currentPathPoint[2],
        nextPathPoint[2],
        lerpFactor,
      );

      // Apply position to mesh
      meshRef.current.position.set(newX, newY, newZ);

      // Simpler rotation to reduce calculations
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Box
      ref={meshRef}
      args={size}
      position={position}
      castShadow={false}
      receiveShadow={false}
    >
      <meshBasicMaterial color={color} />
    </Box>
  );
};

// Optimized camera controller
const CameraController = () => {
  const controlsRef = useRef(null);

  // Limit update frequency to improve performance
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={false} // Disable damping for better performance
      minDistance={10}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2 - 0.1}
      enableZoom={true}
      zoomSpeed={0.5} // Slower zoom for more stable performance
      rotateSpeed={0.5} // Slower rotation for more stable performance
    />
  );
};

// Scene component to hold all 3D elements
const WarehouseScene = () => {
  // Define simplified warehouse sections
  const sections: SectionProps[] = [
    {
      name: "Receiving Dock",
      position: [0, 1, 13],
      size: [16, 2, 4],
      color: "#4dabf5",
      description: "Packages arrive here",
    },
    {
      name: "Cold Storage",
      position: [-14, 2, -3],
      size: [10, 4, 12],
      color: "#80deea",
      description: "Temperature controlled",
    },
    {
      name: "General Storage",
      position: [12, 3, -2],
      size: [12, 6, 18],
      color: "#9ccc65",
      description: "Main storage area",
    },
    {
      name: "Management Office",
      position: [-8, 1.5, -10],
      size: [6, 3, 4],
      color: "#ffb74d",
      description: "Office area",
    },
    {
      name: "Packaging Station",
      position: [2, 1, 0],
      size: [8, 2, 8],
      color: "#ba68c8",
      description: "Packaging area",
    },
  ];

  // Reduced number of moving packages for better performance
  const packages: PackageProps[] = [
    {
      position: [0, 1, 13],
      size: [1, 1, 1],
      color: "#ff5722",
      speed: 0.3,
      path: [
        [0, 1, 13], // Receiving dock
        [0, 1, 5], // Middle path
        [2, 1, 0], // Packaging station
        [0, 1, 8], // Middle area
      ],
    },
    {
      position: [3, 1, 13],
      size: [0.8, 0.8, 0.8],
      color: "#8d6e63",
      speed: 0.5,
      path: [
        [3, 1, 13], // Receiving dock
        [12, 1, -2], // General storage
        [2, 1, 0], // Packaging station
      ],
    },
  ];

  return (
    <WebGLErrorBoundary>
      <Suspense
        fallback={
          <Box args={[1, 1, 1]} position={[0, 1, 0]}>
            <meshBasicMaterial color="#ff0000" />
          </Box>
        }
      >
        <MemoryManager />
        <CameraController />

        {/* Simplified lighting for better performance */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.6}
          castShadow={false}
        />

        {/* Base structure */}
        <Floor />
        <Walls />

        {/* Warehouse sections */}
        {sections.map((section, index) => (
          <WarehouseSection
            key={`section-${index}`}
            name={section.name}
            position={section.position}
            size={section.size}
            color={section.color}
            description={section.description}
          />
        ))}

        {/* Moving packages */}
        {packages.map((pkg, index) => (
          <MovingPackage
            key={`package-${index}`}
            position={pkg.position}
            size={pkg.size}
            color={pkg.color}
            speed={pkg.speed}
            path={pkg.path}
          />
        ))}

        {/* Simple path indicator */}
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              const points = [
                new THREE.Vector3(-10, 0.02, 0),
                new THREE.Vector3(10, 0.02, 0),
              ];
              self.setFromPoints(points);
            }}
          />
          <lineBasicMaterial attach="material" color="#ffeb3b" linewidth={1} />
        </line>
      </Suspense>
    </WebGLErrorBoundary>
  );
};

// Context loss recovery handler
const ContextLossHandler = () => {
  const { gl } = useThree();

  useEffect(() => {
    // Add context loss handling
    const handleContextLost = (event) => {
      console.error("WebGL context lost!");
      event.preventDefault();

      // Attempt to restore context after a short delay
      setTimeout(() => {
        try {
          // Force renderer to reinitialize
          if (gl.getContext) {
            gl.forceContextRestore();
          }
        } catch (e) {
          console.error("Failed to restore WebGL context:", e);
        }
      }, 2000);
    };

    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", handleContextLost, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, [gl]);

  return null;
};

// Main exported component
const Warehouse3D = () => {
  const [isClient, setIsClient] = useState(false);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    // Only render on client-side
    setIsClient(true);

    // Check if WebGL is supported
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      console.error("WebGL not supported");
      setRenderError(true);
    }

    // Handle specific rendering errors
    const errorHandler = (event) => {
      if (
        event.message &&
        (event.message.includes("WebGL context was lost") ||
          event.message.includes("Context Lost") ||
          event.message.includes("THREE.WebGLRenderer"))
      ) {
        console.error("WebGL error detected in error handler");
        setRenderError(true);
      }
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p>Initializing 3D view...</p>
      </div>
    );
  }

  if (renderError) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
        <div className="text-red-500 mb-2">
          ⚠️ Unable to render 3D warehouse
        </div>
        <p className="text-center max-w-md text-gray-700">
          Your browser may not support WebGL, which is required for 3D
          rendering. Please try using an updated version of Chrome, Firefox, or
          Edge.
        </p>
      </div>
    );
  }

  // Optimized render settings for better compatibility
  return (
    <div className="w-full h-[600px] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <Canvas
        shadows={false} // Disable shadows for better performance
        dpr={[1, 1.5]} // Lower resolution for better compatibility
        gl={{
          antialias: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
          alpha: false, // Disable alpha for better performance
          stencil: false, // Disable stencil for better performance
          depth: true,
          premultipliedAlpha: false,
        }}
        onCreated={({ gl }) => {
          // Configure renderer for better compatibility
          gl.setClearColor("#f5f5f5", 1);

          // Limit precision for better performance
          const renderer = gl;
          renderer.outputEncoding = THREE.LinearSRGBColorSpace;
          renderer.toneMapping = THREE.NoToneMapping;

          // Reduce memory consumption
          renderer.localClippingEnabled = false;
          renderer.physicallyCorrectLights = false;
        }}
      >
        <ContextLossHandler />
        <PerspectiveCamera makeDefault position={[0, 20, 20]} fov={45} />
        <WarehouseScene />
      </Canvas>
    </div>
  );
};

export default Warehouse3D;
