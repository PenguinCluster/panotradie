import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
const COMMON_TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
};
export const ManualTrade = () => {
  const [targetTokenMint, setTargetTokenMint] = useState("");
  const [tradingToken, setTradingToken] = useState("SOL");
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"buy" | "sell">("buy");
  const [loading, setLoading] = useState(false);
  const [checkingSafety, setCheckingSafety] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState<any>(null);
  const {
    toast
  } = useToast();
  const checkTokenSafety = async () => {
    if (!targetTokenMint.trim()) return;
    setCheckingSafety(true);
    setSafetyStatus(null);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) return;
      const {
        data,
        error
      } = await supabase.functions.invoke('check-token-safety', {
        body: {
          token_address: targetTokenMint.trim()
        }
      });
      if (error) throw error;
      if (data.success) {
        setSafetyStatus(data);
      }
    } catch (error: any) {
      console.error("Safety check error:", error);
    } finally {
      setCheckingSafety(false);
    }
  };
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
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get bot config to retrieve private key
      const privateKey = prompt("Enter your wallet private key to execute the trade:");
      if (!privateKey) {
        toast({
          title: "Trade cancelled",
          description: "Private key is required to execute trades"
        });
        setLoading(false);
        return;
      }
      const {
        data,
        error
      } = await supabase.functions.invoke('jupiter-swap', {
        body: {
          token_address: targetTokenMint.trim(),
          action,
          amount: parseFloat(amount),
          private_key: privateKey,
          input_token_mint: COMMON_TOKENS[tradingToken as keyof typeof COMMON_TOKENS]
        }
      });
      if (error) throw error;
      if (data.success) {
        toast({
          title: "Trade executed successfully",
          description: `${action === 'buy' ? 'Bought' : 'Sold'} ${amount} ${tradingToken} - TX: ${data.signature}`
        });

        // Log to trade history
        await supabase.from('trade_history').insert({
          user_id: user.id,
          token_address: targetTokenMint.trim(),
          action: action.toUpperCase(),
          amount: parseFloat(amount),
          price: data.price || 0,
          signature: data.signature,
          status: 'success'
        });

        // Reset form
        setTargetTokenMint("");
        setAmount("");
      } else {
        throw new Error(data.error || "Trade failed");
      }
    } catch (error: any) {
      console.error("Manual trade error:", error);
      toast({
        title: "Trade failed",
        description: error.message || "Failed to execute trade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <Card className="backdrop-blur-glass border-white/10">
      
      
    </Card>;
};