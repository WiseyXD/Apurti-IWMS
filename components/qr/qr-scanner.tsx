// components/qr/qr-scanner.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, XCircle, Package, Bot, Hand } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QrScanner from "qr-scanner";

interface ScanData {
  code: string;
  timestamp: string;
  parsed?: any;
}

interface QRScannerProps {
  onScanComplete: (data: ScanData) => Promise<void>;
}

export function QRScannerComponent({ onScanComplete }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [placementMode, setPlacementMode] = useState<"automatic" | "manual">(
    "automatic",
  );
  const [aiPlacementLoading, setAiPlacementLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch warehouse sections when component mounts
  useEffect(() => {
    fetchWarehouseSections();
  }, []);

  const fetchWarehouseSections = async () => {
    try {
      const response = await fetch("/api/warehouse/get");
      if (!response.ok) throw new Error("Failed to fetch warehouse");
      const data = await response.json();
      setSections(data.sections);
    } catch (err) {
      console.error("Error fetching warehouse sections:", err);
    }
  };

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setPermissionStatus(result.state);

      result.addEventListener("change", () => {
        setPermissionStatus(result.state);
      });
    } catch (err) {
      console.log("Permission check not supported", err);
    }
  };

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionStatus("granted");
      startScanning();
    } catch (err) {
      console.error("Permission error:", err);
      setPermissionStatus("denied");
      setError(
        "Camera permission was denied. Please enable it in your browser settings.",
      );
    }
  };

  const parseQRData = (data: string): any => {
    try {
      return JSON.parse(data);
    } catch {
      // Try to parse custom format from the generated QR
      const regex = /{([^}]+)}/;
      const match = data.match(regex);

      if (match) {
        try {
          const jsonLikeStr = match[1]
            .split(",")
            .map((item) => {
              const [key, value] = item.split(":").map((s) => s.trim());
              // Remove quotes if present
              const cleanKey = key.replace(/["']/g, "");
              const cleanValue = value.replace(/["']/g, "");
              return `"${cleanKey}":"${cleanValue}"`;
            })
            .join(",");

          return JSON.parse(`{${jsonLikeStr}}`);
        } catch (e) {
          console.error("Error parsing custom format:", e);
        }
      }

      return { type: "text", content: data };
    }
  };

  const handleScan = async (result: QrScanner.ScanResult) => {
    if (result && result.data) {
      console.log("Raw scan result:", result);

      try {
        const parsedData = parseQRData(result.data);
        console.log("Parsed data:", parsedData);

        const scanData: ScanData = {
          code: result.data,
          timestamp: new Date().toISOString(),
          parsed: parsedData,
        };

        setScannedData(scanData);
        stopScanning();
        setShowSectionDialog(true);
      } catch (err) {
        console.error("Error processing scan:", err);
        setError("Failed to process scan data: " + (err as Error).message);
      }
    }
  };

  const aiDeterminePlacement = async (productData: any) => {
    // Extract product requirements from scanned data
    const requirements = {
      requiresColdStorage:
        productData.requiresColdStorage ||
        productData.type?.toLowerCase().includes("food") ||
        productData.category?.toLowerCase().includes("food"),
      fragile:
        productData.fragile ||
        productData.category?.toLowerCase().includes("glass") ||
        productData.category?.toLowerCase().includes("fragile"),
      hazardous:
        productData.hazardous ||
        productData.category?.toLowerCase().includes("chemical"),
      weight: parseFloat(productData.weight) || 1,
      temperature: productData.temperature
        ? parseFloat(productData.temperature)
        : null,
    };

    // Find the best matching section
    let bestSection = sections[0]; // Default to first section
    let bestScore = 0;

    sections.forEach((section: any) => {
      let score = 0;

      // Check cold storage requirement
      if (requirements.requiresColdStorage && section.temperature < 10) {
        score += 10;
      }

      // Check fragile handling
      if (requirements.fragile && section.fragile) {
        score += 5;
      }

      // Check hazardous materials
      if (requirements.hazardous && section.hazardous) {
        score += 5;
      }

      // Weight consideration (heavier items should be at lower positions)
      if (requirements.weight > 10 && section.positionY <= 1) {
        score += 3;
      }

      // Temperature requirements
      if (
        requirements.temperature &&
        section.temperature &&
        Math.abs(section.temperature - requirements.temperature) < 5
      ) {
        score += 7;
      }

      if (score > bestScore) {
        bestScore = score;
        bestSection = section;
      }
    });

    return bestSection;
  };

  const handleSaveProduct = async () => {
    if (!scannedData) {
      setError("No product data available");
      return;
    }

    if (placementMode === "manual" && !selectedSection) {
      setError("Please select a section for the product");
      return;
    }

    setIsSaving(true);
    try {
      let targetSection = selectedSection;

      // If automatic placement is selected, use AI to determine the best section
      if (placementMode === "automatic") {
        setAiPlacementLoading(true);
        const aiSection = await aiDeterminePlacement(scannedData.parsed);
        targetSection = aiSection.id;
        setAiPlacementLoading(false);
      }

      const productData = {
        name:
          scannedData.parsed.name ||
          scannedData.parsed.customerName ||
          `Product-${scannedData.parsed.shipmentNumber || new Date().toISOString()}`,
        description: scannedData.parsed.description || "",
        sku:
          scannedData.parsed.sku ||
          scannedData.parsed.shipmentNumber ||
          scannedData.code,
        qrCode: scannedData.code,
        category: scannedData.parsed.category || "Uncategorized",
        quantity: scannedData.parsed.quantity || 1,
        width: scannedData.parsed.width || 1,
        height: scannedData.parsed.height || 1,
        depth: scannedData.parsed.depth || 1,
        weight: scannedData.parsed.weight
          ? parseFloat(scannedData.parsed.weight)
          : 1,
        requiresColdStorage: scannedData.parsed.requiresColdStorage || false,
        fragile: scannedData.parsed.fragile || false,
        hazardous: scannedData.parsed.hazardous || false,
        sectionId: targetSection,
        // Default position within the section
        positionX: Math.random() * 5 - 2.5, // Random position within section
        positionY: 1, // 1 meter above ground
        positionZ: Math.random() * 5 - 2.5,
        status: "IN_STOCK",
        priority: "MEDIUM",
      };

      const response = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to save product");

      const savedProduct = await response.json();

      // Call the original onScanComplete with enhanced data
      await onScanComplete({
        ...scannedData,
        parsed: { ...scannedData.parsed, productId: savedProduct.id },
      });

      setShowSectionDialog(false);
      setScannedData(null);
      setSelectedSection("");

      // Show success message
      setError(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product: " + (err as Error).message);
    } finally {
      setIsSaving(false);
      setAiPlacementLoading(false);
    }
  };

  const startScanning = async () => {
    setError(null);

    try {
      if (permissionStatus === "denied") {
        throw new Error("Camera permission is required");
      }

      if (!videoRef.current) {
        throw new Error("Video element not found");
      }

      const scanner = new QrScanner(videoRef.current, handleScan, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
        preferredCamera: "environment",
      });

      await scanner.start();
      setQrScanner(scanner);
      setScanning(true);
    } catch (err) {
      console.error("Scanner error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Camera error: ${errorMessage}`);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScanner) {
      qrScanner.stop();
      setQrScanner(null);
    }
    setScanning(false);
  };

  const handleNewScan = () => {
    setScannedData(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.stop();
      }
    };
  }, [qrScanner]);

  const renderPermissionRequest = () => (
    <div className="text-center p-4">
      <h3 className="text-lg font-medium mb-4">Camera Permission Required</h3>
      <p className="mb-4 text-gray-600">
        To scan QR codes, we need access to your camera. Please allow camera
        access when prompted.
      </p>
      <button
        onClick={requestCameraPermission}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Allow Camera Access
      </button>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-6 h-6" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {permissionStatus === "denied" && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Camera access was denied. Please enable it in your browser
              settings.
            </AlertDescription>
          </Alert>
        )}

        {!scanning && !scannedData && permissionStatus !== "denied" && (
          <>
            {permissionStatus === "prompt" ? (
              renderPermissionRequest()
            ) : (
              <button
                onClick={startScanning}
                className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Scanning
              </button>
            )}
          </>
        )}

        <div className={`relative ${scanning ? "block" : "hidden"}`}>
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              className="min-w-full min-h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <div className="absolute inset-0 border-2 border-blue-500 animate-pulse rounded-lg" />
          </div>
          <button
            onClick={stopScanning}
            className="absolute top-2 right-2 p-1 bg-white rounded-full hover:bg-gray-100"
            aria-label="Stop scanning"
          >
            <XCircle className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Section Selection Dialog */}
        <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select Warehouse Section</DialogTitle>
            </DialogHeader>
            {scannedData && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Scanned Product:</h3>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {scannedData.parsed.name ||
                        scannedData.parsed.customerName ||
                        "Unknown"}
                    </p>
                    <p>
                      <span className="font-medium">SKU:</span>{" "}
                      {scannedData.parsed.sku ||
                        scannedData.parsed.shipmentNumber ||
                        scannedData.code}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {scannedData.parsed.category || "Uncategorized"}
                    </p>
                  </div>
                </div>

                {/* Placement Mode Selection */}
                <div className="flex items-center justify-between space-x-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-500" />
                    <Label htmlFor="placement-mode">
                      AI Automatic Placement
                    </Label>
                  </div>
                  <Switch
                    id="placement-mode"
                    checked={placementMode === "automatic"}
                    onCheckedChange={(checked) =>
                      setPlacementMode(checked ? "automatic" : "manual")
                    }
                  />
                </div>

                {placementMode === "manual" && (
                  <div>
                    <Label>Select Section Location</Label>
                    <select
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 mt-2"
                    >
                      <option value="">Select a section...</option>
                      {sections.map((section: any) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                          {section.temperature && ` (${section.temperature}°C)`}
                          {section.hazardous && " (Hazardous)"}
                          {section.fragile && " (Fragile)"}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {placementMode === "automatic" && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <Bot className="w-5 h-5" />
                      <p className="text-sm">
                        AI will automatically determine the best location based
                        on product requirements
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSectionDialog(false);
                      setScannedData(null);
                      startScanning();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProduct}
                    disabled={
                      (placementMode === "manual" && !selectedSection) ||
                      isSaving ||
                      aiPlacementLoading
                    }
                  >
                    {isSaving
                      ? "Saving..."
                      : aiPlacementLoading
                        ? "AI is processing..."
                        : "Save Product"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {scannedData && !showSectionDialog && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Product Saved Successfully!</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span>
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto mt-1">
                    {scannedData.parsed.name || "Unknown"}
                  </pre>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto mt-1">
                    {sections.find((s) => s.id === selectedSection)?.name ||
                      "Unknown"}
                  </pre>
                </div>
              </div>
            </div>
            <button
              onClick={handleNewScan}
              className="w-full bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Scan Another Code
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
