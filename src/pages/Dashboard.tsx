import { useAuth } from "@/context/AuthContext";
import { ArrowDown, Plus, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import {
  TransactionHistory,
  Transaction,
} from "@/components/TransactionHistory";
import { ReceiveDialog } from "@/components/ReceiveDialog";

const Dashboard = () => {
  const { user } = useAuth();
  const [balance] = useState(1250.75);
  const navigate = useNavigate();
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "received",
      amount: 125.0,
      address: "G5RW...JHGS",
      date: "June 15, 2023",
    },
    {
      id: 2,
      type: "sent",
      amount: 50.0,
      address: "TNOO...XVMQ",
      date: "June 10, 2023",
    },
  ]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="text-primary-foreground p-6">
          <p className="text-primary-foreground/80 mb-1 text-sm">
            Available Balance
          </p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
            <span className="text-primary-foreground/80 ml-2 text-sm">USD</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-20"
          onClick={() => navigate("/send")}
          aria-label="Send money"
        >
          <Send className="h-5 w-5" />
          <span className="text-sm font-medium">Send</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-20"
          onClick={() => setReceiveDialogOpen(true)}
          aria-label="Receive money"
        >
          <ArrowDown className="h-5 w-5" />
          <span className="text-sm font-medium">Receive</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-20"
          onClick={() => navigate("/buy")}
          aria-label="Buy cryptocurrency"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Buy</span>
        </Button>
      </div>

      <TransactionHistory transactions={transactions} />

      <ReceiveDialog
        open={receiveDialogOpen}
        onOpenChange={setReceiveDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
