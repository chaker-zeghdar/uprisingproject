import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export default function Card({ title, value, icon: Icon, trend, className }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 text-zinc-900">
          <Icon size={24} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">{value}</h3>
      </div>
    </div>
  );
}
