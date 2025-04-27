// app/(authenticated)/(onboarded)/warehouse/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import WarehouseComponent from "./_components/WarehouseComponent";
import ProductSearch from "./_components/ProductSearch";
import {
  MoveRight,
  Warehouse,
  Package,
  Info,
  Edit,
  Save,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import VisualEditor from "./_components/VisualEditor";

// Section types for dropdown
const SECTION_TYPES = [
  { id: "storage", label: "General Storage", color: "#9ccc65" },
  { id: "cold_storage", label: "Cold Storage", color: "#80deea" },
  { id: "receiving_dock", label: "Receiving Dock", color: "#4dabf5" },
  { id: "shipping_dock", label: "Shipping Dock", color: "#4db6ac" },
  { id: "packaging", label: "Packaging Station", color: "#ba68c8" },
  { id: "office", label: "Management Office", color: "#ffb74d" },
  { id: "quality_control", label: "Quality Control", color: "#f06292" },
];

export default function WarehousePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDemo, setIsDemo] = useState(true);
  const [userWarehouseData, setUserWarehouseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSections, setEditingSections] = useState([]);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New section form state
  const [newSection, setNewSection] = useState({
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

  useEffect(() => {
    if (!isDemo) {
      fetchUserWarehouse();
    }
  }, [isDemo]);

  const fetchUserWarehouse = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/warehouse/get");
      if (!response.ok) throw new Error("Failed to fetch warehouse");
      const data = await response.json();
      setUserWarehouseData(data);
      setEditingSections(data.sections);
      setError(null);
    } catch (err) {
      console.error("Error fetching warehouse:", err);
      setError("Failed to load your warehouse. Showing demo mode.");
      setIsDemo(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
  };

  // Enter/Exit edit mode
  const toggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode
      setEditingSections(userWarehouseData.sections);
    }
    setIsEditMode(!isEditMode);
  };

  // Handle section update
  const handleSectionUpdate = (index, field, value) => {
    const updatedSections = [...editingSections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]:
        field.includes("position") || field.includes("size")
          ? parseFloat(value) || 0
          : value,
    };
    setEditingSections(updatedSections);
  };

  // Delete section
  const handleDeleteSection = (index) => {
    const updatedSections = editingSections.filter((_, i) => i !== index);
    setEditingSections(updatedSections);
  };

  // Add new section
  const handleAddSection = () => {
    if (newSection.name && newSection.type) {
      setEditingSections([
        ...editingSections,
        { ...newSection, id: `temp-${Date.now()}` },
      ]);
      setShowAddSectionDialog(false);
      setNewSection({
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

  // Save changes
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/warehouse/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          warehouseId: userWarehouseData.id,
          sections: editingSections,
        }),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      const updatedWarehouse = await response.json();
      setUserWarehouseData(updatedWarehouse);
      setIsEditMode(false);
      setError(null);
    } catch (err) {
      console.error("Error saving warehouse:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Enhanced header with icon and description */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Warehouse className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">
              Warehouse Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Edit Mode Toggle (only shown in live mode) */}
            {!isDemo && userWarehouseData && (
              <div className="flex items-center gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                      <Save className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={toggleEditMode}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={toggleEditMode}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Layout
                  </Button>
                )}
              </div>
            )}

            {/* Demo/Live Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-sm ${isDemo ? "text-gray-500" : "text-gray-900 font-medium"}`}
              >
                Live Mode
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDemo(!isDemo)}
                disabled={isEditMode}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isDemo ? "bg-gray-200" : "bg-blue-600"
                }`}
              >
                <span
                  className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isDemo ? "left-1" : "left-8"
                  }`}
                />
              </Button>
              <span
                className={`text-sm ${isDemo ? "text-gray-900 font-medium" : "text-gray-500"}`}
              >
                Demo Mode
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 max-w-3xl">
          Visualize and manage your warehouse layout with our interactive 3D
          model.
          {isEditMode &&
            " You are now in edit mode - modify sections as needed."}
        </p>

        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Edit Mode Panel */}
      {isEditMode && (
        <div className="space-y-6 mb-8">
          {/* Visual Editor */}
          <VisualEditor
            sections={editingSections}
            onUpdateSection={handleSectionUpdate}
            warehouseDimensions={{
              length: userWarehouseData.length,
              width: userWarehouseData.width,
              height: userWarehouseData.height,
            }}
          />

          {/* Section List */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Warehouse Sections</h3>
                <Dialog
                  open={showAddSectionDialog}
                  onOpenChange={setShowAddSectionDialog}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Section</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Section Type</Label>
                        <select
                          value={newSection.type}
                          onChange={(e) => {
                            const type = SECTION_TYPES.find(
                              (t) => t.id === e.target.value,
                            );
                            setNewSection({
                              ...newSection,
                              type: e.target.value,
                              name: type?.label || "",
                              color: type?.color || "#9ccc65",
                            });
                          }}
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
                        <Label>Description</Label>
                        <Input
                          value={newSection.description}
                          onChange={(e) =>
                            setNewSection({
                              ...newSection,
                              description: e.target.value,
                            })
                          }
                          placeholder="Section description"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Position X</Label>
                          <Input
                            type="number"
                            value={newSection.positionX}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                positionX: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Position Y</Label>
                          <Input
                            type="number"
                            value={newSection.positionY}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                positionY: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Position Z</Label>
                          <Input
                            type="number"
                            value={newSection.positionZ}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                positionZ: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Size X</Label>
                          <Input
                            type="number"
                            value={newSection.sizeX}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                sizeX: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Size Y</Label>
                          <Input
                            type="number"
                            value={newSection.sizeY}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                sizeY: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Size Z</Label>
                          <Input
                            type="number"
                            value={newSection.sizeZ}
                            onChange={(e) =>
                              setNewSection({
                                ...newSection,
                                sizeZ: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddSection} className="w-full">
                        Add Section
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {editingSections.map((section, index) => (
                  <div
                    key={section.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: section.color }}
                        />
                        <h4 className="font-medium">{section.name}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSection(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div>
                        <Label className="text-xs">Position X</Label>
                        <Input
                          type="number"
                          value={section.positionX}
                          onChange={(e) =>
                            handleSectionUpdate(
                              index,
                              "positionX",
                              e.target.value,
                            )
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Position Y</Label>
                        <Input
                          type="number"
                          value={section.positionY}
                          onChange={(e) =>
                            handleSectionUpdate(
                              index,
                              "positionY",
                              e.target.value,
                            )
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Position Z</Label>
                        <Input
                          type="number"
                          value={section.positionZ}
                          onChange={(e) =>
                            handleSectionUpdate(
                              index,
                              "positionZ",
                              e.target.value,
                            )
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Size X</Label>
                        <Input
                          type="number"
                          value={section.sizeX}
                          onChange={(e) =>
                            handleSectionUpdate(index, "sizeX", e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Size Y</Label>
                        <Input
                          type="number"
                          value={section.sizeY}
                          onChange={(e) =>
                            handleSectionUpdate(index, "sizeY", e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Size Z</Label>
                        <Input
                          type="number"
                          value={section.sizeZ}
                          onChange={(e) =>
                            handleSectionUpdate(index, "sizeZ", e.target.value)
                          }
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Inventory</p>
            <p className="text-2xl font-bold">3,257 units</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <MoveRight className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today's Shipments</p>
            <p className="text-2xl font-bold">152 packages</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Info className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Space Utilization</p>
            <p className="text-2xl font-bold">78%</p>
          </div>
        </div>
      </div>

      {/* Product Search Component */}
      {!isEditMode && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Product Lookup</h2>
          <ProductSearch
            onProductSelect={handleProductSelect}
            onClearSelection={handleClearSelection}
            mode={isDemo ? "demo" : "live"}
          />
        </div>
      )}

      {/* Main Warehouse Component */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <WarehouseComponent
            selectedProduct={selectedProduct}
            customWarehouseData={
              !isDemo
                ? {
                    ...userWarehouseData,
                    sections: isEditMode
                      ? editingSections
                      : userWarehouseData?.sections,
                  }
                : null
            }
            isEditMode={isEditMode}
          />
        )}
      </div>

      {/* Footer with additional information */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Last updated: {new Date().toLocaleDateString()} | Warehouse
          configuration v2.4
        </p>
      </div>
    </div>
  );
}
