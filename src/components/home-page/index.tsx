"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { SelectToken } from "./select-token";
import { WalletConnectPage } from "./wallet-connect";

export const HomePage = () => {
  const { connected } = useWallet();

  if (connected) {
    return <SelectToken />;
  }
  return <WalletConnectPage />;
};
