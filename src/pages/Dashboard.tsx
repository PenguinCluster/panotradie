import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import WalletConfig from "@/components/WalletConfig";
import TradeHistory from "@/components/TradeHistory";
import BotStatus from "@/components/BotStatus";
import { BotSettings } from "@/components/BotSettings";
import { ActivePositions } from "@/components/ActivePositions";
import { ManualTrade } from "@/components/ManualTrade";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative">
        <nav className="border-b border-white/10 backdrop-blur-glass">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Tradie Bot Dashboard
            </h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <WalletConfig />
            <BotStatus />
          </div>
          
          <BotSettings />
          
          <ManualTrade />
          
          <ActivePositions />
          
          <TradeHistory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
