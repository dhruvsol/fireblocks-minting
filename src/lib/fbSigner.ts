import {
  FireblocksSDK,
  PeerType,
  TransactionOperation,
  TransactionStatus,
  CreateTransactionResponse,
} from "fireblocks-sdk";

export const LAMPORTS_TO_SOL = 1000000000;

export class FbSigner {
  constructor(
    private fireblocks: FireblocksSDK,
    private vaultAccountId: string,
    private testnet: boolean,
  ) {}

  private async waitForTxCompletion(fbTx: CreateTransactionResponse) {
    let tx = fbTx;
    let prevStatus;

    // console.log("Transaction's status: " + tx.status);
    while (tx.status != TransactionStatus.COMPLETED) {
      if (
        tx.status == TransactionStatus.BLOCKED ||
        tx.status == TransactionStatus.FAILED ||
        tx.status == TransactionStatus.REJECTED ||
        tx.status == TransactionStatus.CANCELLED
      ) {
        // console.log("Transaction's status: " + tx.status);

        throw new Error(tx.status + " Exiting the operation");
      }
      prevStatus = tx.status;
      tx = await this.fireblocks.getTransactionById(fbTx.id);
      if (tx.status != prevStatus) {
        // console.log("Transaction's status: " + tx.status);
      }
      setTimeout(() => {}, 4000);
    }

    return await this.fireblocks.getTransactionById(fbTx.id);
  }

  private async fbRawSigning(payloadToSign: any, note: string) {
    const fbTx = await this.fireblocks.createTransaction({
      assetId: this.testnet ? "SOL_TEST" : "SOL",
      operation: TransactionOperation.RAW,
      source: {
        type: PeerType.VAULT_ACCOUNT,
        id: String(this.vaultAccountId),
      },
      note,
      extraParameters: {
        rawMessageData: {
          messages: payloadToSign,
        },
      },
    });
    return await this.waitForTxCompletion(fbTx);
  }

  public async signWithFB(message: string, note: string) {
    let messages = [];
    let res: any;

    messages = [
      {
        content: message,
      },
    ];
    res = this.fbRawSigning(messages, note);

    return res;
  }
}
