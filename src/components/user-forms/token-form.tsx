import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

export const TokenForm = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className=" flex flex-col items-center justify-center gap-3">
          <Image
            src="/imgs/token.svg"
            alt="mint token"
            width={80}
            height={80}
          />
          <h1 className="text-3xl font-extrabold text-black">
            Let's Create a Token
          </h1>
        </div>
        <form
          onSubmit={() => {}}
          className="mt-6 flex w-full max-w-xl flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Name</label>
            <Input
              placeholder="Super Cool Coin"
              className="h-12 rounded-md  border border-[#525252] bg-transparent px-2 text-black placeholder:text-black "
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Symbol</label>
            <Input
              placeholder="$SCC"
              maxLength={4}
              className="h-12 rounded-md  border border-[#525252] bg-transparent px-2 text-black placeholder:text-black "
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">
              Description{" "}
              <span className="font-normal text-[#525252]">(Optional)</span>
            </label>
            <Textarea
              placeholder="$SCC"
              className="h-12 rounded-md  border border-[#525252] bg-transparent px-2 text-black placeholder:text-black "
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-lg font-bold text-black">
              Token Image
              <span className="font-normal text-[#525252]">
                (JPG or PNG under 1MB)
              </span>
            </label>

            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="dark:hover:bg-bray-800 flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#000000] bg-transparent"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" />
                    <path
                      d="M19.5 18V21H4.5V18H3V21C3 21.3978 3.15804 21.7794 3.43934 22.0607C3.72064 22.342 4.10218 22.5 4.5 22.5H19.5C19.8978 22.5 20.2794 22.342 20.5607 22.0607C20.842 21.7794 21 21.3978 21 21V18H19.5Z"
                      fill="black"
                    />
                    <path
                      d="M19.5 10.5L18.4425 9.4425L12.75 15.1275V1.5H11.25V15.1275L5.5575 9.4425L4.5 10.5L12 18L19.5 10.5Z"
                      fill="black"
                    />
                  </svg>

                  <p className="text-lg text-black">
                    Drag & Drop or Choose file to upload
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">
              Number of Decimals
            </label>
            <Input
              type="number"
              placeholder="6"
              className="h-12 appearance-none  rounded-md border border-[#525252] bg-transparent px-2 text-black placeholder:text-black "
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">
              Number to Mint Now
            </label>
            <Input
              type="number"
              placeholder="10000"
              className="h-12 rounded-md  border border-[#525252] bg-transparent px-2 text-black placeholder:text-black"
            />
          </div>{" "}
          <button type="submit" className="btn h-16 w-full">
            <div className="flex items-center justify-center gap-3 text-center">
              <div>
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.75 1.5C17.0878 1.50275 15.4651 2.00708 14.0942 2.94704C12.7232 3.887 11.6679 5.21881 11.0662 6.7683C10.5841 6.06903 9.93949 5.49727 9.18767 5.10216C8.43584 4.70705 7.59932 4.50041 6.75 4.5H4.5V6.75C4.50155 8.14191 5.05517 9.47637 6.0394 10.4606C7.02363 11.4448 8.35809 11.9985 9.75 12H10.5V18.787C8.7773 18.9554 7.16718 19.7191 5.94675 20.9465L7.00725 22.0071C7.63464 21.3798 8.39333 20.8995 9.22869 20.6006C10.064 20.3018 10.9553 20.192 11.8382 20.279C12.7211 20.3661 13.5737 20.6478 14.3347 21.104C15.0956 21.5602 15.7459 22.1794 16.2387 22.9172L17.4849 22.0826C16.8701 21.1638 16.0593 20.3926 15.111 19.8244C14.1626 19.2562 13.1002 18.9052 12 18.7965V12H12.75C14.9373 11.9975 17.0343 11.1275 18.5809 9.58089C20.1275 8.03425 20.9975 5.93727 21 3.75V1.5H18.75ZM9.75 10.5C8.75579 10.4989 7.80262 10.1034 7.0996 9.4004C6.39658 8.69738 6.00113 7.74421 6 6.75V6H6.75C7.74423 6.00107 8.69744 6.3965 9.40047 7.09953C10.1035 7.80256 10.4989 8.75577 10.5 9.75V10.5H9.75ZM19.5 3.75C19.498 5.5396 18.7862 7.25534 17.5208 8.52078C16.2553 9.78622 14.5396 10.498 12.75 10.5H12V9.75C12.002 7.9604 12.7138 6.24466 13.9792 4.97922C15.2447 3.71378 16.9604 3.00199 18.75 3H19.5V3.75Z"
                    fill="black"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-black">Mint Now!</p>
            </div>
          </button>
        </form>
      </div>
    </>
  );
};
