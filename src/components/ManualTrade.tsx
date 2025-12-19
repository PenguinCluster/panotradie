import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ManualTrade = () => {
  const [targetTokenMint, setTargetTokenMint] = useState("");
  const [tradingToken, setTradingToken] = useState("SOL");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [loading, setLoading] = useState(false);
  const [checkingSafety, setCheckingSafety] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState<{ safe: boolean; risk_score: number } | null>(null);
  const { toast } = useToast();

  const checkTokenSafety = () => {
    if (!targetTokenMint.trim()) return;
    setCheckingSafety(true);
    setSafetyStatus(null);
    
    // Simulate safety check - replace with your Python backend logic
    setTimeout(() => {
      setSafetyStatus({ safe: true, risk_score: 15 });
      setCheckingSafety(false);
    }, 1000);
  };

  const handleTrade = () => {
    if (!targetTokenMint.trim() || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid token address and amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate trade - replace with your Python backend logic
    setTimeout(() => {
      toast({
        title: "Trade executed successfully",
        description: `${action === 'buy' ? 'Bought' : 'Sold'} ${amount} ${tradingToken}`
      });
      setTargetTokenMint("");
      setAmount("");
      setSafetyStatus(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="backdrop-blur-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Manual Trade
        </CardTitle>
        <CardDescription>
          Execute trades manually with safety checks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target-token">Target Token Address</Label>
            <div className="flex gap-2">
              <Input
                id="target-token"
                placeholder="Token mint address"
                value={targetTokenMint}
                onChange={(e) => setTargetTokenMint(e.target.value)}
              />
              <Button 
                variant="outline" 
                onClick={checkTokenSafety}
                disabled={checkingSafety || !targetTokenMint.trim()}
              >
                {checkingSafety ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
              </Button>
            </div>
            {safetyStatus && (
              <Badge variant={safetyStatus.safe ? "default" : "destructive"}>
                {safetyStatus.safe ? "Safe" : "Risky"} - Risk Score: {safetyStatus.risk_score}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trading-token">Trading Token</Label>
            <Select value={tradingToken} onValueChange={setTradingToken}>
              <SelectTrigger id="trading-token">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOL">SOL</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Amount to trade"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={(v) => setAction(v as "buy" | "sell")}>
              <SelectTrigger id="action">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleTrade} 
          disabled={loading} 
          className="w-full"
          variant={action === "sell" ? "destructive" : "default"}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {action === "buy" ? "Buy Token" : "Sell Token"}
        </Button>
      </CardContent>
    </Card>
  );
};
