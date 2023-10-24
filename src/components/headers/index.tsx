"use client";
import Image from "next/image";
import React from "react";
import { ConnectWalletButton } from "../button/connect-wallet-btn";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <>
      <div
        className={
          pathname.includes("mint")
            ? "flex h-20 items-center justify-between px-4"
            : "navbar-normal"
        }
      >
        <Link href={"/"}>
          <Image
            src={"/imgs/fireblocks.svg"}
            alt="fireblocks logo"
            width={200}
            height={70}
          />
        </Link>
        <ConnectWalletButton />
      </div>
    </>
  );
};
