"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export function StatsCard({
  title,
  value,
  trend,
  description,
  icon,
  iconBgColor,
  iconColor,
}: StatsCardProps) {
  return (
    <Card className="bg-white hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {trend && (
              <p
                className={`text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"} flex items-center mt-1`}
              >
                {trend.value}
              </p>
            )}
            {description && (
              <p className="text-sm text-slate-600 flex items-center mt-1">
                {description}
              </p>
            )}
          </div>
          <div className={`${iconBgColor} p-3 rounded-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
