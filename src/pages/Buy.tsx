import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoonPayBuyWidget } from "@moonpay/moonpay-react";
import { useNavigate } from "react-router-dom";

const Buy = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-xl font-bold">Buy Crypto</h1>
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
    </>
  );
};

export default Buy;
