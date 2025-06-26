import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import { ProductManagement } from "@/components/products/ProductManagement";
import { useAuth } from "@/hooks/useAuth";

const ProductsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen">
        <EnterpriseNavigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to manage your products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <EnterpriseNavigation />

      <div className="container mx-auto px-4 py-8">
        <ProductManagement />
      </div>
    </div>
  );
};

export default ProductsPage;
