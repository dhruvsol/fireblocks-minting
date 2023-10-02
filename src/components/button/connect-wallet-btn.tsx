"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import React from "react";

export const ConnectWalletButton = () => {
  const { setVisible } = useWalletModal();
  const { connected, publicKey } = useWallet();
  return (
    <>
      {connected ? (
        <button className="btn">{publicKey?.toBase58()}</button>
      ) : (
        <button className="btn" onClick={() => setVisible(true)}>
          connect
        </button>
      )}
    </>
  );
};
