import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Shield,
  Clock,
  DollarSign,
  Users,
  Link,
  Activity,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { NEO_SAVANNAH_THEME } from "@/theme/neo-savannah-theme";

interface Transaction {
  id: string;
  type: "purchase" | "escrow" | "release" | "dispute";
  from: string;
  to: string;
  amount: number;
  currency: "KES" | "MBOGA";
  status: "pending" | "confirmed" | "failed";
  timestamp: Date;
  blockHeight?: number;
  gasUsed?: number;
  smartContract: string;
}

interface SmartContract {
  id: string;
  name: string;
  type: "escrow" | "marketplace" | "reputation" | "dispute";
  address: string;
  status: "active" | "paused" | "upgrading";
  totalTransactions: number;
  totalValue: number;
  successRate: number;
  lastActivity: Date;
}

interface BlockchainVisualizerProps {
  className?: string;
  showLiveData?: boolean;
}

const BlockchainVisualizer: React.FC<BlockchainVisualizerProps> = ({
  className = "",
  showLiveData = true,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [networkStats, setNetworkStats] = useState({
    blockHeight: 2847329,
    tps: 47,
    networkHash: "0xa4f...92c",
    gasPrice: 12,
    activeNodes: 156,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize mock data
    const mockContracts: SmartContract[] = [
      {
        id: "1",
        name: "Escrow Guardian",
        type: "escrow",
        address: "0x742d35Cc6634C0532925a3b8D0c4432AF745289E",
        status: "active",
        totalTransactions: 5847,
        totalValue: 12450000,
        successRate: 99.7,
        lastActivity: new Date(),
      },
      {
        id: "2",
        name: "Marketplace Core",
        type: "marketplace",
        address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
        status: "active",
        totalTransactions: 23891,
        totalValue: 56780000,
        successRate: 99.9,
        lastActivity: new Date(),
      },
      {
        id: "3",
        name: "Reputation Engine",
        type: "reputation",
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        status: "active",
        totalTransactions: 8934,
        totalValue: 0,
        successRate: 100,
        lastActivity: new Date(),
      },
      {
        id: "4",
        name: "Dispute Resolver",
        type: "dispute",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        status: "paused",
        totalTransactions: 234,
        totalValue: 890000,
        successRate: 95.8,
        lastActivity: new Date(Date.now() - 3600000),
      },
    ];

    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "purchase",
        from: "0x742d...289E",
        to: "0x89d2...0359",
        amount: 1200,
        currency: "KES",
        status: "confirmed",
        timestamp: new Date(Date.now() - 30000),
        blockHeight: 2847329,
        gasUsed: 21000,
        smartContract: "Marketplace Core",
      },
      {
        id: "2",
        type: "escrow",
        from: "0x1f98...F984",
        to: "0x6B17...1d0F",
        amount: 250,
        currency: "MBOGA",
        status: "pending",
        timestamp: new Date(Date.now() - 15000),
        gasUsed: 45000,
        smartContract: "Escrow Guardian",
      },
      {
        id: "3",
        type: "release",
        from: "0x89d2...0359",
        to: "0x742d...289E",
        amount: 800,
        currency: "KES",
        status: "confirmed",
        timestamp: new Date(Date.now() - 60000),
        blockHeight: 2847328,
        gasUsed: 31000,
        smartContract: "Escrow Guardian",
      },
    ];

    setContracts(mockContracts);
    setTransactions(mockTransactions);

    // Simulate live data updates
    if (showLiveData) {
      const interval = setInterval(() => {
        // Update network stats
        setNetworkStats((prev) => ({
          ...prev,
          blockHeight: prev.blockHeight + Math.floor(Math.random() * 3),
          tps: prev.tps + Math.floor(Math.random() * 10) - 5,
          gasPrice: prev.gasPrice + Math.floor(Math.random() * 5) - 2,
        }));

        // Add new transaction occasionally
        if (Math.random() > 0.7) {
          const newTx: Transaction = {
            id: Date.now().toString(),
            type: ["purchase", "escrow", "release"][
              Math.floor(Math.random() * 3)
            ] as any,
            from: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
            to: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
            amount: Math.floor(Math.random() * 5000) + 100,
            currency: Math.random() > 0.5 ? "KES" : "MBOGA",
            status: "pending",
            timestamp: new Date(),
            smartContract:
              mockContracts[Math.floor(Math.random() * mockContracts.length)]
                .name,
          };

          setTransactions((prev) => [newTx, ...prev.slice(0, 9)]);

          // Confirm transaction after delay
          setTimeout(
            () => {
              setTransactions((prev) =>
                prev.map((tx) =>
                  tx.id === newTx.id
                    ? {
                        ...tx,
                        status: Math.random() > 0.05 ? "confirmed" : "failed",
                        blockHeight: networkStats.blockHeight,
                      }
                    : tx,
                ),
              );
            },
            2000 + Math.random() * 3000,
          );
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [showLiveData, networkStats.blockHeight]);

  // Blockchain visualization canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      pulse: number;
      connections: number[];
    }> = [];

    // Create nodes for smart contracts
    contracts.forEach((contract, index) => {
      nodes.push({
        x: (canvas.width / (contracts.length + 1)) * (index + 1),
        y: canvas.height / 2 + (Math.random() - 0.5) * 100,
        radius: 15 + contract.totalTransactions / 1000,
        color: contract.status === "active" ? "#00FF9F" : "#FFB000",
        pulse: 0,
        connections: [],
      });
    });

    // Add random connections
    nodes.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodes.length);
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach((targetIndex) => {
          const target = nodes[targetIndex];
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(0, 255, 159, ${0.3 + Math.sin(node.pulse) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Data packets
            const progress = (node.pulse % 100) / 100;
            const packetX = node.x + (target.x - node.x) * progress;
            const packetY = node.y + (target.y - node.y) * progress;

            ctx.beginPath();
            ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#00D4FF";
            ctx.fill();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        node.pulse += 0.1;

        // Outer glow
        const glowSize = node.radius + Math.sin(node.pulse) * 5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}20`;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Contract label
        ctx.fillStyle = node.color;
        ctx.font = "12px JetBrains Mono";
        ctx.textAlign = "center";
        ctx.fillText(
          contracts[i]?.name || "",
          node.x,
          node.y + node.radius + 20,
        );
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [contracts]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-holographic-green" />;
      case "pending":
        return <Loader2 className="h-4 w-4 text-electric-amber animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-hot-pink" />;
      default:
        return <Clock className="h-4 w-4 text-glowing-blue" />;
    }
  };

  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case "escrow":
        return <Shield className="h-5 w-5" />;
      case "marketplace":
        return <DollarSign className="h-5 w-5" />;
      case "reputation":
        return <Users className="h-5 w-5" />;
      case "dispute":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Network Status */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="cyber-heading flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Neo-Savannah Blockchain Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="cyber-heading text-2xl">
                {networkStats.blockHeight.toLocaleString()}
              </div>
              <div className="digital-text text-sm">Block Height</div>
            </div>
            <div className="text-center">
              <div className="cyber-heading text-2xl">{networkStats.tps}</div>
              <div className="digital-text text-sm">TPS</div>
            </div>
            <div className="text-center">
              <div className="cyber-heading text-2xl">
                {networkStats.gasPrice}
              </div>
              <div className="digital-text text-sm">Gas Price</div>
            </div>
            <div className="text-center">
              <div className="cyber-heading text-2xl">
                {networkStats.activeNodes}
              </div>
              <div className="digital-text text-sm">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="cyber-heading text-2xl">99.9%</div>
              <div className="digital-text text-sm">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Visualization */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="cyber-heading">
            Smart Contract Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            className="w-full h-64 bg-cyber-black/30 rounded-lg border border-holographic-green/20"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Contracts */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="cyber-heading flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Smart Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div key={contract.id} className="hologram p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-holographic-green">
                        {getContractTypeIcon(contract.type)}
                      </div>
                      <div>
                        <div className="cyber-heading text-sm">
                          {contract.name}
                        </div>
                        <div className="digital-text text-xs opacity-70">
                          {contract.address.slice(0, 10)}...
                          {contract.address.slice(-6)}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`
                      ${
                        contract.status === "active"
                          ? "bg-holographic-green/20 text-holographic-green border-holographic-green"
                          : "bg-electric-amber/20 text-electric-amber border-electric-amber"
                      }
                    `}
                    >
                      {contract.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="digital-text opacity-70">
                        Transactions
                      </div>
                      <div className="cyber-heading">
                        {contract.totalTransactions.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="digital-text opacity-70">Value (KES)</div>
                      <div className="cyber-heading">
                        {(contract.totalValue / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div>
                      <div className="digital-text opacity-70">
                        Success Rate
                      </div>
                      <div className="cyber-heading">
                        {contract.successRate}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="cyber-heading flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="hologram p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <Badge
                        variant="outline"
                        className="text-xs border-glowing-blue/30 text-glowing-blue"
                      >
                        {tx.type}
                      </Badge>
                    </div>
                    <div className="digital-text text-xs">
                      {tx.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="digital-text text-sm">
                      {tx.from.slice(0, 8)}...{tx.from.slice(-4)} →{" "}
                      {tx.to.slice(0, 8)}...{tx.to.slice(-4)}
                    </div>
                    <div className="cyber-heading text-sm">
                      {tx.amount} {tx.currency}
                    </div>
                  </div>

                  <div className="mt-2 text-xs digital-text opacity-70">
                    Contract: {tx.smartContract}
                    {tx.blockHeight && ` | Block: ${tx.blockHeight}`}
                    {tx.gasUsed && ` | Gas: ${tx.gasUsed}`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mboga Coin Stats */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="cyber-heading flex items-center gap-2">
            {NEO_SAVANNAH_THEME.currency.mbogaCoin.symbol}
            Mboga Coin Economy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="cyber-heading text-3xl">2.84M</div>
              <div className="digital-text text-sm">Total Supply</div>
              <div className="text-xs text-holographic-green/60 mt-1">
                +1.2% this week
              </div>
            </div>
            <div className="text-center">
              <div className="cyber-heading text-3xl">1 = 100</div>
              <div className="digital-text text-sm">MBOGA : KES</div>
              <div className="text-xs text-electric-amber/60 mt-1">
                Stable rate
              </div>
            </div>
            <div className="text-center">
              <div className="cyber-heading text-3xl">15.7K</div>
              <div className="digital-text text-sm">Holders</div>
              <div className="text-xs text-glowing-blue/60 mt-1">+34 today</div>
            </div>
            <div className="text-center">
              <div className="cyber-heading text-3xl">98.9%</div>
              <div className="digital-text text-sm">TX Success</div>
              <div className="text-xs text-digital-purple/60 mt-1">
                Last 24h
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainVisualizer;
