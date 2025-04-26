import { useAuth } from "@/context/AuthContext";
import { ArrowDown, DollarSign, Plus, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  const [balance] = useState(1250.75);
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Balance Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
          <p className="text-primary-foreground/80 mb-1 text-sm">
            Available Balance
          </p>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
            <span className="text-primary-foreground/80 ml-2 text-sm">USD</span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-24"
          onClick={() => navigate("/send")}
          aria-label="Send money"
        >
          <Send className="h-6 w-6" />
          <span className="text-sm font-medium">Send</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-24"
          onClick={() => navigate("/receive")}
          aria-label="Receive money"
        >
          <ArrowDown className="h-6 w-6" />
          <span className="text-sm font-medium">Receive</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-24"
          onClick={() => navigate("/buy")}
          aria-label="Buy cryptocurrency"
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">Buy</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Exchange Rate</span>
            </div>
            <span className="text-sm">1 ETH = $3,245.67 USD</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Dashboard;
