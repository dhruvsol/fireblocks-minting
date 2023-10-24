import { FireblocksSDK } from "fireblocks-sdk";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { FbSigner } from "../src/lib/fbSigner";
import { Connection, Keypair } from "@solana/web3.js";
config();

const apiSecret = fs.readFileSync(
  path.resolve(__dirname, "../fireblocks_secret_sahil.key"),
  "utf8",
);

const fireblocks = new FireblocksSDK(
  apiSecret,
  "67062b21-f06f-4f07-b3ec-1977bf6a3cf2",
  "https://sandbox-api.fireblocks.io",
);

(async () => {
  try {
    const fbSigner = new FbSigner(fireblocks, "1");

    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed",
    );

    const from = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs
            .readFileSync(
              path.resolve(process.cwd(), "../wallet.json"),
              "utf-8",
            )
            .toString(),
        ),
      ),
    );

    const addys = await fireblocks.getDepositAddresses("1", "SOL_TEST");

    const sig = await fbSigner.transferTx(
      connection,
      from.publicKey,
      from.publicKey,
    );

    console.log(JSON.stringify(sig, null, 2));
    // console.log(sig.signedMessages[0].signature);
  } catch (e) {
    console.log(e);
  }
})();
