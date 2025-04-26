import { getOrCreateAssociatedTokenAccount, createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, Keypair, ParsedAccountData, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { MINTED_TOKEN_ADDRESS, SOLANA_DEVNET_URL } from "./constants";

// spl-token create-account <token_mint_addres> --owner <owner_of_this_ata> --fee-payer <wallet_that_is_paying_the_fee_for_creating_the_ata_ => Use_wallet_path_if_locally>
// spl-token transfer <token_mint_addres> <amount> <recipient> --from <sender> --fee-payer <wallet_that_is_paying => /Users/emilemilovroydev/lime_token_wallet.json>

// async function getNumberDecimals(connection: Connection, mintAddress: PublicKey):Promise<number> {
//     const info = await connection.getParsedAccountInfo(mintAddress);
//     const result = (info.value?.data as ParsedAccountData)?.parsed?.info?.decimals as number;
//     return result;
// }

export default async function transferTokens(sender: any, receiver: string, amount: number) {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const minted_token = new PublicKey("BZSyBGAzgER4LsQioSXvHxvPA9yPseNqnLX275LJQHKX"); 

    const receiverPK = new PublicKey(receiver);

    // // Ata of the sender => Geting source token account
    // let fromTokenAccount = getAssociatedTokenAddressSync(
    //     minted_token,
    //     sender.publicKey,
    // );

    // console.log("Source Account: ", fromTokenAccount);

    // // Ata of the receiver => Geting destination token account
    // let toTokenAccount = await getOrCreateAssociatedTokenAccount(
    //     connection,
    //     sender.publicKey,
    //     minted_token,
    //     receiverPK
    // );
    // console.log("Destination Account: ", toTokenAccount.address.toString());
    
}