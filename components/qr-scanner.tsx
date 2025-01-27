"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check initial permission status
  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      setPermissionStatus(result.state);

      // Listen for permission changes
      result.addEventListener("change", () => {
        setPermissionStatus(result.state);
      });
    } catch (err) {
      console.log("Permission check not supported");
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream immediately
      setPermissionStatus("granted");
      startScanning(); // Start scanning after permission is granted
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
      // First, try to parse as JSON
      return JSON.parse(data);
    } catch {
      // If not JSON, try to detect other formats
      if (data.startsWith("http")) {
        return { type: "url", url: data };
      }
      // Check if it's a vCard format
      if (data.startsWith("BEGIN:VCARD")) {
        const lines = data.split("\n");
        const contact: any = {};
        lines.forEach((line) => {
          if (line.startsWith("FN:")) contact.fullName = line.slice(3);
          if (line.startsWith("TEL:")) contact.phone = line.slice(4);
          if (line.startsWith("EMAIL:")) contact.email = line.slice(6);
        });
        return { type: "contact", ...contact };
      }
      // If no special format detected, return as plain text
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

        await onScanComplete(scanData);
        setScannedData(scanData);
        stopScanning();
      } catch (err) {
        console.error("Error processing scan:", err);
        setError("Failed to process scan data: " + (err as Error).message);
      }
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

      // Check available cameras
      const cameras = await QrScanner.listCameras();
      console.log("Available cameras:", cameras);
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

  // Cleanup on unmount
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
              settings and refresh the page.
              <br />
              <strong>Chrome:</strong> Settings → Privacy and security → Site
              Settings → Camera
              <br />
              <strong>Firefox:</strong> Settings → Privacy & Security →
              Permissions → Camera
              <br />
              <strong>Safari:</strong> Preferences → Websites → Camera
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

        {scannedData && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Scanned Data:</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Raw Data:</span>
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto mt-1">
                    {scannedData.code}
                  </pre>
                </div>
                {scannedData.parsed && (
                  <div>
                    <span className="font-medium">Parsed Data:</span>
                    <pre className="text-sm whitespace-pre-wrap overflow-x-auto mt-1">
                      {JSON.stringify(scannedData.parsed, null, 2)}
                    </pre>
                  </div>
                )}
                <div>
                  <span className="font-medium">Timestamp:</span>
                  <pre className="text-sm whitespace-pre-wrap overflow-x-auto mt-1">
                    {new Date(scannedData.timestamp).toLocaleString()}
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
