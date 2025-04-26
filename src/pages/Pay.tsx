import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { formatAddress } from "@/lib/utils";
import { createSignableMessage } from '@solana/signers';
import { getUtf8Encoder, verifySignature, getBase58Decoder } from "gill";

type MethodData = {
  data: {
    type: string,
    message: string
  }
}

type PaymentData = {
  origin: string,
  total: {
    currency: string,
    value: number
  },
  methodData: [MethodData],
  paymentRequestId: string,
}

const Pay = () => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  async function sign(message: string) {
    if (!user) {
      throw new Error("User is not authenticated")
    }

    const uint8ArrayMessage = getUtf8Encoder().encode(message);
    const signableMessage = createSignableMessage(new Uint8Array(uint8ArrayMessage));
    const signatures = await user.keyPairSigner.signMessages([signableMessage]);
    const signature = signatures[0][user.keyPairSigner.address];

    const verify = await verifySignature(user.keyPairSigner.keyPair.publicKey, signature, uint8ArrayMessage)
    console.log(321, verify)
    const paymentAppResponse = {
      methodName: "WalletSign",
      details: {
        signature: getBase58Decoder().decode(signature),
        message: message,
        publicKey: user.keyPairSigner.address
      },
    };

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(paymentAppResponse);
    }
    window.close();
  }

  function pay() {
    if (!user) {
      throw new Error("User is not authenticated")
    }
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
      setPaymentData(e.data)
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
    return (<p>No payment data</p>)
  }

  const type = paymentData.methodData[0].data?.type;
  let form;
  if (type === "sign") {
    const message = paymentData.methodData[0].data.message
    form = 
    <div>
      <p>The website {paymentData.origin} requested sign of</p>
      <code>{message}</code><br></br>
      <Button onClick={() => sign(message)}>Sign</Button>
    </div>
  } else if (type === "payment") { // TODO: not tested for now
    form = 
    <div>
      <p>The website {paymentData.origin} requested payment of</p>
      <p>amount {paymentData.total.value} {paymentData.total.currency}</p>
      <pre>{paymentData.total.value}</pre>
      <code>Data: {type}</code><br></br>
      <Button onClick={pay}>Pay</Button>
    </div>
  } else {
    form = 
    <div>
      <p>Unsupported type {type}</p>
    </div>
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 space-y-6">
      {/* Header with user info */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarImage src={`https://avatar.vercel.sh/${user.address}`} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.keyPairSigner.address?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Welcome</p>
            <h2 className="text-xl font-bold">{formatAddress(user.keyPairSigner.address)}</h2>
          </div>
        </div>
      </div>
      {form}
    </div>
  );
};

export default Pay;
