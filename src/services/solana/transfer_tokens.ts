import {
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  MINTED_TOKEN_ADDRESS,
  SOLANA_DEVNET_URL,
  BACKEND_PAYER_ADDRESS,
  BACKEND_URL,
  TOKEN_DECIMALS,
} from "./constants";

// spl-token create-account <token_mint_addres> --owner <owner_of_this_ata> --fee-payer <wallet_that_is_paying_the_fee_for_creating_the_ata_ => Use_wallet_path_if_locally>
// spl-token transfer <token_mint_addres> <amount> <recipient> --from <sender> --fee-payer <wallet_that_is_paying => /Users/emilemilovroydev/lime_token_wallet.json>

export default async function transferTokens(
  sender: any,
  receiver: string,
  amount: number,
  addTransaction: (txId: string, amount: number, address: string) => void
) {
  const connection = SOLANA_DEVNET_URL;
  const minted_token = MINTED_TOKEN_ADDRESS;

  const senderPK = new PublicKey(sender.address);
  const receiverPK = new PublicKey(receiver);
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const amountConverted = amount * Math.pow(10, 9); // 9 decimals for the token

  // Ata of the sender => Geting source token account
  const fromTokenAccount = getAssociatedTokenAddressSync(
    minted_token,
    senderPK
  );

  // Ata of the receiver => Geting destination token account
  const toTokenAccount = getAssociatedTokenAddressSync(
    minted_token,
    receiverPK
  );

  const instructions = [
    createTransferInstruction(
      new PublicKey(fromTokenAccount),
      new PublicKey(toTokenAccount),
      senderPK,
      amountConverted
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

  transactionV0.sign([sender.keyPairSigner]);

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
    addTransaction(transactionHash, amount * 10 ** TOKEN_DECIMALS, receiver);
  }

  return result;
}
