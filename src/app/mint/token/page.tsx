"use client";

import { NFTSideCard } from "@/components/sidecards/nft-side-card";
import { SideCard } from "@/components/sidecards/side-card";
import { TokenSideCard } from "@/components/sidecards/token-side-card";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface CardProps {
  heading: string;
  subheading: string;
  points: string[];
}

export interface FormInterface {
  name: string;
  symbol: string;
  description?: string;
  tokenImage?: string;
  decimals: number;
  tokenCount: number;
}
const TokenPage = () => {
  const [step, setStep] = useState<number>(0);
  const [nftCount, setNftCount] = useState<number>(100);

  const sidebarElements: CardProps[] = [
    {
      heading: "Determine Quantity",
      subheading:
        "Here is where the interface asks the user to input a number or slide to indicate the amount of NFTs they want to mint. The interface provides feedback on unit and total price of the minting.",
      points: [
        "This is what happens first",
        "And the second thing happens now.",
        "After that, the third thing is what happens.",
        "And finally, step 4 completes the backend process.",
      ],
    },
    {
      heading: "Minting in Progress",
      subheading: "Once the transaction is signed, the minting process begins.",
      points: [
        "This is what happens first",
        "And the second thing happens now.",
        "After that, the third thing is what happens.",
        "And finally, step 4 completes the backend process.",
      ],
    },
    {
      heading: "The Token Mint Result",
      subheading:
        "Finally, statistics about the mint and collection are created.",
      points: [
        "This is what happens first",
        "And the second thing happens now.",
      ],
    },
  ];
  const formControl = useForm<FormInterface>({
    defaultValues: {
      decimals: 6,
      description: "",
      name: "",
      tokenImage: "",
      symbol: "",
      tokenCount: 30,
    },
  });
  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <TokenSideCard
          formControl={formControl}
          setStep={setStep}
          step={step}
          nftCount={nftCount}
          setNftCount={setNftCount}
        />
        <div className="min-h-screen w-full">
          <SideCard {...sidebarElements[step]} />
        </div>
      </div>
    </>
  );
};

export default TokenPage;
