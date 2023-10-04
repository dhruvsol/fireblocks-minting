import Image from "next/image";
import React from "react";
import { ConnectWalletButton } from "../button/connect-wallet-btn";

export const Navbar = () => {
  return (
    <>
      <div className="absolute inset-x-0 top-0 mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4  md:px-0">
        <Image
          src={"/imgs/fireblocks.svg"}
          alt="fireblocks logo"
          width={200}
          height={70}
        />
        <ConnectWalletButton />
      </div>
    </>
  );
};
