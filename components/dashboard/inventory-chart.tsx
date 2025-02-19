// components/dashboard/inventory-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PackageSearch } from "lucide-react";

const inventoryData = [
  { category: "Electronics", stock: 850 },
  { category: "Furniture", stock: 420 },
  { category: "Clothing", stock: 670 },
  { category: "Books", stock: 390 },
  { category: "Sports", stock: 280 },
];

export function InventoryChart() {
  return (
    <Card className="lg:col-span-2 bg-white">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <CardTitle className="text-slate-900">Inventory Overview</CardTitle>
        <PackageSearch className="w-5 h-5 text-slate-600" />
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="category" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="stock" fill="#0891B2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
