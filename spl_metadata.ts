import {
  createV1,
  findMetadataPda,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { clusterApiUrl } from "@solana/web3.js";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { loadDefaultKeypair } from "./keypair";

async function addMetadata() {
  const mintAddress = "AqFPDnbBgnoEKrbr8iwKdv7tW5T5358QenxrMjcCQiwJ";
  const mint = publicKey(mintAddress);

  const endpoint: string = clusterApiUrl("devnet");
  const umi = createUmi(endpoint).use(mplTokenMetadata()).use(mplToolbox());
  const keypair = await loadDefaultKeypair();
  const wallet = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(keypair.secretKey)
  );
  umi.use(keypairIdentity(wallet));

  //   console.log("Mint address:", mint);

  const metadataAccountAddress = await findMetadataPda(umi, {
    mint: mint,
  });

  const txn = await createV1(umi, {
    mint,
    authority: umi.identity,
    payer: umi.identity,
    updateAuthority: umi.identity,
    metadata: metadataAccountAddress,
    name: "Cracked",
    symbol: "CRK",
    uri: "https://pbs.twimg.com/profile_images/1981056521204047872/C73vYxio_400x400.jpg",
    sellerFeeBasisPoints: percentAmount(0),
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);

  let txnSig = base58.deserialize(txn.signature);
  console.log(
    `======= Metadata added to ${mint}. Txn signature: ${txnSig[0]} =======`
  );
}

addMetadata();
