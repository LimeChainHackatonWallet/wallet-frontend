import { createSolanaClient } from "gill";

// Create a connection to the Solana testnet
const { rpc } = createSolanaClient({
    urlOrMoniker: "testnet",
})

// Example RPC method call to the the latest blockhash
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();