import { useAuth } from "@/context/AuthContext";
import { LogOut, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoonPayBuyWidget } from '@moonpay/moonpay-react';
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 space-y-6">
      {/* Header with user info */}
      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
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

      <MoonPayBuyWidget
        className="!m-0 !w-full"
        variant="embedded"
        baseCurrencyCode="usd"
        baseCurrencyAmount="100"
        // Note: usdt_sol is enabled in the dashboard but is not available in the widget ¯\_(ツ)_/¯
        defaultCurrencyCode="pyusd_sol"
        // TODO: add walletAddress="" when we add Solana key derivation
        visible
      />
    </div>
  );
};

export default Dashboard;
