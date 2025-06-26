import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  Search,
  Sort,
  Grid,
  List,
  Eye,
  Share2,
  Download,
  RotateCcw,
  Settings,
  Info,
} from "lucide-react";

interface MobileOptimizerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export const MobileOptimizer = ({
  children,
  title,
  subtitle,
  actions,
  filters,
  sidebar,
  className = "",
}: MobileOptimizerProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (!isMobile) {
    return (
      <div className={`space-y-6 ${className}`}>
        {(title || subtitle || actions) && (
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              )}
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-3">{actions}</div>
            )}
          </div>
        )}

        {filters && (
          <div className="bg-white rounded-lg border p-4">{filters}</div>
        )}

        <div
          className={`grid ${sidebar ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1"} gap-6`}
        >
          <div className={sidebar ? "lg:col-span-3" : "col-span-1"}>
            {children}
          </div>
          {sidebar && <div className="lg:col-span-1">{sidebar}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Mobile Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            {sidebar && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ScrollArea className="h-[calc(100vh-100px)]">
                      {sidebar}
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <div>
              {title && (
                <h1 className="text-lg font-semibold text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {filters && (
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filters & Search</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ScrollArea className="h-[calc(80vh-100px)]">
                      <div className="space-y-4">{filters}</div>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {actions}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4">{children}</div>
    </div>
  );
};

interface MobileCardGridProps {
  items: any[];
  renderCard: (item: any, index: number) => React.ReactNode;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

export const MobileCardGrid = ({
  items,
  renderCard,
  viewMode = "grid",
  onViewModeChange,
  loading = false,
  emptyState,
  className = "",
}: MobileCardGridProps) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      emptyState || (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )
    );
  }

  const gridClasses = isMobile
    ? "space-y-4"
    : viewMode === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : "space-y-4";

  return (
    <div className={className}>
      {onViewModeChange && !isMobile && (
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className={gridClasses}>
        {items.map((item, index) => renderCard(item, index))}
      </div>
    </div>
  );
};

interface MobileStatsProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: number;
    changeType?: "positive" | "negative" | "neutral";
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export const MobileStats = ({ stats, className = "" }: MobileStatsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              {stat.icon && (
                <div className="mb-2 flex justify-center">{stat.icon}</div>
              )}
              <div className="text-lg font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600">{stat.label}</div>
              {stat.change !== undefined && (
                <div
                  className={`text-xs mt-1 ${
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
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface MobileTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  defaultTab?: string;
  className?: string;
}

export const MobileTabs = ({
  tabs,
  defaultTab,
  className = "",
}: MobileTabsProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (isMobile) {
    return (
      <div className={className}>
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className={className}>
      <TabsList
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center space-x-2"
          >
            {tab.icon}
            <span>{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default MobileOptimizer;
