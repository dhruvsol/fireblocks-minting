"use client";

import React from "react";
import { Navbar } from "../headers";
import { NftForm } from "../user-forms/nft-form";
import { NFTLoading } from "../loading/nft-loading";
import { NFTSuccess } from "../sucess/nft-sucess";
import { cn } from "@/lib/utils";
import { TokenForm } from "../user-forms/token-form";
import { TokenLoading } from "../loading/token-loading";
import { FormInterface } from "@/app/mint/token/page";
import { UseFormReturn } from "react-hook-form";

interface Props {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  nftCount: number;
  setNftCount: React.Dispatch<React.SetStateAction<number>>;
  formControl: UseFormReturn<FormInterface, any, undefined>;
}
export const TokenSideCard = ({
  setStep,
  step,
  nftCount,
  setNftCount,
  formControl,
}: Props) => {
  return (
    <>
      <div
        className={cn(
          "relative min-h-screen w-full border",
          step === 0 ? "bg-[#AFC1C1]" : "bg-[#D0B5D4]",
        )}
      >
        <Navbar />
        {step === 0 && (
          <>
            <TokenForm
              formControl={formControl}
              setStep={setStep}
              step={step}
            />
          </>
        )}
        {step === 1 && (
          <>
            <TokenLoading />
          </>
        )}
        {step === 2 && (
          <>
            <NFTSuccess />
          </>
        )}
      </div>
    </>
  );
};
