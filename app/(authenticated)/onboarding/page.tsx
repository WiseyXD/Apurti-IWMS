// app/onboarding/page.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Warehouse,
  Box,
  Check,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import WarehousePreview from "@/components/warehouse/warehouse-preview";

interface WarehouseData {
  name: string;
  description: string;
  address: string;
  length: number;
  width: number;
  height: number;
}

interface SectionData {
  name: string;
  type: string;
  description: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  color: string;
}

const SECTION_TYPES = [
  { id: "storage", label: "General Storage", color: "#9ccc65" },
  { id: "cold_storage", label: "Cold Storage", color: "#80deea" },
  { id: "receiving_dock", label: "Receiving Dock", color: "#4dabf5" },
  { id: "shipping_dock", label: "Shipping Dock", color: "#4db6ac" },
  { id: "packaging", label: "Packaging Station", color: "#ba68c8" },
  { id: "office", label: "Management Office", color: "#ffb74d" },
  { id: "quality_control", label: "Quality Control", color: "#f06292" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [warehouseData, setWarehouseData] = useState<WarehouseData>({
    name: "",
    description: "",
    address: "",
    length: 40,
    width: 30,
    height: 8,
  });
  const [sections, setSections] = useState<SectionData[]>([]);
  const [currentSection, setCurrentSection] = useState<SectionData>({
    name: "",
    type: "",
    description: "",
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    sizeX: 5,
    sizeY: 5,
    sizeZ: 3,
    color: "#9ccc65",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleWarehouseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setWarehouseData((prev) => ({
      ...prev,
      [name]:
        name === "length" || name === "width" || name === "height"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSectionChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "type") {
      const selectedType = SECTION_TYPES.find((type) => type.id === value);
      setCurrentSection((prev) => ({
        ...prev,
        type: value,
        color: selectedType?.color || "#9ccc65",
        name: selectedType?.label || "",
      }));
    } else {
      setCurrentSection((prev) => ({
        ...prev,
        [name]:
          name.includes("position") || name.includes("size")
            ? parseFloat(value) || 0
            : value,
      }));
    }
  };

  const addSection = () => {
    if (currentSection.name && currentSection.type) {
      setSections((prev) => [...prev, { ...currentSection }]);
      // Reset form but keep type and color for convenience
      setCurrentSection({
        name: "",
        type: "",
        description: "",
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        sizeX: 5,
        sizeY: 5,
        sizeZ: 3,
        color: "#9ccc65",
      });
    }
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Here you would make API calls to create the warehouse and sections
      const response = await fetch("/api/warehouse/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warehouse: warehouseData,
          sections: sections,
        }),
      });

      if (response.ok) {
        // Redirect to dashboard on success
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create warehouse");
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
      // You would show an error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-cyan-600" />
              <h1 className="text-2xl font-bold text-slate-900">
                Warehouse Setup
              </h1>
            </div>
            <span className="text-sm text-slate-600">Step {step} of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Let's start by setting up your warehouse details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Warehouse Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={warehouseData.name}
                  onChange={handleWarehouseChange}
                  placeholder="Main Distribution Center"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={warehouseData.description}
                  onChange={handleWarehouseChange}
                  placeholder="Primary warehouse for consumer electronics"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={warehouseData.address}
                  onChange={handleWarehouseChange}
                  placeholder="123 Warehouse St, City, State, ZIP"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setStep(2)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Dimensions */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Dimensions</CardTitle>
              <CardDescription>
                Define the physical size of your warehouse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="length">Length (meters)</Label>
                  <Input
                    id="length"
                    name="length"
                    type="number"
                    value={warehouseData.length}
                    onChange={handleWarehouseChange}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (meters)</Label>
                  <Input
                    id="width"
                    name="width"
                    type="number"
                    value={warehouseData.width}
                    onChange={handleWarehouseChange}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (meters)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={warehouseData.height}
                    onChange={handleWarehouseChange}
                    min="1"
                  />
                </div>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg">
                <p className="text-sm text-slate-600">
                  Total Area:{" "}
                  {(warehouseData.length * warehouseData.width).toFixed(2)} m²
                </p>
                <p className="text-sm text-slate-600">
                  Total Volume:{" "}
                  {(
                    warehouseData.length *
                    warehouseData.width *
                    warehouseData.height
                  ).toFixed(2)}{" "}
                  m³
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Sections */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Sections</CardTitle>
              <CardDescription>
                Define different areas within your warehouse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Section Form */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Section Type</Label>
                    <select
                      id="type"
                      name="type"
                      value={currentSection.type}
                      onChange={handleSectionChange}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">Select type...</option>
                      {SECTION_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={currentSection.description}
                      onChange={handleSectionChange}
                      placeholder="Additional details..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Position X</Label>
                    <Input
                      name="positionX"
                      type="number"
                      value={currentSection.positionX}
                      onChange={handleSectionChange}
                    />
                  </div>
                  <div>
                    <Label>Position Y</Label>
                    <Input
                      name="positionY"
                      type="number"
                      value={currentSection.positionY}
                      onChange={handleSectionChange}
                    />
                  </div>
                  <div>
                    <Label>Position Z</Label>
                    <Input
                      name="positionZ"
                      type="number"
                      value={currentSection.positionZ}
                      onChange={handleSectionChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Size X</Label>
                    <Input
                      name="sizeX"
                      type="number"
                      value={currentSection.sizeX}
                      onChange={handleSectionChange}
                    />
                  </div>
                  <div>
                    <Label>Size Y</Label>
                    <Input
                      name="sizeY"
                      type="number"
                      value={currentSection.sizeY}
                      onChange={handleSectionChange}
                    />
                  </div>
                  <div>
                    <Label>Size Z</Label>
                    <Input
                      name="sizeZ"
                      type="number"
                      value={currentSection.sizeZ}
                      onChange={handleSectionChange}
                    />
                  </div>
                </div>

                <Button onClick={addSection} className="w-full">
                  <Box className="w-4 h-4 mr-2" /> Add Section
                </Button>
              </div>

              {/* Added Sections List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Added Sections</h3>
                  {sections.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                  )}
                </div>
                {sections.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">
                    No sections added yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: section.color }}
                          />
                          <div>
                            <p className="font-medium">{section.name}</p>
                            <p className="text-sm text-slate-600">
                              {section.sizeX}m × {section.sizeY}m ×{" "}
                              {section.sizeZ}m
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview */}
              {showPreview && sections.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Warehouse Preview</h3>
                  <WarehousePreview
                    length={warehouseData.length}
                    width={warehouseData.width}
                    height={warehouseData.height}
                    sections={sections}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || sections.length === 0}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {isLoading ? (
                  "Creating..."
                ) : (
                  <>
                    Complete Setup <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
