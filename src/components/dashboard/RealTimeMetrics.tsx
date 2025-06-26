import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrganizations, useProducts, useOrders, useRealTimeOrders } from '@/hooks/useSupabaseData';
import { Activity, TrendingUp, Package, Users, Globe, Zap } from 'lucide-react';

export const RealTimeMetrics = () => {
  const { data: orders } = useOrders();
  const { data: products } = useProducts();
  const { data: organizations } = useOrganizations();
  const realtimeOrders = useRealTimeOrders();
  
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0,
    activePartners: 0,
    globalReach: 0,
    systemUptime: 99.8
  });

  useEffect(() => {
    if (orders && products && organizations) {
      const revenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const activeOrdersCount = orders?.filter(order => ['pending', 'confirmed', 'processing'].includes(order.status)).length || 0;
      const activePartnersCount = organizations?.filter(org => org.verification_status === 'verified').length || 0;
      const countriesCount = new Set(organizations?.map(org => org.country)).size || 0;

      setMetrics({
        totalRevenue: revenue,
        activeOrders: activeOrdersCount,
        totalProducts: products?.length || 0,
        activePartners: activePartnersCount,
        globalReach: countriesCount,
        systemUptime: 99.8
      });
    }
  }, [orders, products, organizations]);

  const metricCards = [
    {
      title: "Total Revenue",
      value: `KSH ${(metrics.totalRevenue / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: "text-green-600",
      change: "+12.5%"
    },
    {
      title: "Active Orders",
      value: metrics.activeOrders.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      change: "+8.2%"
    },
    {
      title: "Product Catalog",
      value: metrics.totalProducts.toLocaleString(),
      icon: Activity,
      color: "text-purple-600",
      change: "+15.3%"
    },
    {
      title: "Verified Partners",
      value: metrics.activePartners.toLocaleString(),
      icon: Users,
      color: "text-orange-600",
      change: "+23.1%"
    },
    {
      title: "Global Reach",
      value: `${metrics.globalReach} Countries`,
      icon: Globe,
      color: "text-cyan-600",
      change: "+2 new"
    },
    {
      title: "System Uptime",
      value: `${metrics.systemUptime}%`,
      icon: Zap,
      color: "text-green-600",
      change: "Excellent"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="text-xs">
                  {metric.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
