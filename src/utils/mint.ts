import { FbSigner } from "@/lib/fbSigner";
import { web3 } from "@coral-xyz/anchor";
import {
  Metaplex,
  PublicKey,
  UploadMetadataInput,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import {
  DataV2,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { FireblocksSDK } from "fireblocks-sdk";
import * as utils from "../lib/utils";
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
export async function getConnection(testNet: boolean) {
  let connection = null;

  if (testNet) {
    connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  } else {
    connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
  }
  return connection;
}

export const createTokenMintTransaction = async (
  metaplex: Metaplex,
  connection: Connection,
  payer: PublicKey,
  mintKeypair: PublicKey,
  destinationWallet: PublicKey,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey,
  mintConfig: {
    numDecimals: number;
    numberTokens: number;
  },
  ON_CHAIN_METADATA: DataV2,
) => {
  const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);

  //metadata account associated with mint
  const metadataPDA = metaplex.nfts().pdas().metadata({ mint: mintKeypair });
  //get associated token account of your wallet
  const tokenATA = await getAssociatedTokenAddress(
    mintKeypair,
    destinationWallet,
  );

  const createNewTokenTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair,
      space: MINT_SIZE,
      lamports: requiredBalance,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair, // Mint Address
      mintConfig.numDecimals, // Number of Decimals of New mint
      mintAuthority, // Mint Authority
      freezeAuthority, // Freeze Authority
      TOKEN_PROGRAM_ID,
    ),
    createAssociatedTokenAccountInstruction(
      payer, //Payer
      tokenATA, //Associated token account
      payer, //Token account owner
      mintKeypair, //Mint
    ),
    createMintToInstruction(
      mintKeypair, //Mint
      tokenATA, //Destination Token Account
      mintAuthority, //Authority
      mintConfig.numberTokens * Math.pow(10, mintConfig.numDecimals), //number of tokens
    ),
    createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataPDA,
        mint: mintKeypair,
        mintAuthority: mintAuthority,
        payer: payer,
        updateAuthority: mintAuthority,
      },
      {
        createMetadataAccountArgsV3: {
          data: ON_CHAIN_METADATA,
          isMutable: true,
          collectionDetails: null,
        },
      },
    ),
  );
  return createNewTokenTransaction;
};

export const createTokenMint = async (
  fireblocks: FireblocksSDK,
  testNet: boolean,
  vault: string,
  mintConfig: {
    numDecimals: number;
    numberTokens: number;
    tokenMetadata: {
      name: string;
      symbol: string;
      description: string;
      image: string;
    };
  },
): Promise<{
  mintAddress: string;
  txSig: string;
} | null> => {
  try {
    const connection = await getConnection(testNet);

    const fbSigner = new FbSigner(fireblocks, vault, true);
    const mainAddr = await fireblocks.getDepositAddresses(vault, "SOL_TEST");
    const mainPubKey = new web3.PublicKey(mainAddr[0].address);

    const mintPublicKey = web3.Keypair.generate();

    const userWallet = Keypair.fromSecretKey(
      new Uint8Array((process.env.WALLET! as string).split(",").map(Number)),
    );

    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(userWallet))
      .use(
        bundlrStorage({
          address: "https://devnet.bundlr.network",
          providerUrl: "https://api.devnet.solana.com",
          timeout: 60000,
        }),
      );

    const MINT_CONFIG = {
      numDecimals: mintConfig.numDecimals,
      numberTokens: mintConfig.numberTokens,
    };

    const MY_TOKEN_METADATA: UploadMetadataInput = mintConfig.tokenMetadata;

    const ON_CHAIN_METADATA = {
      name: MY_TOKEN_METADATA.name,
      symbol: MY_TOKEN_METADATA.symbol,
      uri: "",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    } as DataV2;

    const uploadMetadata = async (
      tokenMetadata: UploadMetadataInput,
    ): Promise<string> => {
      //Upload to Arweave
      const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata);
      console.log(`Arweave URL: `, uri);
      return uri;
    };

    let metadataUri = await uploadMetadata(MY_TOKEN_METADATA);

    ON_CHAIN_METADATA.uri = metadataUri;

    const mintTx = await createTokenMintTransaction(
      metaplex,
      connection,
      mainPubKey,
      mintPublicKey.publicKey,
      mainPubKey,
      mainPubKey,
      mainPubKey,
      MINT_CONFIG,
      ON_CHAIN_METADATA,
    );
    let { blockhash } = await connection.getLatestBlockhash("finalized");

    mintTx.recentBlockhash = blockhash;

    mintTx.feePayer = mainPubKey;

    let transactionBuffer = mintTx.serializeMessage().toString("hex");

    const signatures = await fbSigner.signWithFB(
      transactionBuffer,
      `Minting a token on ${mintPublicKey.publicKey.toString()} with ${mainPubKey.toString()} as the payer and owner from vault ${vault}.\n Token Name: ${
        MY_TOKEN_METADATA.name
      } \n Token Symbol: ${MY_TOKEN_METADATA.symbol}`,
    );

    signatures.signedMessages.forEach((signedMessage: any) => {
      if (signedMessage.derivationPath[3] == 0) {
        mintTx.addSignature(
          mainPubKey,
          Buffer.from(signedMessage.signature.fullSig, "hex"),
        );
      }
    });

    mintTx.partialSign(mintPublicKey);

    const res = await utils.sendRawTX(
      mintTx.serialize(),
      web3,
      connection,
      testNet,
    );
    console.log("create token: ", res);
    return {
      mintAddress: mintPublicKey.publicKey.toString(),
      txSig: res as string,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
