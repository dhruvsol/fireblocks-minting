"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import { web3 } from "@coral-xyz/anchor";

require("@solana/wallet-adapter-react-ui/styles.css");

interface Props {
  children: JSX.Element;
}
export const Provider = ({ children }: Props) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => web3.clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
