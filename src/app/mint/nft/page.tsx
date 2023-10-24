"use client";

import { NFTSideCard } from "@/components/sidecards/nft-side-card";
import { SideCard } from "@/components/sidecards/side-card";
import React, { useState } from "react";

interface CardProps {
  heading: string;
  subheading: string;
  points: string[];
}
const NFTPage = () => {
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
      heading: "The NFT Gallery",
      subheading:
        "Finally, the gallery of newly-minted NFTs is created and statistics about the mint and collection are created.",
      points: [
        "This is what happens first",
        "And the second thing happens now.",
        "After that, the third thing is what happens.",
        "And finally, step 4 completes the backend process.",
      ],
    },
  ];

  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <NFTSideCard
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

export default NFTPage;
