import { ArrowDown, Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/lib/utils";
import { TOKEN_DECIMALS } from "@/services/solana/constants";

export type Transaction = {
  id: string;
  type: "sent" | "received";
  amount: number;
  address: string;
  date: string;
};

type TransactionHistoryProps = {
  transactions: Transaction[];
};

export const TransactionHistory = ({
  transactions,
}: TransactionHistoryProps) => {

  function formatAmount(amount: number) {
    const numberAmount = Number(amount) / (10 ** TOKEN_DECIMALS)
    const formatedAmount = Math.floor(numberAmount*100)/100
    return formatedAmount.toFixed(2)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      tx.type === "received"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    } dark:bg-opacity-20`}
                  >
                    {tx.type === "received" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {tx.type === "received" ? "Received" : "Sent"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.type === "received"
                        ? `From ${formatAddress(tx.address)}`
                        : `To ${formatAddress(tx.address)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      tx.type === "received" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "received" ? "+" : "-"}
                    ${formatAmount(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-2">No transactions yet</p>
            <p className="text-sm text-muted-foreground">
              Your transaction history will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
