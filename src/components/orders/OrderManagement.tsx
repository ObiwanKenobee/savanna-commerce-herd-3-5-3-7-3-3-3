import { useState } from "react";
import { useOrders, Order, useCreateOrder } from "@/hooks/useSupabaseData";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  MessageSquare,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Building2,
} from "lucide-react";

interface OrderCardProps {
  order: Order;
  userRole: string;
}

const OrderCard = ({ order, userRole }: OrderCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Order #{order.order_number}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3" />
              {new Date(order.created_at).toLocaleDateString()}
            </div>
          </div>
          <Badge
            className={`${getStatusColor(order.status)} flex items-center gap-1`}
          >
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-3 w-3" />
              <span className="text-muted-foreground">
                {userRole === "supplier" ? "Buyer" : "Supplier"}:
              </span>
            </div>
            <div className="font-medium">
              {userRole === "supplier"
                ? order.buyer?.name
                : order.supplier?.name}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-3 w-3" />
              <span className="text-muted-foreground">Total Amount:</span>
            </div>
            <div className="font-bold text-lg">
              {order.currency} {order.total_amount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        {order.order_items && order.order_items.length > 0 && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              Order Items:
            </div>
            <div className="space-y-1">
              {order.order_items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>
                    {order.currency} {item.total_price.toLocaleString()}
                  </span>
                </div>
              ))}
              {order.order_items.length > 2 && (
                <div className="text-sm text-muted-foreground">
                  +{order.order_items.length - 2} more items
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Information */}
        {order.delivery_address && (
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              Delivery Address:
            </div>
            <div className="text-sm">
              {typeof order.delivery_address === "string"
                ? order.delivery_address
                : `${order.delivery_address.city}, ${order.delivery_address.country}`}
            </div>
          </div>
        )}

        {/* Expected Delivery */}
        {order.delivery_date && (
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Truck className="h-3 w-3" />
              Expected Delivery:
            </div>
            <div className="text-sm font-medium">
              {new Date(order.delivery_date).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <OrderDetailModal order={order} userRole={userRole} />
            </DialogContent>
          </Dialog>

          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Invoice
          </Button>

          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderDetailModal = ({
  order,
  userRole,
}: {
  order: Order;
  userRole: string;
}) => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-xl">
          Order #{order.order_number}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.order_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {item.product?.sku}
                        </div>
                        <div className="text-sm">
                          Quantity: {item.quantity} × {order.currency}{" "}
                          {item.unit_price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {order.currency} {item.total_price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              {order.delivery_address && (
                <div className="space-y-2">
                  <div className="font-medium">Delivery Address:</div>
                  <div className="text-sm text-muted-foreground">
                    {typeof order.delivery_address === "string" ? (
                      order.delivery_address
                    ) : (
                      <div>
                        {order.delivery_address.address}
                        <br />
                        {order.delivery_address.city},{" "}
                        {order.delivery_address.region}
                        <br />
                        {order.delivery_address.country}{" "}
                        {order.delivery_address.postalCode}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {order.delivery_date && (
                <div className="mt-4">
                  <div className="font-medium">Expected Delivery:</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.delivery_date).toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {order.currency} {order.total_amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{order.currency} 0</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{order.currency} 0</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>
                      {order.currency} {order.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {userRole === "supplier" ? "Buyer" : "Supplier"} Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">
                  {userRole === "supplier"
                    ? order.buyer?.name
                    : order.supplier?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Organization ID:{" "}
                  {userRole === "supplier" ? order.buyer_id : order.supplier_id}
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export const OrderManagement = () => {
  const { data: orders, isLoading } = useOrders();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("all");

  const userRole = profile?.role || "buyer";

  const filteredOrders =
    orders?.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      // Filter by user role
      const roleFilter =
        selectedTab === "all"
          ? true
          : selectedTab === "buying"
            ? order.buyer_id === profile?.organization?.id
            : selectedTab === "selling"
              ? order.supplier_id === profile?.organization?.id
              : true;

      return matchesSearch && matchesStatus && roleFilter;
    }) || [];

  const orderStats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "pending").length || 0,
    processing: orders?.filter((o) => o.status === "processing").length || 0,
    completed: orders?.filter((o) => o.status === "delivered").length || 0,
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-muted-foreground">
            Manage your orders and track their progress
          </p>
        </div>

        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{orderStats.total}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orderStats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Processing
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {orderStats.processing}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {orderStats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by number, buyer, or supplier..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Order Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="buying">My Purchases</TabsTrigger>
          <TabsTrigger value="selling">My Sales</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} userRole={userRole} />
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "You don't have any orders yet. Start by browsing our marketplace."}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
