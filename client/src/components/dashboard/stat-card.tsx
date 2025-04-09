import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  trend,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm p-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
        </div>
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", iconBgColor)}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      {trend && <div className="mt-3 text-sm text-gray-600">{trend}</div>}
    </div>
  );
}
