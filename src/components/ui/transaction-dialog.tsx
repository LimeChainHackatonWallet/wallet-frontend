import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isProcessing: boolean;
  onClose: () => void;
};

export function TransactionDialog({
  open,
  onOpenChange,
  isProcessing,
  onClose,
}: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md border border-gray-700"
        style={{ backgroundColor: "#1f2937", color: "white" }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "white" }}>
            Processing Transaction
          </DialogTitle>
          <DialogDescription style={{ color: "#9ca3af" }}>
            Please wait while we process your transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6">
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center" style={{ color: "#9ca3af" }}>
                Your transaction is being processed. This may take a few
                moments.
              </p>
            </>
          ) : (
            <>
              <div
                className="rounded-full p-3 mb-4"
                style={{ backgroundColor: "#064e3b" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  style={{ color: "#34d399" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p
                className="text-center font-medium mb-1"
                style={{ color: "#34d399" }}
              >
                Transaction Successful
              </p>
              <p className="text-center mb-4" style={{ color: "#9ca3af" }}>
                Your payment has been sent successfully.
              </p>
              <Button onClick={onClose}>Return to Dashboard</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
