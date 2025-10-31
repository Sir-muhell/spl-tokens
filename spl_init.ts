import { Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import { loadDefaultKeypair } from "./keypair";

(async () => {
  const keypair = await loadDefaultKeypair();
  const commitment: Commitment = "confirmed";
  const connection = new Connection(
    "https://api.devnet.solana.com",
    // "https://api.testnet.solana.com",

    commitment
  );

  try {
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      9
    );
    console.log(
      `======= Successfully created a mint: ${mint.toBase58()} =======`
    );
  } catch (e) {
    console.error(`Something went wrong:`, e);
  }
})();
