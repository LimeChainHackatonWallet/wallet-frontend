import { generateKeyPairSigner, } from "gill";


// Used documentation: https://solana.com/developers/cookbook/wallets/create-keypair

export const generateSolanaKeyPair = async () => {
    const walletKeyPair = await generateKeyPairSigner();

    return walletKeyPair;
}