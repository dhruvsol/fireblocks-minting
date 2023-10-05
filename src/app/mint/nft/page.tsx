import { Navbar } from "@/components/headers";
import { SideCard } from "@/components/sidecards/side-card";
import React from "react";

const NFTPage = () => {
  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <div className="min-h-screen w-full border bg-[#AFC1C1]">
          <Navbar />
        </div>
        <div className="min-h-screen w-full">
          <SideCard />
        </div>
      </div>
    </>
  );
};

export default NFTPage;
