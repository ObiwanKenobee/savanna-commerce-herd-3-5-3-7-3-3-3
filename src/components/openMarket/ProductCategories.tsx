import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface ProductCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const ProductCategories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: ProductCategoriesProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Browse by Category
        </h2>
        <p className="text-gray-600">
          Discover authentic products organized like a traditional African
          market
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              selectedCategory === category.id
                ? "ring-2 ring-orange-500 bg-orange-50"
                : "hover:bg-orange-50"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-4 text-center space-y-2">
              <div className="text-3xl">{category.icon}</div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {category.name}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
