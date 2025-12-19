import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

interface Trade {
  id: string;
  token_address: string;
  action: string;
  amount: number;
  price: number;
  status: string;
  created_at: string;
}

// Mock data for UI preview
const mockTrades: Trade[] = [
  {
    id: "1",
    token_address: "So11111111111111111111111111111111111111112",
    action: "buy",
    amount: 10,
    price: 150.25,
    status: "success",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2",
    token_address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    action: "buy",
    amount: 50000000,
    price: 0.000025,
    status: "success",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "3",
    token_address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    action: "sell",
    amount: 1000000,
    price: 0.00015,
    status: "success",
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
];

const TradeHistory = () => {
  const [trades] = useState<Trade[]>(mockTrades);

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      pending: "secondary",
      failed: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>{status}</Badge>;
  };

  return (
    <Card className="backdrop-blur-glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Trade History
        </CardTitle>
        <CardDescription>
          Recent trades executed by your bot
        </CardDescription>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No trades yet. Start your bot to begin trading.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <Badge variant={trade.action === "buy" ? "default" : "secondary"}>
                        {trade.action.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {trade.token_address.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{trade.amount}</TableCell>
                    <TableCell>${trade.price}</TableCell>
                    <TableCell>{getStatusBadge(trade.status)}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(trade.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeHistory;
