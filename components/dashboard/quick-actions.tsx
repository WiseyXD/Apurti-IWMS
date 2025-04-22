// components/dashboard/quick-actions.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Package, Truck, ArrowRight } from "lucide-react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

export function QuickActions() {
  return (
    <Card className="bg-white">
      <CardHeader className="p-6">
        <CardTitle className="text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="space-y-4">
          <Link
            href="/qr"
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-cyan-100 p-2 rounded-lg">
                <QrCode className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">QR Code Scanner</p>
                <p className="text-sm text-slate-600">Scan items quickly</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="https://apurti-an-intelligence-warehouse-management-system.vercel.app/#/chat"
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <ChatBubbleIcon className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Space Optimization</p>
                <p className="text-sm text-slate-600">
                  Store items efficiently
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>

          <Link
            href="/warehouse"
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Warehouse View</p>
                <p className="text-sm text-slate-600">Add new items</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
