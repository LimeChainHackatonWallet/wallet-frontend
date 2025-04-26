import { useAuth } from "@/context/AuthContext";
import { ArrowDown, Plus, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TransactionHistory,
} from "@/components/TransactionHistory";
import { ReceiveDialog } from "@/components/ReceiveDialog";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  getAccount
} from '@solana/spl-token';
import { SOLANA_DEVNET_URL, TOKEN_ADDRESS, TOKEN_DECIMALS } from "@/services/solana/constants";

const Dashboard = () => {
  const { user, transactions } = useAuth();
  const [balance, setBalance] = useState("0.00");
  const navigate = useNavigate();
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [balanceIntervalId, setBalanceIntervalId] = useState<NodeJS.Timeout|null>()

  useEffect(() => {
    const getBalance = async () => {
      console.log("getting balance")
      if (!user) {
        return
      }

      const walletAddress = new PublicKey(user.address);
      const tokenMint = new PublicKey(TOKEN_ADDRESS);
  
      const ata = await getAssociatedTokenAddress(tokenMint, walletAddress);

      try {
        const accountInfo = await getAccount(SOLANA_DEVNET_URL, ata);
        console.log('Token balance:', Number(accountInfo.amount));
        const amount = Number(accountInfo.amount) / (10 ** TOKEN_DECIMALS)
        const formatedAmount = Math.floor(amount*100)/100
        setBalance(formatedAmount.toString())
      } catch (err) {
        console.error('Token account might not exist or has no balance:', err);
      }
    }

    getBalance()
    const id = setInterval(getBalance, 10_000)
    setBalanceIntervalId(id)

    return () => {
      if (balanceIntervalId) {
        clearInterval(balanceIntervalId)
      }
    };
  }, []);

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
            <p className="text-3xl font-bold">{balance}</p>
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
