"use client";

import { trunkAddress } from "@/utils/helpers/address";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React from "react";

export const ConnectWalletButton = () => {
  const { setVisible } = useWalletModal();
  const { connected, publicKey, disconnect } = useWallet();
  return (
    <>
      {connected ? (
        <button className="btn" onClick={disconnect}>
          {trunkAddress(publicKey?.toBase58() as string)}
        </button>
      ) : (
        <button className="btn" onClick={() => setVisible(true)}>
          connect
        </button>
      )}
    </>
  );
};
