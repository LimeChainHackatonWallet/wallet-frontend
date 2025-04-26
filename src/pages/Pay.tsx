import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import bs58 from "bs58";
import { VersionedTransaction, SystemProgram, PublicKey, Connection, TransactionMessage } from "@solana/web3.js";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

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
  methodData: [SignMethodData|PayMethodData];
  paymentRequestId: string;
};

const Pay = () => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  async function sign(message: string) {
    if (!user) {
      throw new Error("User is not authenticated");
    }

    const messageBytes = naclUtil.decodeUTF8(message);
    const signature = nacl.sign.detached(messageBytes, user.keyPairSigner.secretKey);

    const paymentAppResponse = {
      methodName: "WalletSign",
      details: {
        signature: bs58.encode(signature),
        message: message,
        publicKey: user.keyPairSigner.publicKey.toBase58(),
      },
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(paymentAppResponse);
    }
    window.close();
  }

  async function pay(to: string, amount: number) {
    if (!user) {
      throw new Error("User is not authenticated");
    }

    // TODO: use backend for getting the latestBlockHash?
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const blockhash = (await connection.getLatestBlockhash()).blockhash;

    // create array of instructions
    // TODO: replace with Token transfer
    // TODO: add additional transfer for the backend
    const instructions = [
      SystemProgram.transfer({
        fromPubkey: new PublicKey(user.keyPairSigner.publicKey.toBase58()),
        toPubkey: new PublicKey(bs58.decode(to)),
        lamports: amount,
      }),
    ];
    
    // create v0 compatible message
    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(user.keyPairSigner.publicKey.toBase58()),
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    
    // make a versioned transaction
    const transactionV0 = new VersionedTransaction(messageV0);
    // TODO: send to backend

    const paymentAppResponse = {
      methodName: "WalletPayment",
      details: {
        txid: "some_txid", // TODO: broadcast?
        message: "some message", // TODO: needed?
      },
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(paymentAppResponse);
    }
    window.close();
  }

  useEffect(() => {
    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener("message", (e) => {
      setPaymentData(e.data);
    });

    // Notify the service worker that the payment window has loaded
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(
        "payment_app_window_ready"
      );
    } else {
      console.log("controller not initialized");
    }

    return () => {
      console.log("Component unmounted");
    };
  }, []);

  if (!paymentData) {
    return <p>No payment data</p>;
  }

  const type = paymentData.methodData[0].data?.type;
  let form;
  if (type === "sign") {
    const message = paymentData.methodData[0].data.message;
    form = (
      <div>
        <p>The website {paymentData.origin} requested sign of</p>
        <code>{message}</code>
        <br></br>
        <Button onClick={() => sign(message)}>Sign</Button>
      </div>
    );
  } else if (type === "payment") {
    const {to, amount} = paymentData.methodData[0].data;
    form = (
      <div>
        <p>The website {paymentData.origin} requested payment of</p>
        <p>
          amount {paymentData.total.value} {paymentData.total.currency}
        </p>
        <pre>{paymentData.total.value}</pre>
        <code>Data: {type}</code><br></br>
        <code>To: {to}</code><br></br>
        <code>Amount: {amount}</code><br></br>
        <br></br>
        <Button onClick={() => pay(to, amount)}>Pay</Button>
      </div>
    );
  } else {
    form = (
      <div>
        <p>Unsupported type {type}</p>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 space-y-6">{form}</div>
  );
};

export default Pay;
