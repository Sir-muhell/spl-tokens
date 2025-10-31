import { Keypair } from "@solana/web3.js";
import { readFileSync } from "fs";
import { homedir } from "os";
import path from "path";

export async function loadKeypairFromFile(filePath: string): Promise<Keypair> {
  const resolvedPath = path.resolve(
    filePath.startsWith("~") ? filePath.replace("~", homedir()) : filePath
  );

  const loadedKeyBytes = Uint8Array.from(
    JSON.parse(readFileSync(resolvedPath, "utf8"))
  );

  return Keypair.fromSecretKey(loadedKeyBytes);
}

export async function loadDefaultKeypair(): Promise<Keypair> {
  return loadKeypairFromFile("~/.config/solana/id.json");
}

(async () => {
  try {
    const keypair = await loadDefaultKeypair();
    console.log("Loaded keypair:", keypair.publicKey.toBase58());
  } catch (err) {
    console.error("Failed to load keypair:", err);
  }
})();
