import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import bs58 from "bs58";
import {
  VersionedTransaction,
  PublicKey,
  TransactionMessage,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import {
  BACKEND_PAYER_ADDRESS,
  BACKEND_URL,
  SOLANA_DEVNET_URL,
  TOKEN_ADDRESS,
  TOKEN_DECIMALS,
} from "@/services/solana/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { formatAddress } from "@/lib/utils";

declare global {
  interface Window {
    paymentResponse: {
      methodName: string;
      details: {
        signature?: string;
        message?: string;
        publicKey?: string;
        txid?: string;
      };
    } | null;
  }
}

type SignMethodData = {
  data: {
    type: "sign";
    message: string;
  };
};

type PayMethodData = {
  data: {
    type: "payment";
    to: string;
    amount: number;
  };
};

type PaymentData = {
  origin: string;
  total: {
    currency: string;
    value: number;
  };
  methodData: [SignMethodData | PayMethodData];
  paymentRequestId: string;
};

enum TransactionStatus {
  IDLE,
  CONFIRMING,
  PROCESSING,
  SUCCESS,
  ERROR,
}

const Pay = () => {
  const { user, addTransaction } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.IDLE
  );
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sign(message: string) {
    try {
      setTransactionStatus(TransactionStatus.CONFIRMING);
      setTransactionDialogOpen(true);

      if (!user) {
        throw new Error("User is not authenticated");
      }

      setTransactionStatus(TransactionStatus.PROCESSING);

      const messageBytes = naclUtil.decodeUTF8(message);
      const signature = nacl.sign.detached(
        messageBytes,
        user.keyPairSigner.secretKey
      );

      const paymentAppResponse = {
        methodName: "WalletSign",
        details: {
          signature: bs58.encode(signature),
          message: message,
          publicKey: user.keyPairSigner.publicKey.toBase58(),
        },
      };

      setTransactionStatus(TransactionStatus.SUCCESS);
      window.paymentResponse = paymentAppResponse;
    } catch (err) {
      console.error("Signing error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setTransactionStatus(TransactionStatus.ERROR);
    }
  }

  async function pay(to: string, amount: number) {
    try {
      setTransactionStatus(TransactionStatus.CONFIRMING);
      setTransactionDialogOpen(true);

      if (!user) {
        throw new Error("User is not authenticated");
      }

      setTransactionStatus(TransactionStatus.PROCESSING);

      // TODO: use backend for getting the latestBlockHash?
      const blockhash = (await SOLANA_DEVNET_URL.getLatestBlockhash())
        .blockhash;

      // create array of instructions
      // TODO: add additional transfer for the backend
      const address = getAssociatedTokenAddressSync(
        new PublicKey(TOKEN_ADDRESS),
        new PublicKey(user.address)
      );
      const toAddress = getAssociatedTokenAddressSync(
        new PublicKey(TOKEN_ADDRESS),
        new PublicKey(to)
      );
      const instructions = [
        createTransferInstruction(
          new PublicKey(address),
          new PublicKey(toAddress),
          new PublicKey(user.address),
          amount * 10 ** TOKEN_DECIMALS
        ),
      ];

      // create v0 compatible message
      const messageV0 = new TransactionMessage({
        payerKey: new PublicKey(BACKEND_PAYER_ADDRESS),
        recentBlockhash: blockhash,
        instructions,
      }).compileToV0Message();

      // make a versioned transaction
      const transactionV0 = new VersionedTransaction(messageV0);

      transactionV0.sign([user.keyPairSigner]);

      const result = await fetch(`${BACKEND_URL}/api/sponsor-transaction`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: btoa(String.fromCharCode(...transactionV0.serialize())),
        }),
      });

      const { transactionHash } = await result.json();

      if (transactionHash) {
        addTransaction(transactionHash, amount * 10 ** TOKEN_DECIMALS, to);
        setTransactionStatus(TransactionStatus.SUCCESS);

        window.paymentResponse = {
          methodName: "WalletPayment",
          details: {
            txid: transactionHash,
          },
        };
      } else {
        throw new Error("No transaction hash returned");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setTransactionStatus(TransactionStatus.ERROR);
    }
  }

  function closeDialog() {
    if (transactionStatus === TransactionStatus.SUCCESS) {
      if (window.paymentResponse && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(window.paymentResponse);
      }
      window.close();
    } else if (
      transactionStatus === TransactionStatus.ERROR ||
      transactionStatus === TransactionStatus.CONFIRMING
    ) {
      setTransactionDialogOpen(false);
      setTransactionStatus(TransactionStatus.IDLE);
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && transactionStatus === TransactionStatus.SUCCESS) {
      if (window.paymentResponse && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(window.paymentResponse);
      }
      window.close();
    } else {
      setTransactionDialogOpen(open);
    }
  };

  useEffect(() => {
    navigator.serviceWorker.addEventListener("message", (e) => {
      setPaymentData(e.data);
    });

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(
        "payment_app_window_ready"
      );
    }
  }, []);

  if (!paymentData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">
          Loading payment request...
        </p>
      </div>
    );
  }

  const type = paymentData.methodData[0].data?.type;
  let form;

  if (type === "sign") {
    const message = paymentData.methodData[0].data.message;
    form = (
      <div className="space-y-4 border p-4 rounded-lg bg-card">
        <div className="pb-4 border-b">
          <h3 className="text-lg font-medium">Sign Request</h3>
          <p className="text-sm text-muted-foreground">
            From {paymentData.origin}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Message to sign:</p>
          <div className="bg-muted p-3 rounded text-xs overflow-auto max-h-32">
            <code>{message}</code>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => window.close()}>
            Cancel
          </Button>
          <Button onClick={() => sign(message)}>Sign Message</Button>
        </div>
      </div>
    );
  } else if (type === "payment") {
    const { to, amount } = paymentData.methodData[0].data;
    form = (
      <div className="space-y-4 border p-4 rounded-lg bg-card">
        <div className="pb-4 border-b">
          <h3 className="text-lg font-medium">Payment Request</h3>
          <p className="text-sm text-muted-foreground">
            From {paymentData.origin}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm">Amount:</span>
            <span className="font-medium">
              {amount} {paymentData.total.currency}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm">Recipient:</span>
            <span className="font-medium text-xs">{formatAddress(to)}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => window.close()}>
            Cancel
          </Button>
          <Button onClick={() => pay(to, amount)}>Confirm Payment</Button>
        </div>
      </div>
    );
  } else {
    form = (
      <div className="space-y-4 border p-4 rounded-lg bg-card">
        <h3 className="text-lg font-medium text-red-500">
          Unsupported Request
        </h3>
        <p>Unsupported request type: {type}</p>
        <Button variant="outline" onClick={() => window.close()}>
          Close
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">Authorizing...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 space-y-6">
      {form}

      <Dialog open={transactionDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className="sm:max-w-md border border-gray-700"
          style={{ backgroundColor: "#1f2937", color: "white" }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "white" }}>
              {transactionStatus === TransactionStatus.CONFIRMING &&
                "Confirm Transaction"}
              {transactionStatus === TransactionStatus.PROCESSING &&
                "Processing Transaction"}
              {transactionStatus === TransactionStatus.SUCCESS &&
                "Transaction Successful"}
              {transactionStatus === TransactionStatus.ERROR &&
                "Transaction Failed"}
            </DialogTitle>
            <DialogDescription style={{ color: "#9ca3af" }}>
              {transactionStatus === TransactionStatus.CONFIRMING &&
                "Please confirm to proceed with this transaction"}
              {transactionStatus === TransactionStatus.PROCESSING &&
                "Please wait while we process your transaction"}
              {transactionStatus === TransactionStatus.SUCCESS &&
                "Your transaction has been completed successfully"}
              {transactionStatus === TransactionStatus.ERROR &&
                "There was an error processing your transaction"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6">
            {transactionStatus === TransactionStatus.CONFIRMING && (
              <div className="space-y-4 text-center">
                <p style={{ color: "#9ca3af" }}>
                  You're about to{" "}
                  {type === "sign" ? "sign a message" : "make a payment"} for{" "}
                  {paymentData.origin}
                </p>
                <div className="flex justify-center space-x-2 pt-4">
                  <Button variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (type === "sign") {
                        sign(paymentData.methodData[0].data.message);
                      } else if (type === "payment") {
                        pay(
                          paymentData.methodData[0].data.to,
                          paymentData.methodData[0].data.amount
                        );
                      }
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}

            {transactionStatus === TransactionStatus.PROCESSING && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center" style={{ color: "#9ca3af" }}>
                  Your {type === "sign" ? "signature" : "payment"} is being
                  processed. This may take a few moments.
                </p>
              </>
            )}

            {transactionStatus === TransactionStatus.SUCCESS && (
              <>
                <div
                  className="rounded-full p-3 mb-4"
                  style={{ backgroundColor: "#064e3b" }}
                >
                  <CheckCircle2
                    className="h-8 w-8"
                    style={{ color: "#34d399" }}
                  />
                </div>
                <p
                  className="text-center font-medium mb-1"
                  style={{ color: "#34d399" }}
                >
                  {type === "sign" ? "Signature" : "Payment"} Successful
                </p>
                <p className="text-center mb-4" style={{ color: "#9ca3af" }}>
                  {type === "sign"
                    ? "Your message has been signed successfully."
                    : "Your payment has been sent successfully."}
                </p>
                <Button onClick={closeDialog}>Complete and Close</Button>
              </>
            )}

            {transactionStatus === TransactionStatus.ERROR && (
              <>
                <div
                  className="rounded-full p-3 mb-4"
                  style={{ backgroundColor: "#7f1d1d" }}
                >
                  <XCircle className="h-8 w-8" style={{ color: "#f87171" }} />
                </div>
                <p
                  className="text-center font-medium mb-1"
                  style={{ color: "#f87171" }}
                >
                  Transaction Failed
                </p>
                <p className="text-center mb-2" style={{ color: "#9ca3af" }}>
                  There was an error processing your{" "}
                  {type === "sign" ? "signature" : "payment"}.
                </p>
                {error && (
                  <p
                    className="text-center text-xs mb-4 max-w-xs"
                    style={{ color: "#f87171" }}
                  >
                    {error}
                  </p>
                )}
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pay;
