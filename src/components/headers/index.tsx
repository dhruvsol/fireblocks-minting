"use client";
import Image from "next/image";
import React from "react";
import { ConnectWalletButton } from "../button/connect-wallet-btn";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      <div
        className={
          pathname.includes("mint")
            ? "flex h-20 justify-between px-4"
            : "navbar-normal"
        }
      >
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
