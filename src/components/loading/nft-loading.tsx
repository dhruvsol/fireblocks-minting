/* eslint-disable tailwindcss/no-custom-classname */
import Image from "next/image";
import React from "react";

interface Props {
  count: number;
}
export const NFTLoading = ({ count }: Props) => {
  return (
    <>
      <div className="relative flex h-screen flex-col items-center justify-center gap-3 pb-44">
        <h1 className="relative text-center text-4xl font-extrabold">
          Minting <br /> {count} Claynosaurz
        </h1>
        <div className="flex justify-center">
          <span className="circle animate-loader"></span>
          <span className="circle animation-delay-200 animate-loader"></span>
          <span className="circle animation-delay-400 animate-loader"></span>
        </div>
        <div className="absolute bottom-0 left-0">
          <Image
            src={"/imgs/clayno-loading.svg"}
            alt="loading"
            width={700}
            height={200}
          />
        </div>
        <button className="absolute bottom-14 right-12">
          <div className="flex items-center justify-center  text-sm">
            <p>Continue</p>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </>
  );
};
