import { useAuth } from "@/context/AuthContext";
import { ArrowDown, DollarSign, LogOut, Plus, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [balance] = useState(1250.75);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 space-y-6">
      {/* Header with user info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={`https://avatar.vercel.sh/${user?.username}`} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.username?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Welcome</p>
            <h2 className="text-xl font-bold">{user?.username}</h2>
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

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
        >
          <Send className="h-6 w-6" />
          <span className="text-sm font-medium">Send</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-24"
        >
          <ArrowDown className="h-6 w-6" />
          <span className="text-sm font-medium">Receive</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center gap-2 p-4 h-24"
          onClick={() => navigate('/buy')}
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
    </div>
  );
};

export default Dashboard;
