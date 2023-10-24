"use client";

import { SideCard } from "@/components/sidecards/side-card";
import { TokenSideCard } from "@/components/sidecards/token-side-card";
import { Minter } from "@/lib/minter";
import { FireblocksSDK } from "fireblocks-sdk";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { getAPISec } from "@/utils/helpers/fireblocks";
import { createTokenMint } from "@/utils/mint";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const mintToken = async () => {
    try {
      setIsLoading(true);
      setStep(1);
      // create token
      const apiKey = await getAPISec();
      const fireblocks = new FireblocksSDK(
        apiKey,
        "62efe760-8c68-4d5d-97f5-360686c9bfe2",
        "https://sandbox-api.fireblocks.io",
      );
      const i = await fireblocks.getDepositAddresses("2", "SOL_TEST");
      console.log(i);
      // const success = await createTokenMint(fireblocks, true, "2", {
      //   numberTokens: formControl.getValues("tokenCount"),
      //   numDecimals: 0,
      //   tokenMetadata: {
      //     description: formControl.getValues("description") ?? "",
      //     image: "",
      //     name: formControl.getValues("name"),
      //     symbol: formControl.getValues("symbol"),
      //   },
      // });
      // console.log(success);
      toast.success("Success while minting token", {
        position: "bottom-left",
      });
      setStep(2);
      // setIsLoading(true);
    } catch (error) {
      setStep(0);
      toast.error("Error while minting token", {
        position: "bottom-left",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex min-h-screen w-full justify-center">
        <TokenSideCard
          mintToken={mintToken}
          formControl={formControl}
          setStep={setStep}
          step={step}
        />
        <div className="min-h-screen w-full">
          <SideCard {...sidebarElements[step]} />
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default TokenPage;
