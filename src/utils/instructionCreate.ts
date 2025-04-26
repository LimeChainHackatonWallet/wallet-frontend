import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

const BACKEND_URL = "http://localhost:3000"
const BACKEND_PAYER_ADDRESS = "2GesLoaCkAAfHF5iSgNDwgz9eSuRQv99gWknCqV5uk69"
const TOKEN_ADDRESS = "BZSyBGAzgER4LsQioSXvHxvPA9yPseNqnLX275LJQHKX"

export default async function pay(to: string, amount: number, user: any) {
  if (!user) {
    throw new Error("User is not authenticated");
  }

  // TODO: use backend for getting the latestBlockHash?
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const blockhash = (await connection.getLatestBlockhash()).blockhash;

  // create array of instructions
  // TODO: add additional transfer for the backend
  const address = getAssociatedTokenAddressSync(new PublicKey(TOKEN_ADDRESS), new PublicKey(user.address))
  const toAddress = getAssociatedTokenAddressSync(new PublicKey(TOKEN_ADDRESS), new PublicKey(to))
  const instructions = [
    createTransferInstruction(
      new PublicKey(address),
      new PublicKey(toAddress),
      new PublicKey(user.address),
      amount
    )
  ];
  
  // create v0 compatible message
  const messageV0 = new TransactionMessage({
    payerKey: new PublicKey(BACKEND_PAYER_ADDRESS),
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  
  // make a versioned transaction
  const transactionV0 = new VersionedTransaction(messageV0);

  transactionV0.sign([user.keyPairSigner])

  const result = await fetch(`${BACKEND_URL}/api/sponsor-transaction`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({transaction: btoa(String.fromCharCode(...transactionV0.serialize()))})
  })

  const { transactionHash } = await result.json();

  const paymentAppResponse = {
    methodName: "WalletPayment",
    details: {
      txid: transactionHash,
    },
  };

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(paymentAppResponse);
  }
  window.close();
}