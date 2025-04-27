// app/(authenticated)/(onboarded)/warehouse/_components/VisualEditor.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Move, RotateCw, Maximize2, MousePointer } from "lucide-react";

interface VisualEditorProps {
  sections: any[];
  onUpdateSection: (index: number, updates: any) => void;
  warehouseDimensions: { length: number; width: number; height: number };
}

const VisualEditor: React.FC<VisualEditorProps> = ({
  sections,
  onUpdateSection,
  warehouseDimensions,
}) => {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [dragMode, setDragMode] = useState<"move" | "resize" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (
    e: React.MouseEvent,
    index: number,
    mode: "move" | "resize",
  ) => {
    e.preventDefault();
    setSelectedSection(index);
    setDragMode(mode);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragMode || selectedSection === null || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = warehouseDimensions.length / rect.width;

    const deltaX = (e.clientX - dragStart.x) * scale;
    const deltaZ = (e.clientY - dragStart.y) * scale;

    const section = sections[selectedSection];

    if (dragMode === "move") {
      onUpdateSection(selectedSection, {
        positionX: section.positionX + deltaX,
        positionZ: section.positionZ + deltaZ,
      });
    } else if (dragMode === "resize") {
      onUpdateSection(selectedSection, {
        sizeX: Math.max(1, section.sizeX + deltaX),
        sizeZ: Math.max(1, section.sizeZ + deltaZ),
      });
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragMode(null);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Visual Layout Editor</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={dragMode === "move" ? "bg-blue-100" : ""}
            onClick={() => setDragMode(dragMode === "move" ? null : "move")}
          >
            <Move className="w-4 h-4 mr-1" />
            Move
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={dragMode === "resize" ? "bg-blue-100" : ""}
            onClick={() => setDragMode(dragMode === "resize" ? null : "resize")}
          >
            <Maximize2 className="w-4 h-4 mr-1" />
            Resize
          </Button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="relative w-full h-96 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Warehouse boundary */}
        <div
          className="absolute border-2 border-gray-600"
          style={{
            left: "0%",
            top: "0%",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Grid lines */}
        {[...Array(10)].map((_, i) => (
          <React.Fragment key={i}>
            <div
              className="absolute border-dashed border-gray-300"
              style={{
                left: `${(i + 1) * 10}%`,
                top: 0,
                width: 1,
                height: "100%",
                borderWidth: "1px",
              }}
            />
            <div
              className="absolute border-dashed border-gray-300"
              style={{
                left: 0,
                top: `${(i + 1) * 10}%`,
                width: "100%",
                height: 1,
                borderWidth: "1px",
              }}
            />
          </React.Fragment>
        ))}

        {/* Sections */}
        {sections.map((section, index) => {
          const scaleX = 100 / warehouseDimensions.length;
          const scaleZ = 100 / warehouseDimensions.width;

          return (
            <div
              key={index}
              className={`absolute border-2 ${
                selectedSection === index
                  ? "border-blue-500"
                  : "border-gray-600"
              }`}
              style={{
                left: `${(section.positionX + warehouseDimensions.length / 2 - section.sizeX / 2) * scaleX}%`,
                top: `${(section.positionZ + warehouseDimensions.width / 2 - section.sizeZ / 2) * scaleZ}%`,
                width: `${section.sizeX * scaleX}%`,
                height: `${section.sizeZ * scaleZ}%`,
                backgroundColor: section.color,
                opacity: 0.7,
                cursor:
                  dragMode === "move"
                    ? "move"
                    : dragMode === "resize"
                      ? "se-resize"
                      : "pointer",
              }}
              onMouseDown={(e) => handleMouseDown(e, index, dragMode || "move")}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold bg-white px-2 py-1 rounded">
                  {section.name}
                </span>
              </div>

              {/* Resize handle */}
              {selectedSection === index && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                  onMouseDown={(e) => handleMouseDown(e, index, "resize")}
                />
              )}
            </div>
          );
        })}

        {/* Instructions */}
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs">
          {dragMode === "move"
            ? "Click and drag sections to move"
            : dragMode === "resize"
              ? "Click and drag corners to resize"
              : "Select a mode to edit section positions"}
        </div>
      </div>

      {/* Selected section info */}
      {selectedSection !== null && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">
            Selected: {sections[selectedSection].name}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Position X: {sections[selectedSection].positionX.toFixed(1)}m
            </div>
            <div>
              Position Z: {sections[selectedSection].positionZ.toFixed(1)}m
            </div>
            <div>Width: {sections[selectedSection].sizeX.toFixed(1)}m</div>
            <div>Depth: {sections[selectedSection].sizeZ.toFixed(1)}m</div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VisualEditor;
