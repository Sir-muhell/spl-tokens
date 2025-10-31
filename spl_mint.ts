import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { loadDefaultKeypair } from "./keypair";

(async () => {
  const keypair = await loadDefaultKeypair();
  const commitment: Commitment = "confirmed";
  const connection = new Connection(
    "https://api.devnet.solana.com",
    // "https://api.testnet.solana.com",

    commitment
  );
  const token_decimals = 1_000_000_000;

  const mint = new PublicKey("AqFPDnbBgnoEKrbr8iwKdv7tW5T5358QenxrMjcCQiwJ");

  try {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    console.log(`======= Your ata address: ${ata.address.toBase58()} =======`);

    const amountToMint = 1000 * token_decimals;

    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      ata.address,
      keypair.publicKey,
      amountToMint
    );

    console.log(`======= Your mint txid: ${mintTx} =======`);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
})();
