import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Position {
  id: string;
  token_address: string;
  token_symbol: string;
  entry_price: number;
  current_price: number;
  amount: number;
  usdc_invested: number;
  current_value: number;
  profit_loss_percentage: number;
  opened_at: string;
  last_updated: string;
}

// Mock data for UI preview
const mockPositions: Position[] = [
  {
    id: "1",
    token_address: "So11111111111111111111111111111111111111112",
    token_symbol: "SOL",
    entry_price: 150.25,
    current_price: 165.80,
    amount: 10,
    usdc_invested: 1502.50,
    current_value: 1658.00,
    profit_loss_percentage: 10.35,
    opened_at: new Date(Date.now() - 86400000).toISOString(),
    last_updated: new Date().toISOString(),
  },
  {
    id: "2",
    token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    token_symbol: "BONK",
    entry_price: 0.000025,
    current_price: 0.000022,
    amount: 50000000,
    usdc_invested: 1250,
    current_value: 1100,
    profit_loss_percentage: -12.00,
    opened_at: new Date(Date.now() - 172800000).toISOString(),
    last_updated: new Date().toISOString(),
  },
];

export const ActivePositions = () => {
  const { toast } = useToast();
  const [positions] = useState<Position[]>(mockPositions);
  const [refreshing, setRefreshing] = useState(false);

  const refreshPrices = () => {
    setRefreshing(true);
    // Simulate refresh - replace with your Python backend logic
    setTimeout(() => {
      toast({
        title: "Prices Updated",
        description: `Updated ${positions.length} positions`,
      });
      setRefreshing(false);
    }, 1000);
  };

  const getProfitColor = (percentage: number) => {
    if (percentage > 0) return "text-green-600";
    if (percentage < 0) return "text-red-600";
    return "text-gray-600";
  };

  const totalInvested = positions.reduce((sum, p) => sum + p.usdc_invested, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.current_value, 0);
  const totalProfitLoss = totalValue - totalInvested;
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Active Positions</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshPrices}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Monitor your current trading positions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active positions
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-lg font-bold">${totalInvested.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-lg font-bold">${totalValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total P/L</p>
                <p className={`text-lg font-bold ${getProfitColor(totalProfitLossPercentage)}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)} ({totalProfitLossPercentage.toFixed(2)}%)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {positions.map((position) => (
                <div key={position.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{position.token_symbol || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {position.token_address.slice(0, 4)}...{position.token_address.slice(-4)}
                      </p>
                    </div>
                    <Badge variant={position.profit_loss_percentage >= 0 ? "default" : "destructive"}>
                      {position.profit_loss_percentage >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {position.profit_loss_percentage.toFixed(2)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Entry</p>
                      <p className="font-medium">${position.entry_price.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-medium">${position.current_price.toFixed(6)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium">{position.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p className="font-medium">${position.current_value.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    Opened: {new Date(position.opened_at).toLocaleString()} • 
                    Updated: {new Date(position.last_updated).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
