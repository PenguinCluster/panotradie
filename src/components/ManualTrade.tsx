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
  const [safetyStatus, setSafetyStatus] = useState<any>(null);
  const { toast } = useToast();

  const checkTokenSafety = () => {
    if (!targetTokenMint.trim()) return;

    setCheckingSafety(true);
    setSafetyStatus(null);
    
    // UI-only: Simulate safety check
    setTimeout(() => {
      setSafetyStatus({
        safety_status: 'unknown',
        rugpull_risk_score: 0
      });
      setCheckingSafety(false);
    }, 500);
  };

  const handleTrade = () => {
    if (!targetTokenMint.trim() || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid token address and amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // UI-only: Show feedback
    setTimeout(() => {
      toast({
        title: "Trade Ready",
        description: "Connect your Python backend to execute trades",
      });
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="backdrop-blur-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Manual Trade
        </CardTitle>
        <CardDescription>
          Execute manual buy/sell orders for any Solana token
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={(value: "buy" | "sell") => setAction(value)}>
              <SelectTrigger id="action">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-mint">Target Token Mint Address</Label>
          <div className="flex gap-2">
            <Input
              id="target-mint"
              placeholder="Enter token mint address"
              value={targetTokenMint}
              onChange={(e) => {
                setTargetTokenMint(e.target.value);
                setSafetyStatus(null);
              }}
              className="flex-1"
            />
            <Button
              type="button"
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
            <div className="flex items-center gap-2 text-sm">
              <Badge
                variant="outline"
                className={
                  safetyStatus.safety_status === 'safe'
                    ? 'border-green-500/50 text-green-400'
                    : safetyStatus.safety_status === 'warning'
                    ? 'border-yellow-500/50 text-yellow-400'
                    : 'border-muted text-muted-foreground'
                }
              >
                {safetyStatus.safety_status.toUpperCase()}
              </Badge>
              <span className="text-muted-foreground">
                Risk: {safetyStatus.rugpull_risk_score}/100
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount ({tradingToken})</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder={`Enter amount in ${tradingToken}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleTrade} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `${action === 'buy' ? 'Buy' : 'Sell'} Token`
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Note: Connect your Python backend to execute actual trades on the Solana network.
        </p>
      </CardContent>
    </Card>
  );
};
