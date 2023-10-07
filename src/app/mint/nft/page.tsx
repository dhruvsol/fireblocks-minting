import { Navbar } from "@/components/headers";
import { NFTLoading } from "@/components/loading/nft-loading";
import { SideCard } from "@/components/sidecards/side-card";
import { NftForm } from "@/components/user-forms/nft-form";
import React from "react";

const NFTPage = () => {
  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <div className="relative min-h-screen w-full border bg-[#AFC1C1]">
          <Navbar />
          <NFTLoading count={80} />
        </div>
        <div className="min-h-screen w-full">
          <SideCard />
        </div>
      </div>
    </>
  );
};

export default NFTPage;
