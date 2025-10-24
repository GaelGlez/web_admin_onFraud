// components/dashboard/StatCard.tsx
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: ReactNode;
    color?: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-3xl font-bold mt-1" style={{ color }}>
          {value}
        </p>
      </div>
      {icon && <div className="text-gray-400 text-3xl">{icon}</div>}
    </div>
  );
}
