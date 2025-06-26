import { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  Product,
} from "@/hooks/useSupabaseData";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Upload,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  sku: string;
  unit_price: number;
  bulk_price: number;
  minimum_order_quantity: number;
  stock_quantity: number;
  unit_of_measure: string;
  origin_country: string;
}

const ProductForm = ({
  onSuccess,
  product,
}: {
  onSuccess: () => void;
  product?: Product;
}) => {
  const { profile } = useAuth();
  const createProduct = useCreateProduct();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    sku: product?.sku || "",
    unit_price: product?.unit_price || 0,
    bulk_price: product?.bulk_price || 0,
    minimum_order_quantity: product?.minimum_order_quantity || 1,
    stock_quantity: product?.stock_quantity || 0,
    unit_of_measure: product?.unit_of_measure || "",
    origin_country:
      product?.origin_country || profile?.organization?.country || "",
  });

  const categories = [
    "Grains & Cereals",
    "Fruits",
    "Vegetables",
    "Dairy Products",
    "Livestock",
    "Seafood",
    "Spices & Herbs",
    "Processed Foods",
    "Beverages",
    "Others",
  ];

  const units = [
    "kg",
    "ton",
    "lbs",
    "bag",
    "box",
    "crate",
    "liter",
    "gallon",
    "piece",
    "dozen",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile?.organization?.id) {
      toast({
        title: "Error",
        description: "Organization information is required to create products.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        supplier_id: profile.organization.id,
        status: "active",
        certifications: [],
        images: [],
      };

      await createProduct.mutateAsync(productData);
      onSuccess();
    } catch (error) {
      console.error("Product creation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sku: e.target.value }))
            }
            placeholder="e.g., MAIZE-001"
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subcategory: e.target.value }))
            }
            placeholder="e.g., White Maize"
          />
        </div>

        <div>
          <Label htmlFor="unit_price">Unit Price (KSH) *</Label>
          <Input
            id="unit_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.unit_price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                unit_price: parseFloat(e.target.value) || 0,
              }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="bulk_price">Bulk Price (KSH)</Label>
          <Input
            id="bulk_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.bulk_price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                bulk_price: parseFloat(e.target.value) || 0,
              }))
            }
          />
        </div>

        <div>
          <Label htmlFor="stock_quantity">Stock Quantity *</Label>
          <Input
            id="stock_quantity"
            type="number"
            min="0"
            value={formData.stock_quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                stock_quantity: parseInt(e.target.value) || 0,
              }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="minimum_order_quantity">
            Minimum Order Quantity *
          </Label>
          <Input
            id="minimum_order_quantity"
            type="number"
            min="1"
            value={formData.minimum_order_quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                minimum_order_quantity: parseInt(e.target.value) || 1,
              }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="unit_of_measure">Unit of Measure *</Label>
          <Select
            value={formData.unit_of_measure}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, unit_of_measure: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="origin_country">Origin Country</Label>
          <Input
            id="origin_country"
            value={formData.origin_country}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                origin_country: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe your product quality, farming methods, certifications..."
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Creating..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
};

export const ProductManagement = () => {
  const { data: products, isLoading } = useProducts();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filter products by current user's organization
  const myProducts =
    products?.filter(
      (product) => product.supplier_id === profile?.organization?.id,
    ) || [];

  const filteredProducts = myProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(myProducts.map((p) => p.category))];

  const productStats = {
    total: myProducts.length,
    active: myProducts.filter((p) => p.status === "active").length,
    lowStock: myProducts.filter(
      (p) => p.stock_quantity < p.minimum_order_quantity * 2,
    ).length,
    outOfStock: myProducts.filter((p) => p.stock_quantity === 0).length,
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">
            Manage your product listings and inventory
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <p className="text-2xl font-bold">{productStats.total}</p>
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
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {productStats.active}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Low Stock
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {productStats.lowStock}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {productStats.outOfStock}
                </p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
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
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                      {product.stock_quantity === 0 && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                      {product.stock_quantity > 0 &&
                        product.stock_quantity <
                          product.minimum_order_quantity * 2 && (
                          <Badge
                            variant="outline"
                            className="border-amber-500 text-amber-600"
                          >
                            Low Stock
                          </Badge>
                        )}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-bold">
                    KSH {product.unit_price.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per {product.unit_of_measure}
                  </p>
                  <p className="text-sm">Stock: {product.stock_quantity}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  categoryFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "Start by adding your first product to the marketplace."}
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  {myProducts.length === 0
                    ? "Add Your First Product"
                    : "Clear Filters"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
