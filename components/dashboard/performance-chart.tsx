// components/dashboard/performance-chart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

const monthlyData = [
  { name: "Jan", value: 4500 },
  { name: "Feb", value: 5200 },
  { name: "Mar", value: 4800 },
  { name: "Apr", value: 5700 },
  { name: "May", value: 6100 },
  { name: "Jun", value: 5900 },
];

export function PerformanceChart() {
  return (
    <Card className="lg:col-span-2 bg-white">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <CardTitle className="text-slate-900">Monthly Performance</CardTitle>
        <BarChart3 className="w-5 h-5 text-slate-600" />
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0891B2"
                strokeWidth={2}
                dot={{ stroke: "#0891B2", strokeWidth: 2, fill: "#FFF" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
