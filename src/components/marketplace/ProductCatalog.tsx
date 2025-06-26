
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProducts, Product } from '@/hooks/useSupabaseData';
import { Search, Filter, Package, MapPin, Star, ShoppingCart } from 'lucide-react';

export const ProductCatalog = () => {
  const { data: products, isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(products?.map(p => p.category) || [])];

  if (isLoading) {
    return <div className="text-center py-8">Loading product catalog...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, suppliers, or categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </Button>
          {categories.slice(0, 3).map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product: Product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {product.supplier?.country}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Unit Price:</span>
                  <span className="font-semibold">KSH {product.unit_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Min. Order:</span>
                  <span className="text-sm">{product.minimum_order_quantity} {product.unit_of_measure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Supplier:</span>
                  <span className="text-sm font-medium">{product.supplier?.name}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Order Now
                </Button>
                <Button size="sm" variant="outline">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or browse all categories.</p>
        </div>
      )}
    </div>
  );
};
