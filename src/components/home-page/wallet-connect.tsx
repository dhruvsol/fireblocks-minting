"use client";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import React from "react";

export const WalletConnectPage = () => {
  const { setVisible } = useWalletModal();
  return (
    <>
      <div className="flex min-h-screen w-full flex-col items-center justify-start gap-4 bg-[#D5B7AC] pt-14">
        <Image
          src="/imgs/nftmintclayno.svg"
          alt="nft mint"
          width={300}
          height={300}
        />
        <h1 className="text-center text-5xl font-extrabold text-black">
          Travel to distant lands <br /> Adventure awaits
        </h1>
        <p className="text-base text-black ">
          How many Claynosaurz would you like to mint?
        </p>
        <button
          onClick={() => setVisible(true)}
          className="btn mt-4 h-16 w-[30rem]"
        >
          <div className="flex items-center justify-center gap-3 text-center">
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 12.75H16.5V14.25H18V12.75Z" fill="black" />
                <path
                  d="M21 6H3V3.75H19.5V2.25H3C2.60218 2.25 2.22064 2.40804 1.93934 2.68934C1.65804 2.97064 1.5 3.35218 1.5 3.75V19.5C1.5 19.8978 1.65804 20.2794 1.93934 20.5607C2.22064 20.842 2.60218 21 3 21H21C21.3978 21 21.7794 20.842 22.0607 20.5607C22.342 20.2794 22.5 19.8978 22.5 19.5V7.5C22.5 7.10218 22.342 6.72064 22.0607 6.43934C21.7794 6.15804 21.3978 6 21 6ZM3 19.5V7.5H21V9.75H15C14.6022 9.75 14.2206 9.90804 13.9393 10.1893C13.658 10.4706 13.5 10.8522 13.5 11.25V15.75C13.5 16.1478 13.658 16.5294 13.9393 16.8107C14.2206 17.092 14.6022 17.25 15 17.25H21V19.5H3ZM21 11.25V15.75H15V11.25H21Z"
                  fill="black"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-black">Connect to Mint</p>
          </div>
        </button>
      </div>
    </>
  );
};
