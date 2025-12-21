import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Power, PowerOff } from "lucide-react";

interface BotStatusProps {
  isConfigured: boolean;
}

const BotStatus = ({ isConfigured }: BotStatusProps) => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    if (!isActive) {
      startBot();
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
    setLoading(true);
    try {
      const response = await fetch("https://predietary-jules-unsubtly.ngrok-free.dev/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to start bot");
      }

      setIsActive(true);
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
  );
};

export default BotStatus;
