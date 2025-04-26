import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { SendForm, SendFormValues } from "@/components/forms/send-form";
import { TransactionDialog } from "@/components/ui/transaction-dialog";
import transferTokens from "@/services/solana/transfer_tokens";

const ADDRESS_STORAGE_KEY = "pendingRecipientAddress";

export default function Send() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, addTransaction } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionDialog, setTransactionDialog] = useState(false);
  const [initialAddress, setInitialAddress] = useState<string>("");

  useEffect(() => {
    const handleAddressParameter = () => {
      const searchParams = new URLSearchParams(location.search);
      const addressParam = searchParams.get("address");

      if (addressParam) {
        setInitialAddress(addressParam);
        sessionStorage.setItem(ADDRESS_STORAGE_KEY, addressParam);
        return;
      }

      if (isAuthenticated) {
        const storedAddress = sessionStorage.getItem(ADDRESS_STORAGE_KEY);

        if (storedAddress) {
          setInitialAddress(storedAddress);

          sessionStorage.removeItem(ADDRESS_STORAGE_KEY);
        }
      }
    };

    handleAddressParameter();
  }, [location, isAuthenticated]);

  if (!isAuthenticated) {
    const addressParam = new URLSearchParams(location.search).get("address");
    if (addressParam) {
      sessionStorage.setItem(ADDRESS_STORAGE_KEY, addressParam);
    }

    return <Navigate to={`/register?redirect=/send`} replace />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (data: SendFormValues) => {
    setIsSubmitting(true);
    setTransactionDialog(true);
    transferTokens(
      user,
      data.recipientAddress,
      Number(data.amount),
      addTransaction
    );

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  const handleCloseDialog = () => {
    setTransactionDialog(false);
    navigate("/");
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-xl font-bold">Send Crypto</h1>
      </div>

      <SendForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialAddress={initialAddress}
      />

      <TransactionDialog
        open={transactionDialog}
        onOpenChange={setTransactionDialog}
        isProcessing={isSubmitting}
        onClose={handleCloseDialog}
      />
    </>
  );
}
