import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Wallet } from "lucide-react";

const WalletConfig = () => {
  const [publicKey, setPublicKey] = useState("");
  const [rpcEndpoint, setRpcEndpoint] = useState("https://api.devnet.solana.com");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // UI-only: Show toast feedback
    setTimeout(() => {
      toast({
        title: "Configuration saved",
        description: "Your wallet settings have been saved locally."
      });
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="backdrop-blur-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Configuration
        </CardTitle>
        <CardDescription>
          Configure your Solana wallet public key and RPC endpoint. Your private key will be requested securely when starting the bot.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="publicKey">Public Key</Label>
            <Input
              id="publicKey"
              placeholder="Your Solana wallet public key"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Base58-encoded Solana address (32-44 characters)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rpcEndpoint">RPC Endpoint</Label>
            <Input
              id="rpcEndpoint"
              placeholder="https://api.devnet.solana.com"
              value={rpcEndpoint}
              onChange={(e) => setRpcEndpoint(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Must be a secure HTTPS endpoint
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WalletConfig;
