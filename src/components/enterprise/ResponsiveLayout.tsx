import React from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export const ResponsiveLayout = ({
  children,
  sidebar,
  className = "",
}: ResponsiveLayoutProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!sidebar) {
    return (
      <div className={`container mx-auto px-4 py-6 ${className}`}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className={`container mx-auto px-4 py-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6">
              {sidebar}
            </SheetContent>
          </Sheet>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">{children}</div>
        <div className="lg:col-span-1">{sidebar}</div>
      </div>
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: number;
  className?: string;
}

export const ResponsiveGrid = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 6,
  className = "",
}: ResponsiveGridProps) => {
  const gridClasses = `grid grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} gap-${gap} ${className}`;

  return <div className={gridClasses}>{children}</div>;
};

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const ResponsiveCard = ({
  children,
  className = "",
  hover = true,
}: ResponsiveCardProps) => {
  const hoverClasses = hover
    ? "hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    : "";

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm p-4 md:p-6 ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

interface ResponsiveTableProps {
  headers: string[];
  data: any[][];
  actions?: (rowIndex: number) => React.ReactNode;
  className?: string;
}

export const ResponsiveTable = ({
  headers,
  data,
  actions,
  className = "",
}: ResponsiveTableProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map((row, rowIndex) => (
          <ResponsiveCard key={rowIndex} className="space-y-3">
            {headers.map((header, colIndex) => (
              <div key={colIndex} className="flex justify-between items-center">
                <span className="font-medium text-sm text-gray-600">
                  {header}:
                </span>
                <span className="text-sm">{row[colIndex]}</span>
              </div>
            ))}
            {actions && (
              <div className="pt-3 border-t">{actions(rowIndex)}</div>
            )}
          </ResponsiveCard>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            {headers.map((header, index) => (
              <th key={index} className="text-left p-4 font-semibold text-sm">
                {header}
              </th>
            ))}
            {actions && (
              <th className="text-left p-4 font-semibold text-sm">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="p-4 text-sm">
                  {cell}
                </td>
              ))}
              {actions && <td className="p-4">{actions(rowIndex)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ResponsiveStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: number;
    changeType?: "positive" | "negative" | "neutral";
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const ResponsiveStats = ({
  stats,
  className = "",
}: ResponsiveStatsProps) => {
  return (
    <ResponsiveGrid
      columns={{
        mobile: 1,
        tablet: 2,
        desktop: stats.length > 4 ? 4 : stats.length,
      }}
      className={className}
    >
      {stats.map((stat, index) => (
        <ResponsiveCard key={index} className="text-center">
          {stat.icon && (
            <div className="mb-3 flex justify-center">{stat.icon}</div>
          )}
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
          {stat.change !== undefined && (
            <div
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {stat.change > 0 ? "+" : ""}
              {stat.change}%
            </div>
          )}
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  );
};

export const ResponsiveContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
};
