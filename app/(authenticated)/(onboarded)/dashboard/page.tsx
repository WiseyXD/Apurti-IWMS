// app/(authenticated)/(onboarded)/dashboard/page.tsx
import { Package, PackageSearch, AlertTriangle, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { InventoryChart } from "@/components/dashboard/inventory-chart";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { DashboardHeader } from "@/components/dashboard/header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const statsData = [
    {
      title: "Total Inventory",
      value: "2,547",
      trend: {
        value: "+12.5% from last month",
        isPositive: true,
      },
      icon: <Package className="w-6 h-6 text-cyan-600" />,
      iconBgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: "Active Orders",
      value: "128",
      trend: {
        value: "+5.2% from last week",
        isPositive: true,
      },
      icon: <PackageSearch className="w-6 h-6 text-indigo-600" />,
      iconBgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Low Stock Alerts",
      value: "12",
      trend: {
        value: "Requires attention",
        isPositive: false,
      },
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Active Staff",
      value: "24",
      description: "Across 3 shifts",
      icon: <Users className="w-6 h-6 text-green-600" />,
      iconBgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userEmail={session.user.email} />

      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              description={stat.description}
              icon={stat.icon}
              iconBgColor={stat.iconBgColor}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PerformanceChart />
          <QuickActions />
          <InventoryChart />
          <RecentAlerts />
        </div>
      </div>
    </div>
  );
}
