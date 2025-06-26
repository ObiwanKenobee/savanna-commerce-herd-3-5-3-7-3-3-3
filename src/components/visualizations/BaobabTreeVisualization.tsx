import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangle, Zap } from "lucide-react";
import {
  savannaCommandCenter,
  type BaobabTreeData,
} from "../../services/savannaCommandCenterService";

interface BaobabTreeVisualizationProps {
  isSwahili?: boolean;
}

export const BaobabTreeVisualization: React.FC<
  BaobabTreeVisualizationProps
> = ({ isSwahili = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [treeData, setTreeData] = useState<BaobabTreeData[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BaobabTreeData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTreeData();
  }, []);

  useEffect(() => {
    if (treeData.length > 0) {
      drawBaobabTree();
    }
  }, [treeData]);

  const loadTreeData = async () => {
    try {
      setLoading(true);
      const data = await savannaCommandCenter.getBaobabTreeData();
      setTreeData(data);
    } catch (error) {
      console.error("Failed to load baobab tree data:", error);
    } finally {
      setLoading(false);
    }
  };

  const drawBaobabTree = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background (savanna sky)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#FEF3C7"); // Light yellow
    gradient.addColorStop(1, "#F59E0B"); // Amber
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw ground
    ctx.fillStyle = "#92400E"; // Brown
    ctx.fillRect(0, height - 50, width, 50);

    // Draw baobab trunk
    const trunkWidth = 60;
    const trunkHeight = 200;
    const trunkX = width / 2 - trunkWidth / 2;
    const trunkY = height - 50 - trunkHeight;

    // Trunk gradient
    const trunkGradient = ctx.createLinearGradient(
      trunkX,
      trunkY,
      trunkX + trunkWidth,
      trunkY,
    );
    trunkGradient.addColorStop(0, "#78350F");
    trunkGradient.addColorStop(0.5, "#A16207");
    trunkGradient.addColorStop(1, "#78350F");

    ctx.fillStyle = trunkGradient;
    ctx.fillRect(trunkX, trunkY, trunkWidth, trunkHeight);

    // Draw branches for each category
    const angleStep = (Math.PI * 2) / treeData.length;
    const centerX = width / 2;
    const centerY = trunkY;

    treeData.forEach((category, index) => {
      const angle = angleStep * index - Math.PI / 2; // Start from top
      const branchLength = 80 + category.stockLevel * 40;
      const branchEndX = centerX + Math.cos(angle) * branchLength;
      const branchEndY = centerY + Math.sin(angle) * branchLength;

      // Draw branch
      ctx.strokeStyle = "#78350F";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(branchEndX, branchEndY);
      ctx.stroke();

      // Draw leaves (representing stock density)
      const leafCount = Math.floor(category.stockLevel * 20) + 5;
      for (let i = 0; i < leafCount; i++) {
        const leafAngle = angle + (Math.random() - 0.5) * 0.8;
        const leafDistance =
          branchLength * 0.7 + Math.random() * branchLength * 0.3;
        const leafX = centerX + Math.cos(leafAngle) * leafDistance;
        const leafY = centerY + Math.sin(leafAngle) * leafDistance;

        // Leaf color based on stock level
        const greenIntensity = Math.floor(category.stockLevel * 255);
        ctx.fillStyle = `rgb(34, ${Math.max(100, greenIntensity)}, 34)`;

        ctx.beginPath();
        ctx.arc(leafX, leafY, 3 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw fruit drops for urgent replenishment
      if (category.urgentReplenishment) {
        for (let i = 0; i < 3; i++) {
          const fruitX = branchEndX + (Math.random() - 0.5) * 20;
          const fruitY = branchEndY + 20 + i * 15;

          // Falling fruit animation
          ctx.fillStyle = "#DC2626"; // Red for urgency
          ctx.beginPath();
          ctx.arc(fruitX, fruitY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Add glow effect
          ctx.shadowColor = "#DC2626";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(fruitX, fruitY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw category labels
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      const labelX = centerX + Math.cos(angle) * (branchLength + 30);
      const labelY = centerY + Math.sin(angle) * (branchLength + 30);
      ctx.fillText(category.category, labelX, labelY);

      // Draw stock level indicator
      ctx.font = "10px Arial";
      ctx.fillStyle =
        category.stockLevel > 0.7
          ? "#16A34A"
          : category.stockLevel > 0.3
            ? "#F59E0B"
            : "#DC2626";
      ctx.fillText(
        `${Math.round(category.stockLevel * 100)}%`,
        labelX,
        labelY + 15,
      );
    });

    // Draw tree crown (overall health indicator)
    const avgStockLevel =
      treeData.reduce((sum, cat) => sum + cat.stockLevel, 0) / treeData.length;
    const crownRadius = 15 + avgStockLevel * 10;

    ctx.fillStyle =
      avgStockLevel > 0.7
        ? "#16A34A"
        : avgStockLevel > 0.3
          ? "#F59E0B"
          : "#DC2626";
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, crownRadius, 0, Math.PI * 2);
    ctx.fill();

    // Add sparkle effect for healthy tree
    if (avgStockLevel > 0.8) {
      for (let i = 0; i < 5; i++) {
        const sparkleX = centerX + (Math.random() - 0.5) * 100;
        const sparkleY = centerY - 50 + (Math.random() - 0.5) * 100;

        ctx.fillStyle = "#FBBF24";
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Simple hit detection for branches
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight - 250;
    const clickDistance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
    );

    if (clickDistance > 50 && clickDistance < 150) {
      const angle = Math.atan2(y - centerY, x - centerX);
      const normalizedAngle = (angle + Math.PI * 2.5) % (Math.PI * 2);
      const categoryIndex = Math.floor(
        (normalizedAngle / (Math.PI * 2)) * treeData.length,
      );

      if (categoryIndex >= 0 && categoryIndex < treeData.length) {
        setSelectedBranch(treeData[categoryIndex]);
      }
    }
  };

  const getStockLevelColor = (level: number) => {
    if (level > 0.7) return "text-green-600";
    if (level > 0.3) return "text-yellow-600";
    return "text-red-600";
  };

  const getStockLevelText = (level: number) => {
    if (level > 0.7) return isSwahili ? "Mazuri" : "Good";
    if (level > 0.3) return isSwahili ? "Wastani" : "Medium";
    return isSwahili ? "Chini" : "Low";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-2">
              <div className="text-4xl animate-bounce">🌳</div>
              <p>
                {isSwahili
                  ? "Inapakia Mti wa Baobab..."
                  : "Loading Baobab Tree..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🌳</span>
            <span>
              {isSwahili
                ? "Mti wa Baobab wa Bidhaa"
                : "Product Category Baobab Tree"}
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isSwahili
              ? "Matawi yanawakilisha makundi ya bidhaa, majani ni kiwango cha hesabu, na matunda yanayoanguka ni mahitaji ya haraka"
              : "Branches represent product categories, leaf density shows stock levels, falling fruit indicates urgent replenishment needs"}
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-80 border rounded-lg cursor-pointer"
              onClick={handleCanvasClick}
            />

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-md">
              <h4 className="font-medium text-sm mb-2">
                {isSwahili ? "Ufafanuzi" : "Legend"}
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>
                    {isSwahili ? "Hesabu Mazuri (70%+)" : "Good Stock (70%+)"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>
                    {isSwahili
                      ? "Hesabu Wastani (30-70%)"
                      : "Medium Stock (30-70%)"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>
                    {isSwahili ? "Hesabu Chini (<30%)" : "Low Stock (<30%)"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span>
                    {isSwahili ? "Mahitaji ya Haraka" : "Urgent Replenishment"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treeData.map((category, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedBranch?.category === category.category
                ? "ring-2 ring-orange-500"
                : ""
            }`}
            onClick={() => setSelectedBranch(category)}
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{category.category}</h3>
                <Badge
                  variant={
                    category.stockLevel > 0.7
                      ? "default"
                      : category.stockLevel > 0.3
                        ? "secondary"
                        : "destructive"
                  }
                  className={getStockLevelColor(category.stockLevel)}
                >
                  {Math.round(category.stockLevel * 100)}%
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{isSwahili ? "Hali" : "Status"}:</span>
                  <span className={getStockLevelColor(category.stockLevel)}>
                    {getStockLevelText(category.stockLevel)}
                  </span>
                </div>

                {category.urgentReplenishment && (
                  <Alert className="py-2">
                    <AlertTriangle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      {isSwahili
                        ? "Inahitaji kuongezwa haraka"
                        : "Urgent replenishment needed"}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-muted-foreground">
                  {category.subCategories.length}{" "}
                  {isSwahili ? "makundi madogo" : "subcategories"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Branch Details */}
      {selectedBranch && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">🌿</span>
              <span>
                {selectedBranch.category} {isSwahili ? "Maelezo" : "Details"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">
                  {isSwahili ? "Hali ya Jumla" : "Overall Status"}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {isSwahili ? "Kiwango cha Hesabu" : "Stock Level"}:
                    </span>
                    <span
                      className={getStockLevelColor(selectedBranch.stockLevel)}
                    >
                      {Math.round(selectedBranch.stockLevel * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {isSwahili
                        ? "Mahitaji ya Haraka"
                        : "Urgent Replenishment"}
                      :
                    </span>
                    <span
                      className={
                        selectedBranch.urgentReplenishment
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {selectedBranch.urgentReplenishment
                        ? isSwahili
                          ? "Ndio"
                          : "Yes"
                        : isSwahili
                          ? "Hapana"
                          : "No"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  {isSwahili ? "Makundi Madogo" : "Subcategories"}
                </h4>
                <div className="space-y-2">
                  {selectedBranch.subCategories.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>{sub.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            sub.priority === "high"
                              ? "destructive"
                              : sub.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {sub.priority}
                        </Badge>
                        <span className={getStockLevelColor(sub.stockLevel)}>
                          {Math.round(sub.stockLevel * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {selectedBranch.urgentReplenishment && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <Zap className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {isSwahili
                    ? "Kundi hili linahitaji uongezaji wa haraka wa bidhaa. Wasiliana na wauzaji wa haraka."
                    : "This category requires immediate stock replenishment. Contact suppliers urgently."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BaobabTreeVisualization;
