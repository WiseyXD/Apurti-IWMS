// app/(authenticated)/(onboarded)/warehouse/_components/WarehouseAnimated.tsx
"use client";
import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Box,
  Plane,
  PerspectiveCamera,
  Html,
  Sphere,
} from "@react-three/drei";
import * as THREE from "three";

// Types
interface ProductHighlightProps {
  position: [number, number, number];
  productId: string;
  productName: string;
  quantity: number;
  isNew?: boolean;
}

interface SectionProps {
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  description?: string;
  isHighlighted?: boolean;
}

interface Product {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  quantity: number;
  isNew?: boolean;
  sectionId?: string;
}

interface WarehouseSection {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  color: string;
  description: string;
}

// Default sections for demo mode
const defaultSections: SectionProps[] = [
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

// Memory management - dispose unused resources
const MemoryManager = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    // Configure renderer for better memory usage
    gl.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1);

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
class WebGLErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("WebGL error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

// Context loss recovery handler
const ContextLossHandler = () => {
  const { gl } = useThree();

  useEffect(() => {
    const handleContextLost = (event: Event) => {
      console.error("WebGL context lost!");
      event.preventDefault();

      setTimeout(() => {
        try {
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

// Optimized camera controller
const CameraController = () => {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={false}
      minDistance={10}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2 - 0.1}
      enableZoom={true}
      zoomSpeed={0.5}
      rotateSpeed={0.5}
    />
  );
};

// Simplified warehouse floor
const Floor = () => {
  return (
    <>
      <Plane
        args={[40, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={false}
      >
        <meshStandardMaterial color="#c5c5c5" roughness={0.8} metalness={0.2} />
      </Plane>

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
            <lineBasicMaterial attach="material" color="#555555" />
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
            <lineBasicMaterial attach="material" color="#555555" />
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

// Product highlight component with entry animation
const ProductHighlight = ({
  position,
  productId,
  productName,
  quantity,
  isNew = false,
}: ProductHighlightProps) => {
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Entry animation for new products
  useEffect(() => {
    if (isNew && groupRef.current) {
      groupRef.current.position.y = position[1] + 10; // Start from above
      groupRef.current.scale.set(0.1, 0.1, 0.1); // Start small
    }
  }, [isNew, position]);

  useFrame((state, delta) => {
    if (pulseRef.current) {
      // Pulsing animation
      pulseRef.current.scale.x =
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      pulseRef.current.scale.y =
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      pulseRef.current.scale.z =
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }

    // Entry animation
    if (isNew && groupRef.current) {
      // Smooth descent
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1],
        delta * 3,
      );

      // Smooth scale
      groupRef.current.scale.x = THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        1,
        delta * 3,
      );
      groupRef.current.scale.y = THREE.MathUtils.lerp(
        groupRef.current.scale.y,
        1,
        delta * 3,
      );
      groupRef.current.scale.z = THREE.MathUtils.lerp(
        groupRef.current.scale.z,
        1,
        delta * 3,
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Pulsing highlight sphere */}
      <Sphere
        ref={pulseRef}
        args={[0.8, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial
          color={isNew ? "#00ff00" : "#ff0000"}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Product label */}
      <Box args={[0.6, 0.6, 0.6]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Box>

      {/* Product ID label */}
      <Text
        position={[0, 0, 0.31]}
        fontSize={0.2}
        color={isNew ? "#00ff00" : "#ff0000"}
        anchorX="center"
        anchorY="middle"
      >
        {productId}
      </Text>

      {/* Popup with more details */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center style={{ pointerEvents: "none" }}>
          <div className="bg-white p-2 rounded shadow-lg border border-gray-200 w-48">
            <div className="font-bold text-sm">{productName}</div>
            <div className="flex justify-between mt-1 text-xs">
              <span>ID: {productId}</span>
              <span>Qty: {quantity}</span>
            </div>
            {isNew && (
              <div className="text-green-600 text-xs mt-1">
                Newly Added Item!
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Connecting line to floor */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(self) => {
            const points = [
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, -position[1] + 0.05, 0),
            ];
            self.setFromPoints(points);
          }}
        />
        <lineBasicMaterial
          attach="material"
          color={isNew ? "#00ff00" : "#ff0000"}
          dashSize={0.2}
          gapSize={0.1}
        />
      </line>
    </group>
  );
};

// Enhanced WarehouseSection with product positions
const WarehouseSection = ({
  name,
  position,
  size,
  color,
  description = "",
  isHighlighted = false,
  isEditMode = false,
  products = [],
}: SectionProps & { isEditMode?: boolean; products?: Product[] }) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (boxRef.current && (isHighlighted || isEditMode)) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 1;
      boxRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group>
      <Box
        ref={boxRef}
        args={size}
        position={position}
        castShadow={false}
        receiveShadow={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setActive(!active)}
      >
        <meshBasicMaterial
          color={
            hovered
              ? "#ffffff"
              : isHighlighted
                ? "#ffcccc"
                : isEditMode
                  ? "#ffffcc"
                  : color
          }
          transparent
          opacity={isEditMode ? 0.6 : 0.8}
        />
      </Box>

      {/* Section name */}
      <Text
        position={[position[0], position[1] + size[1] / 2 + 0.5, position[2]]}
        color={isEditMode ? "#ff8800" : "black"}
        fontSize={0.7}
        anchorX="center"
        anchorY="middle"
      >
        {name}
        {isHighlighted && " *"}
        {isEditMode && " (Edit)"}
      </Text>

      {/* Products in this section */}
      {!isEditMode &&
        products.map((product) => (
          <ProductHighlight
            key={product.id}
            position={[
              position[0] + product.positionX,
              position[1] + product.positionY,
              position[2] + product.positionZ,
            ]}
            productId={product.id}
            productName={product.name}
            quantity={product.quantity}
            isNew={product.isNew}
          />
        ))}
    </group>
  );
};

// Enhanced WarehouseScene with real products
const WarehouseScene = ({
  selectedProduct = null,
  customWarehouseData = null,
  isEditMode = false,
  realProducts = [],
  newProductId = null,
}: {
  selectedProduct?: any;
  customWarehouseData?: { sections: WarehouseSection[] } | null;
  isEditMode?: boolean;
  realProducts?: Product[];
  newProductId?: string | null;
}) => {
  // Convert custom warehouse data to sections
  const sections = customWarehouseData
    ? customWarehouseData.sections.map((section) => ({
        name: section.name,
        position: [section.positionX, section.positionY, section.positionZ] as [
          number,
          number,
          number,
        ],
        size: [section.sizeX, section.sizeY, section.sizeZ] as [
          number,
          number,
          number,
        ],
        color: section.color,
        description: section.description,
        isHighlighted: selectedProduct?.location === section.name,
        products: realProducts
          .filter((p) => p.sectionId === section.id)
          .map((p) => ({
            ...p,
            isNew: p.id === newProductId,
          })),
      }))
    : defaultSections;

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

        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={0.6}
          castShadow={false}
        />

        {/* Base structure */}
        <Floor />
        <Walls />

        {/* Warehouse sections with products */}
        {sections.map((section, index) => (
          <WarehouseSection
            key={`section-${index}`}
            name={section.name}
            position={section.position}
            size={section.size}
            color={section.color}
            description={section.description}
            isHighlighted={section.isHighlighted}
            isEditMode={isEditMode}
            products={section.products as any}
          />
        ))}

        {/* Selected product highlight (for search) */}
        {!isEditMode &&
          selectedProduct &&
          getProductHighlightPosition(selectedProduct, sections) && (
            <ProductHighlight
              position={
                getProductHighlightPosition(selectedProduct, sections) as [
                  number,
                  number,
                  number,
                ]
              }
              productId={selectedProduct.id}
              productName={selectedProduct.name}
              quantity={selectedProduct.quantity}
            />
          )}

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
          <lineBasicMaterial attach="material" color="#ffeb3b" />
        </line>
      </Suspense>
    </WebGLErrorBoundary>
  );
};

// Helper function to get product position
const getProductHighlightPosition = (product: any, sections: any[]) => {
  const section = sections.find((s) => s.name === product.location);
  if (!section) return null;

  // Use actual product position if available
  if (product.position) {
    return [
      section.position[0] + product.position[0],
      section.position[1] + product.position[1],
      section.position[2] + product.position[2],
    ];
  }

  // Otherwise position above the center of the section
  return [
    section.position[0],
    section.position[1] + section.size[1] + 1.5,
    section.position[2],
  ];
};

// Main exported component with product fetching
const Warehouse3D = ({
  selectedProduct = null,
  customWarehouseData = null,
  isEditMode = false,
}: {
  selectedProduct?: any;
  customWarehouseData?: { sections: WarehouseSection[] } | null;
  isEditMode?: boolean;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const [realProducts, setRealProducts] = useState<Product[]>([]);
  const [newProductId, setNewProductId] = useState<string | null>(null);

  // Fetch real products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      if (customWarehouseData) {
        try {
          const response = await fetch("/api/products/search?q=");
          if (!response.ok) throw new Error("Failed to fetch products");
          const data = await response.json();
          setRealProducts(data);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      }
    };

    fetchProducts();
  }, [customWarehouseData]);

  // Listen for new product notifications
  useEffect(() => {
    const handleNewProduct = (event: CustomEvent) => {
      const { productId } = event.detail;
      setNewProductId(productId);

      // Clear the new product highlight after 5 seconds
      setTimeout(() => {
        setNewProductId(null);
      }, 5000);
    };

    window.addEventListener(
      "newProductAdded",
      handleNewProduct as EventListener,
    );

    return () => {
      window.removeEventListener(
        "newProductAdded",
        handleNewProduct as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL not supported");
      setRenderError(true);
    }
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
          rendering.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-gray-50 rounded-lg shadow-lg overflow-hidden relative">
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "default",
          failIfMajorPerformanceCaveat: false,
          alpha: false,
          stencil: false,
          depth: true,
          premultipliedAlpha: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#f5f5f5", 1);
        }}
      >
        <ContextLossHandler />
        <PerspectiveCamera makeDefault position={[0, 20, 20]} fov={45} />
        <WarehouseScene
          selectedProduct={selectedProduct}
          customWarehouseData={customWarehouseData}
          isEditMode={isEditMode}
          realProducts={realProducts}
          newProductId={newProductId}
        />
      </Canvas>

      {/* Overlay for new product notification */}
      {newProductId && (
        <div className="absolute top-4 right-4 bg-green-100 p-3 rounded shadow-md border border-green-200 max-w-xs animate-bounce">
          <p className="text-sm font-medium text-green-800">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            New product added to warehouse!
          </p>
        </div>
      )}

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="absolute top-4 left-4 bg-orange-100 p-3 rounded shadow-md border border-orange-200 max-w-xs">
          <p className="text-sm font-medium text-orange-800 mb-1">
            <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
            Edit Mode Active
          </p>
          <p className="text-xs text-orange-700">
            Editing warehouse layout. Sections are highlighted and interactive.
          </p>
        </div>
      )}

      {/* Product highlight overlay */}
      {!isEditMode && selectedProduct && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded shadow-md border border-red-200 max-w-xs">
          <p className="text-sm font-medium text-gray-800 mb-1">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            Product Highlighted: {selectedProduct.id}
          </p>
          <p className="text-xs text-gray-600">
            Located in: {selectedProduct.location}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            Click and drag to rotate view. Scroll to zoom.
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse3D;
