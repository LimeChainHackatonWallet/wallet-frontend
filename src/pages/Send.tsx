import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { SendForm, SendFormValues } from "@/components/forms/send-form";
import { TransactionDialog } from "@/components/ui/transaction-dialog";

export default function Send() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionDialog, setTransactionDialog] = useState(false);
  const [initialAddress, setInitialAddress] = useState<string>("");

  // Extract the address from the URL parameters if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const addressParam = searchParams.get("address");

    if (addressParam) {
      setInitialAddress(addressParam);
    }
  }, [location]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Handle form submission
  const handleSubmit = (data: SendFormValues) => {
    setIsSubmitting(true);
    setTransactionDialog(true);
    console.log(data);

    // Mock transaction processing - would be replaced with actual transaction logic
    setTimeout(() => {
      setIsSubmitting(false);
      // In a real app, we would handle success/error here
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
