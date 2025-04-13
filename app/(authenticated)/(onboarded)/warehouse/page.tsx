// app/(authenticated)/(onboarded)/warehouse/page.ts"use client";
"use client";
import WarehouseComponent from "./_components/WarehouseComponent";
import { MoveRight, Warehouse, Package, Info } from "lucide-react";

export default function WarehousePage() {
  return (
    <div className="container mx-auto py-8">
      {/* Enhanced header with icon and description */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Warehouse className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Warehouse Management
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Visualize and manage your warehouse layout with our interactive 3D
          model. Monitor package movement and optimize your storage space for
          maximum efficiency.
        </p>
      </div>

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

      {/* Main Warehouse Component */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <WarehouseComponent />
      </div>

      {/* Footer with additional information */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Last updated: April 14, 2025 | Warehouse configuration v2.3</p>
      </div>
    </div>
  );
}
