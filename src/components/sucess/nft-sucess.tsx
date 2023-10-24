import Image from "next/image";
import React from "react";

export const NFTSuccess = () => {
  return (
    <>
      <div className="mt-20 flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-extrabold text-black">Success!</h1>
        <p className="text-lg font-normal text-black">
          You are now proud owner of 80 Claynosaurz!
        </p>
        <div className=" mx-auto h-0.5 w-[90%] bg-[#D4D4D4]" />
        <div className="my-5 flex w-full justify-evenly">
          <div className="flex flex-col items-start">
            <p className="text-sm text-[#404040]">NFTs Minted</p>
            <h3 className=" font-medium text-black">
              <span className="mr-1 text-xl font-extrabold">80</span>Claynosaurz
            </h3>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm text-[#404040]">Total Mint Cost</p>
            <h3 className=" flex items-center gap-1 font-medium  text-black">
              <Image
                src={"/imgs/solana.svg"}
                alt="solana logo"
                width={20}
                height={20}
              />
              <span className=" text-xl font-extrabold">1.13</span>SOL
            </h3>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm text-[#404040]">Price Per NFT</p>
            <h3 className=" flex items-center gap-1  font-medium text-black">
              <Image
                src={"/imgs/solana.svg"}
                alt="solana logo"
                width={16}
                height={16}
              />
              <span className=" text-xl font-extrabold">0.079</span>SOL
            </h3>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm text-[#404040]">Gas Fee</p>
            <h3 className=" text-black">
              <span className="mr-1 text-xl font-extrabold">$0.00</span>
            </h3>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm text-[#404040]">Time to Mint</p>
            <h3 className=" font-medium text-black">
              <span className="mr-1 text-xl font-extrabold">1.37</span>seconds
            </h3>
          </div>
        </div>
        <div className=" mx-auto h-0.5 w-[90%] bg-[#D4D4D4]" />
      </div>
      <div className="mt-10 flex flex-wrap px-4">
        <Image src={"/imgs/nft.svg"} alt={"nft"} width={200} height={50} />
        <Image src={"/imgs/nft.svg"} alt={"nft"} width={200} height={50} />
        <Image src={"/imgs/nft.svg"} alt={"nft"} width={200} height={50} />
        <Image src={"/imgs/nft.svg"} alt={"nft"} width={200} height={50} />
        <Image src={"/imgs/nft.svg"} alt={"nft"} width={200} height={50} />
        <Image src={"/imgs/nft.svg"} alt={"nft"} width={200} height={50} />
      </div>
    </>
  );
};
