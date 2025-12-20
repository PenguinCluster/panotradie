import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Power, PowerOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BotStatusProps {
  isConfigured: boolean;
}

const BotStatus = ({ isConfigured }: BotStatusProps) => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrivateKeyDialog, setShowPrivateKeyDialog] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const { toast } = useToast();

  const handleToggle = () => {
    if (!isActive) {
      setShowPrivateKeyDialog(true);
    } else {
      stopBot();
    }
  };

  const stopBot = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://predietary-jules-unsubtly.ngrok-free.dev/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to stop bot");
      }

      setIsActive(false);
      toast({
        title: "Bot Stopped",
        description: "Your trading bot has been stopped"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to stop bot",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startBot = async () => {
    if (!privateKey || privateKey.length < 32) {
      toast({
        title: "Invalid Private Key",
        description: "Please enter a valid Solana private key",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://predietary-jules-unsubtly.ngrok-free.dev/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ privateKey }),
      });

      if (!response.ok) {
        throw new Error("Failed to start bot");
      }

      setIsActive(true);
      setShowPrivateKeyDialog(false);
      setPrivateKey("");
      toast({
        title: "Bot Started",
        description: "Your trading bot is now active"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start bot",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="backdrop-blur-glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Bot Control</span>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Start or stop your trading bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isActive ? "bg-green-500/20 shadow-glow" : "bg-gray-500/20"
              } transition-all duration-300`}>
                {isActive ? (
                  <Power className="h-12 w-12 text-green-500" />
                ) : (
                  <PowerOff className="h-12 w-12 text-gray-500" />
                )}
              </div>
            </div>
            <Button 
              onClick={handleToggle}
              className="w-full"
              disabled={loading || (!isActive && !isConfigured)}
              variant={isActive ? "destructive" : "default"}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isActive ? "Stop Bot" : "Start Bot"}
            </Button>
            {!isConfigured && !isActive && (
              <p className="text-xs text-muted-foreground text-center">
                Save your wallet configuration first to enable the bot
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPrivateKeyDialog} onOpenChange={setShowPrivateKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Private Key</DialogTitle>
            <DialogDescription>
              Your private key is required to start the trading bot. It will be used securely by the backend service and never stored in the database.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="privateKey">Solana Private Key</Label>
              <Input
                id="privateKey"
                type="password"
                placeholder="Enter your wallet private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Your private key is transmitted securely and only held in memory by the trading service.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowPrivateKeyDialog(false);
                  setPrivateKey("");
                }}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={startBot}
                className="flex-1"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Start Bot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BotStatus;
