import { FormInterface } from "@/app/mint/token/page";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  formControl: UseFormReturn<FormInterface, any, undefined>;
}
export const TokenLoading = ({ formControl }: Props) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20">
        <h1 className="text-center text-4xl font-bold text-black">
          Creating {formControl.watch("name")} <br /> and Minting <br />{" "}
          {formControl.watch("tokenCount")} Tokens
        </h1>
        <div className="flex justify-center">
          <span className="circle animate-loader"></span>
          <span className="circle animation-delay-200 animate-loader"></span>
          <span className="circle animation-delay-400 animate-loader"></span>
        </div>
      </div>
    </>
  );
};
