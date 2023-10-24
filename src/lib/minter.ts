import { FireblocksSDK } from "fireblocks-sdk";
import * as web3 from "@solana/web3.js";
import * as utils from "./utils";
import { FbSigner } from "./fbSigner";
import {
  Metaplex,
  UploadMetadataInput,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import {
  CreateMetadataAccountArgsV3,
  DataV2,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV3Instruction,
  createSetCollectionSizeInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ValidDepthSizePair,
  createAllocTreeIx,
} from "@solana/spl-account-compression";
import {
  PROGRAM_ID as MPL_BUBBLEGUM_PROGRAM_ID,
  MetadataArgs,
  TokenStandard,
  TokenProgramVersion,
  createCreateTreeInstruction,
  createMintToCollectionV1Instruction,
} from "@metaplex-foundation/mpl-bubblegum";

export class Minter {
  private collectionMetadataV3: CreateMetadataAccountArgsV3;
  private nftMint: web3.Keypair;
  private fbSigner: FbSigner = new FbSigner(
    this.fireblocks,
    this.vault,
    this.testNet,
  );

  constructor(
    private fireblocks: FireblocksSDK,
    private vault: string,
    private testNet: boolean,
  ) {}

  private async getConnection() {
    let connection = null;

    if (this.testNet) {
      connection = new web3.Connection(web3.clusterApiUrl("devnet"));
    } else {
      connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
    }
    return connection;
  }

  private async createTokenMintTransaction(
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
  ) {
    //Get the minimum lamport balance to create a new account and avoid rent payments
    const requiredBalance =
      await getMinimumBalanceForRentExemptMint(connection);

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
  }

  public async createTokenMint(mintConfig: {
    numDecimals: number;
    numberTokens: number;
    tokenMetadata: {
      name: string;
      symbol: string;
      description: string;
      image: string;
    };
  }): Promise<{
    mintAddress: string;
    txSig: string;
  }> {
    const connection = await this.getConnection();

    const fbSigner = new FbSigner(this.fireblocks, this.vault, true);

    const mainAddr = await this.fireblocks.getDepositAddresses(
      this.vault,
      "SOL_TEST",
    );

    const mainPubKey = new web3.PublicKey(mainAddr[0].address);

    const mintPublicKey = web3.Keypair.generate();

    console.log(`Mint Address: `, mintPublicKey.publicKey.toString());
    console.log(`Main Address: `, mainPubKey.toString());

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

    const mintTx = await this.createTokenMintTransaction(
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
      `Minting a token on ${mintPublicKey.publicKey.toString()} with ${mainPubKey.toString()} as the payer and owner from vault ${
        this.vault
      }.\n Token Name: ${MY_TOKEN_METADATA.name} \n Token Symbol: ${
        MY_TOKEN_METADATA.symbol
      }`,
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
      this.testNet,
    );

    console.log("create token: ", res);
    return {
      mintAddress: mintPublicKey.publicKey.toString(),
      txSig: res as string,
    };
  }

  private async createCollectionMint(
    collectionMetadata: {
      name: string;
      symbol: string;
      uri: string;
      creatorAddress: web3.PublicKey;
      creatorShare: number;
      sellerFeeBasisPoints: number;
    },
    mainPubKey: web3.PublicKey,
  ) {
    this.collectionMetadataV3 = {
      data: {
        name: collectionMetadata.name,
        symbol: collectionMetadata.symbol,
        uri: collectionMetadata.uri,
        sellerFeeBasisPoints: collectionMetadata.sellerFeeBasisPoints,
        creators: [
          {
            address: collectionMetadata.creatorAddress,
            verified: false,
            share: collectionMetadata.creatorShare,
          },
        ],
        collection: null,
        uses: null,
      },
      isMutable: false,
      collectionDetails: null,
    };

    const connection = await this.getConnection();
    const lamports =
      await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
    this.nftMint = web3.Keypair.generate();

    let tx = new web3.Transaction();

    tx.add(
      web3.SystemProgram.createAccount({
        fromPubkey: mainPubKey,
        newAccountPubkey: this.nftMint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
    );

    tx.add(
      createInitializeMint2Instruction(
        this.nftMint.publicKey,
        0,
        mainPubKey,
        mainPubKey,
        TOKEN_PROGRAM_ID,
      ),
    );

    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = mainPubKey;
    let payload = tx.serializeMessage().toString("hex");

    let signatures = await this.fbSigner.signWithFB(
      payload,
      "creating the collection's mint " + mainPubKey.toString(),
    );

    signatures.signedMessages.forEach((signedMessage: any) => {
      if (signedMessage.derivationPath[3] == 0) {
        tx.addSignature(
          mainPubKey,
          Buffer.from(signedMessage.signature.fullSig, "hex"),
        );
      }
    });

    tx.partialSign(this.nftMint);

    let res = await utils.sendRawTX(tx.serialize(), web3, connection, true);

    if (!(res as boolean)) throw new Error("Failed to create collection mint");

    return {
      txSig: res as string,
    };
  }

  private async createTokenAccount(
    mainPubKey: web3.PublicKey,
    connection: web3.Connection,
  ) {
    const [associatedToken] = web3.PublicKey.findProgramAddressSync(
      [
        mainPubKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        this.nftMint.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    let tx = new web3.Transaction().add(
      new web3.TransactionInstruction({
        keys: [
          { pubkey: mainPubKey, isSigner: true, isWritable: true },
          { pubkey: associatedToken, isSigner: false, isWritable: true },
          { pubkey: mainPubKey, isSigner: false, isWritable: false },
          {
            pubkey: this.nftMint.publicKey,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: Buffer.alloc(0),
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      }),
    );

    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = mainPubKey;
    let payload = tx.serializeMessage().toString("hex");
    let signatures = await this.fbSigner.signWithFB(
      payload,
      "creating a cnft token account " + mainPubKey.toString(),
    );

    signatures.signedMessages.forEach((signedMessage: any) => {
      if (signedMessage.derivationPath[3] == 0) {
        tx.addSignature(
          mainPubKey,
          Buffer.from(signedMessage.signature.fullSig, "hex"),
        );
      }
    });

    let res = await utils.sendRawTX(tx.serialize(), web3, connection, true);

    if (!(res as boolean))
      throw new Error("Failed to create cnft token mint account");

    tx = new web3.Transaction();
    tx.add(
      createMintToInstruction(
        this.nftMint.publicKey,
        associatedToken,
        mainPubKey,
        1,
        [],
        TOKEN_PROGRAM_ID,
      ),
    );
    blockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = mainPubKey;
    payload = tx.serializeMessage().toString("hex");
    signatures = await this.fbSigner.signWithFB(
      payload,
      "minting 1 token to " + this.nftMint.publicKey.toString(),
    );

    signatures.signedMessages.forEach((signedMessage: any) => {
      if (signedMessage.derivationPath[3] == 0) {
        tx.addSignature(
          mainPubKey,
          Buffer.from(signedMessage.signature.fullSig, "hex"),
        );
      }
    });

    res = await utils.sendRawTX(tx.serialize(), web3, connection, true);

    if (!(res as boolean))
      throw new Error("Editions must have exactly one token");

    return {
      txSig: res as string,
    };
  }

  private async setupMetadataAccount(
    mainPubKey: web3.PublicKey,
    connection: web3.Connection,
  ) {
    const [metadataAccount, _bump1] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        this.nftMint.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );

    // create an instruction to create the metadata account
    const createMetadataIx = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: this.nftMint.publicKey,
        mintAuthority: mainPubKey,
        payer: mainPubKey,
        updateAuthority: mainPubKey,
      },
      {
        createMetadataAccountArgsV3: this.collectionMetadataV3,
      },
    );

    // derive the PDA for the metadata account
    const [masterEditionAccount, _bump2] =
      web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata", "utf8"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          this.nftMint.publicKey.toBuffer(),
          Buffer.from("edition", "utf8"),
        ],
        TOKEN_METADATA_PROGRAM_ID,
      );

    console.log("Master edition account:", masterEditionAccount.toBase58());

    // create an instruction to create the metadata account
    const createMasterEditionIx = createCreateMasterEditionV3Instruction(
      {
        edition: masterEditionAccount,
        mint: this.nftMint.publicKey,
        mintAuthority: mainPubKey,
        payer: mainPubKey,
        updateAuthority: mainPubKey,
        metadata: metadataAccount,
      },
      {
        createMasterEditionArgs: {
          maxSupply: 0,
        },
      },
    );

    // create the collection size instruction
    const collectionSizeIX = createSetCollectionSizeInstruction(
      {
        collectionMetadata: metadataAccount,
        collectionAuthority: mainPubKey,
        collectionMint: this.nftMint.publicKey,
      },
      {
        setCollectionSizeArgs: { size: 50 },
      },
    );

    let tx = new web3.Transaction()
      .add(createMetadataIx)
      .add(createMasterEditionIx)
      .add(collectionSizeIX);

    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = mainPubKey;
    let payload = tx.serializeMessage().toString("hex");
    let signatures = await this.fbSigner.signWithFB(
      payload,
      "setting up metadata account " + metadataAccount.toString(),
    );

    signatures.signedMessages.forEach((signedMessage: any) => {
      if (signedMessage.derivationPath[3] == 0) {
        tx.addSignature(
          mainPubKey,
          Buffer.from(signedMessage.signature.fullSig, "hex"),
        );
      }
    });

    let res = await utils.sendRawTX(tx.serialize(), web3, connection, true);

    if (!(res as boolean))
      throw new Error("Failed to create collection metadata account");

    return {
      metadataAccount,
      masterEditionAccount,
      txSig: res as string,
    };
  }

  private async createMerkleTree(
    connection: web3.Connection,
    mainPubKey: web3.PublicKey,
  ) {
    let tx = new web3.Transaction();

    const maxDepthSizePair: ValidDepthSizePair = {
      // max=16,384 nodes (for a `maxDepth` of 14)
      maxDepth: 5,
      maxBufferSize: 8,
    };

    // define the canopy depth of our tree to be created
    const canopyDepth = 2;

    // Generate a place for the tree to live
    const treeKeypair = web3.Keypair.generate();

    // derive the tree's authority (PDA), owned by Bubblegum
    const [treeAuthority, _bump] = web3.PublicKey.findProgramAddressSync(
      [treeKeypair.publicKey.toBuffer()],
      new web3.PublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
    );

    const allocTreeIx = await createAllocTreeIx(
      connection,
      treeKeypair.publicKey,
      mainPubKey,
      maxDepthSizePair,
      canopyDepth,
    );

    // create the instruction to actually create the tree
    const createTreeIx = createCreateTreeInstruction(
      {
        payer: mainPubKey,
        treeCreator: mainPubKey,
        treeAuthority,
        merkleTree: treeKeypair.publicKey,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        logWrapper: SPL_NOOP_PROGRAM_ID,
      },
      {
        maxBufferSize: maxDepthSizePair.maxBufferSize,
        maxDepth: maxDepthSizePair.maxDepth,
        public: false,
      },
      new web3.PublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
    );

    tx.add(allocTreeIx);
    tx.add(createTreeIx);

    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = mainPubKey;
    let payload = tx.serializeMessage().toString("hex");
    let signatures = await this.fbSigner.signWithFB(
      payload,
      "creating a merkle tree " + treeKeypair.publicKey.toString(),
    );

    signatures.signedMessages.forEach((signedMessage: any) => {
      if (signedMessage.derivationPath[3] == 0) {
        tx.addSignature(
          mainPubKey,
          Buffer.from(signedMessage.signature.fullSig, "hex"),
        );
      }
    });

    tx.partialSign(treeKeypair);

    let res = await utils.sendRawTX(tx.serialize(), web3, connection, true);

    if (!(res as boolean)) throw new Error("Failed to create merkle tree");

    return {
      treeKeypair,
      treeAuthority,
      txSig: res as string,
    };
  }

  public async createCompressedNFTMint(cnftMetadata: {
    nftName: string;
    nftURI: string;
    collection: {
      name: string;
      symbol: string;
      uri: string;
      creatorAddress: web3.PublicKey;
      creatorShare: number;
      sellerFeeBasisPoints: number;
    };
  }) {
    const mainAddr = await this.fireblocks.getDepositAddresses(
      this.vault,
      "SOL_TEST",
    );
    const mainPubKey = new web3.PublicKey(mainAddr[0].address);

    const connection = await this.getConnection();

    const { txSig: ccmSig } = await this.createCollectionMint(
      {
        name: cnftMetadata.collection.name,
        symbol: cnftMetadata.collection.symbol,
        uri: cnftMetadata.collection.uri,
        creatorAddress: mainPubKey,
        creatorShare: cnftMetadata.collection.creatorShare,
        sellerFeeBasisPoints: cnftMetadata.collection.sellerFeeBasisPoints,
      },
      mainPubKey,
    );

    const { txSig: ctaSig } = await this.createTokenAccount(
      mainPubKey,
      connection,
    );

    const {
      metadataAccount,
      masterEditionAccount,
      txSig: metaSig,
    } = await this.setupMetadataAccount(mainPubKey, connection);

    const {
      treeKeypair,
      treeAuthority,
      txSig: treeSig,
    } = await this.createMerkleTree(connection, mainPubKey);

    const compressedNFTMetadata: MetadataArgs = {
      name: cnftMetadata.nftName,
      symbol: this.collectionMetadataV3.data.symbol,
      // specific json metadata for each NFT
      uri: cnftMetadata.nftURI,
      creators: [
        {
          address: mainPubKey,
          verified: false,
          share: 100,
        },
      ],
      editionNonce: 0,
      uses: null,
      collection: null,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 0,
      isMutable: false,
      tokenStandard: TokenStandard.NonFungible,
      // these values are taken from the Bubblegum package
      tokenProgramVersion: TokenProgramVersion.Original,
    };

    const [bubblegumSigner, _bump3] = web3.PublicKey.findProgramAddressSync(
      // `collection_cpi` is a custom prefix required by the Bubblegum program
      [Buffer.from("collection_cpi", "utf8")],
      new web3.PublicKey(MPL_BUBBLEGUM_PROGRAM_ID),
    );

    const mintIxs: web3.TransactionInstruction[] = [];

    const metadataArgs = Object.assign(compressedNFTMetadata, {
      collection: { key: this.nftMint.publicKey, verified: false },
    });

    mintIxs.push(
      createMintToCollectionV1Instruction(
        {
          payer: mainPubKey,

          merkleTree: treeKeypair.publicKey,
          treeAuthority,
          treeDelegate: mainPubKey,

          // set the receiver of the NFT
          leafOwner: mainPubKey,
          // set a delegated authority over this NFT
          leafDelegate: mainPubKey,

          // collection details
          collectionAuthority: mainPubKey,
          collectionAuthorityRecordPda: new web3.PublicKey(
            MPL_BUBBLEGUM_PROGRAM_ID,
          ),
          collectionMint: this.nftMint.publicKey,
          collectionMetadata: metadataAccount,
          editionAccount: masterEditionAccount,

          // other accounts
          compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
          logWrapper: SPL_NOOP_PROGRAM_ID,
          bubblegumSigner: bubblegumSigner,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        },
        {
          metadataArgs,
        },
      ),
    );

    let tx = new web3.Transaction().add(...mintIxs);

    let blockhash = (await connection.getLatestBlockhash("finalized"))
      .blockhash;
    tx.recentBlockhash = blockhash;
    tx.feePayer = mainPubKey;
    let payload = tx.serializeMessage().toString("hex");
    let signatures = await this.fbSigner.signWithFB(
      payload,
      "minting one compressed nft " + this.nftMint.publicKey.toString(),
    );

    signatures.signedMessages.forEach((signedMessage: any) => {
      if (signedMessage.derivationPath[3] == 0) {
        tx.addSignature(
          mainPubKey,
          Buffer.from(signedMessage.signature.fullSig, "hex"),
        );
      }
    });

    let res = await utils.sendRawTX(tx.serialize(), web3, connection, true);
    return {
      txSig: res as string,
      mintAddress: this.nftMint.publicKey,
    };
  }
}
