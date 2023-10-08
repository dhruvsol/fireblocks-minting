"use client";

import { NFTSideCard } from "@/components/sidecards/nft-side-card";
import { SideCard } from "@/components/sidecards/side-card";
import React, { useState } from "react";

const NFTPage = () => {
  const [step, setStep] = useState<number>(0);
  const [nftCount, setNftCount] = useState<number>(100);
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
          <SideCard />
        </div>
      </div>
    </>
  );
};

export default NFTPage;
