import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ActivePositions = () => {
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const refreshPrices = () => {
    setRefreshing(true);
    setTimeout(() => {
      toast({
        title: "Prices Updated",
        description: "Position prices have been refreshed",
      });
      setRefreshing(false);
    }, 500);
  };

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
        <div className="text-center py-8 text-muted-foreground">
          No active positions
        </div>
        {/* Position data will be populated by your Python backend */}
      </CardContent>
    </Card>
  );
};
