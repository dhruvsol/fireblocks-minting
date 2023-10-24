import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LAMPORTS_TO_SOL = 1000000000;

export async function sendRawTX(
  rawTx: any,
  web3: any,
  connection: any,
  testNet: any,
): Promise<boolean | string> {
  let cluster = "cluster=mainnet-beta";
  if (testNet) cluster = "cluster=devnet";
  try {
    const txRes = await web3.sendAndConfirmRawTransaction(connection, rawTx);
    console.log(
      "Success. Transaction Hash:\n",
      txRes +
        `\n\nExplorer Link: \nhttps://explorer.solana.com/tx/${txRes}?${cluster}`,
    );
    return txRes;
  } catch (e) {
    console.log("Failed\n", e);
    return false;
  }
}
