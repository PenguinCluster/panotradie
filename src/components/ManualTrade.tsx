import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp } from "lucide-react";

export const ManualTrade = () => {
  const [targetTokenMint, setTargetTokenMint] = useState("");
  const [tradingToken, setTradingToken] = useState("SOL");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTrade = async () => {
    if (!targetTokenMint.trim() || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid token address and amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate trade execution
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Trade request submitted",
      description: `${action === 'buy' ? 'Buy' : 'Sell'} order for ${amount} ${tradingToken} submitted`
    });

    setTargetTokenMint("");
    setAmount("");
    setLoading(false);
  };

  return (
    <Card className="backdrop-blur-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Manual Trade
        </CardTitle>
        <CardDescription>
          Execute a manual trade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetToken">Target Token Address</Label>
            <Input
              id="targetToken"
              placeholder="Enter token mint address"
              value={targetTokenMint}
              onChange={(e) => setTargetTokenMint(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trading Token</Label>
              <Select value={tradingToken} onValueChange={setTradingToken}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={action} onValueChange={(v) => setAction(v as "buy" | "sell")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button
            onClick={handleTrade}
            className="w-full"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Execute Trade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
