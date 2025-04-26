import { Connection, Keypair, LAMPORTS_PER_SOL, TransactionInstruction, Transaction, PublicKey} from "@solana/web3.js";



export default async function aidrop_sol_to_address(recipientAddress: string, amount: number) {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const recipientPublicKey = new PublicKey(recipientAddress);

    const airdropSignature = await connection.requestAirdrop(
        recipientPublicKey,
        amount * LAMPORTS_PER_SOL
    );
    
    // Wait for the transaction to be confirmed
    await connection.confirmTransaction(airdropSignature);

    console.log(`Airdropped ${amount} SOL to ${recipientAddress}`);
    console.log(`Airdrop transaction signature: ${airdropSignature}`);
    return airdropSignature;
}
