// components/dashboard/recent-alerts.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowUpRight } from "lucide-react";

export function RecentAlerts() {
  return (
    <Card className="bg-white">
      <CardHeader className="p-6">
        <CardTitle className="text-slate-900">Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="font-medium text-amber-900">Low Stock Alert</p>
            </div>
            <p className="text-sm text-amber-800">
              Electronics category is running low on inventory
            </p>
            <p className="text-xs text-amber-700 mt-2">2 hours ago</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
              <p className="font-medium text-green-900">High Demand</p>
            </div>
            <p className="text-sm text-green-800">
              Increased demand in Furniture category
            </p>
            <p className="text-xs text-green-700 mt-2">5 hours ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
