import { FormInterface } from "@/app/mint/token/page";
import Image from "next/image";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  formControl: UseFormReturn<FormInterface, any, undefined>;
}
export const TokenSuccess = ({ formControl }: Props) => {
  return (
    <>
      <div className="mt-20 flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-extrabold text-black">Success!</h1>
        <p className="text-lg font-normal text-black">
          You are now the creator of {formControl.watch("tokenCount")}!
        </p>
        <div className=" mx-auto h-0.5 w-[90%] bg-[#D4D4D4]" />

        <div className="flex w-full items-start justify-start gap-10 px-10">
          <div>
            <Image
              width={240}
              height={400}
              src={"/imgs/token-outline.svg"}
              alt="token"
            />
          </div>
          <div>
            <div className="text-black">
              <h1 className="text-2xl font-extrabold">Clayno Coin</h1>
              <p className="text-lg font-normal">
                Travel to distant lands. Explore the uncharted.
                <br /> Adventure awaits
              </p>
            </div>
            <div className="mt-10 flex w-full flex-wrap gap-5">
              <div className="flex w-1/3 flex-col">
                <p className="text-sm font-normal text-[#404040]">Symbol</p>
                <h1 className="text-lg font-medium text-black">#CLAYNO</h1>
              </div>
              <div className="flex w-1/3 flex-col">
                <p className="text-sm font-normal text-[#404040]">
                  Token Supply
                </p>
                <h1 className="text-lg font-medium text-black">10,000</h1>
              </div>
              <div className="flex  flex-col">
                <p className="text-sm font-normal text-[#404040]">
                  Number of Decimals
                </p>
                <h1 className="text-lg font-medium text-black">6</h1>
              </div>
              <div className="flex w-1/3 flex-col">
                <p className="text-sm font-normal text-[#404040]">
                  Total Mint Cost
                </p>
                <h1 className="text-lg font-medium text-black">0.079SOL</h1>
              </div>
              <div className="flex w-1/3 flex-col">
                <p className="text-sm font-normal text-[#404040]">Gas Fee</p>
                <h1 className="text-lg font-medium text-black">$0.00</h1>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-normal text-[#404040]">
                  Time to Mint
                </p>
                <h1 className="text-lg font-medium text-black">1.37 seconds</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
