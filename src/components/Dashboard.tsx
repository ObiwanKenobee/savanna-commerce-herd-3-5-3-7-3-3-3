
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Users, Star } from "lucide-react";

const Dashboard = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Your Digital
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Savanna Command Center</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a supplier ruling your territory or a retailer growing your pride, 
            our dashboard gives you the power to thrive.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Supplier Dashboard */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-primary/20 text-primary">Supplier View</Badge>
              <h3 className="text-3xl font-bold mb-4 flex items-center justify-center lg:justify-start">
                <span className="mr-3">🦁</span>
                Your Sales Pack Dashboard
              </h3>
              <p className="text-muted-foreground">Dominate your territory with pride-leading insights</p>
            </div>

            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Today's Performance</span>
                  <TrendingUp className="h-5 w-5 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">247</div>
                    <div className="text-sm text-muted-foreground">Orders Today</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">KSh 1.2M</div>
                    <div className="text-sm text-muted-foreground">Revenue</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Target</span>
                    <span className="font-medium">78% Complete</span>
                  </div>
                  <Progress value={78} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { store: "Kiambu General Store", items: "Rice, Sugar, Cooking Oil", status: "Charging like a rhino! 🦏" },
                    { store: "Nakuru Supermarket", items: "Maize Flour, Beans", status: "Delivered" },
                    { store: "Mombasa Retail Hub", items: "Dairy Products", status: "In Transit" }
                  ].map((order, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div>
                        <div className="font-medium">{order.store}</div>
                        <div className="text-sm text-muted-foreground">{order.items}</div>
                      </div>
                      <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Retailer Dashboard */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 bg-secondary/20 text-secondary">Retailer View</Badge>
              <h3 className="text-3xl font-bold mb-4 flex items-center justify-center lg:justify-start">
                <span className="mr-3">🌳</span>
                Your Growth Forest
              </h3>
              <p className="text-muted-foreground">Watch your inventory grow strong like a baobab tree</p>
            </div>

            <Card className="border-2 hover:border-secondary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Inventory Health</span>
                  <Package className="h-5 w-5 text-accent" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { category: "Grains & Cereals", level: 85, color: "bg-primary" },
                    { category: "Dairy Products", level: 45, color: "bg-accent" },
                    { category: "Cooking Essentials", level: 92, color: "bg-secondary" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">{item.level}% Stocked</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Pride Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <div className="text-2xl font-bold text-accent">Gold Lion Status</div>
                    <div className="text-sm text-muted-foreground">Next: Platinum Elephant (2,300 points needed)</div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={67} className="h-3" />
                    <div className="text-sm text-muted-foreground">6,700 / 10,000 points</div>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    View Rewards
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 rounded-full text-lg">
            Experience Your Dashboard
            <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
