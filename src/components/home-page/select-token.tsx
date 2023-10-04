import Image from "next/image";
import Link from "next/link";
import React from "react";

export const SelectToken = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-[#D0B5D4] pt-14">
      <h1 className="text-center text-xl font-extrabold text-black md:text-4xl">
        Remove the complexity of working <br /> with digital assets.
      </h1>
      <p className="text-base font-normal text-black">
        What would you like to do?
      </p>
      <div className="flex items-center justify-center gap-8">
        <Link href={"/mint/nft"}>
          <div className="bottom-shadow flex h-44 w-[19rem] flex-col items-center justify-center gap-5 rounded-lg bg-white">
            <Image
              src="/imgs/clayno.svg"
              alt="mint clayno"
              width={80}
              height={80}
            />
            <p className="text-lg font-semibold text-black">
              Mint a Claynosaur
            </p>
          </div>
        </Link>
        <Link href={"/mint/token"}>
          <div className="bottom-shadow flex h-44 w-[19rem] flex-col items-center justify-center gap-5 rounded-lg bg-white">
            <Image
              src="/imgs/token.svg"
              alt="mint token"
              width={80}
              height={80}
            />
            <p className="text-lg font-semibold text-black">Create a Token</p>
          </div>
        </Link>
      </div>
    </div>
  );
};
