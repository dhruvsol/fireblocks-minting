import React from "react";

interface Props {
  heading: string;
  subheading: string;
  points: string[];
}
export const SideCard = () => {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-between bg-[#171717] px-20 pt-20">
        <div className="flex flex-col justify-start gap-3">
          <div className="flex items-center justify-start gap-2 text-base font-semibold uppercase text-indigo-400">
            <div>
              <svg
                className="h-6 w-6"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.5 12H5.50002V13H10.5V12Z" fill="#818CF8" />
                <path d="M9.50002 14H6.50002V15H9.50002V14Z" fill="#818CF8" />
                <path
                  d="M8.00002 1C6.67394 1 5.40217 1.52678 4.46449 2.46447C3.52681 3.40215 3.00002 4.67392 3.00002 6C2.96621 6.72667 3.10541 7.45098 3.40617 8.11335C3.70693 8.77572 4.16066 9.35722 4.73002 9.81C5.23002 10.275 5.50002 10.54 5.50002 11H6.50002C6.50002 10.08 5.94502 9.565 5.40502 9.07C4.9377 8.71213 4.56526 8.24514 4.32031 7.70992C4.07537 7.1747 3.96539 6.58759 4.00002 6C4.00002 4.93913 4.42145 3.92172 5.1716 3.17157C5.92174 2.42143 6.93916 2 8.00002 2C9.06089 2 10.0783 2.42143 10.8285 3.17157C11.5786 3.92172 12 4.93913 12 6C12.0341 6.58802 11.9233 7.17541 11.6775 7.71067C11.4317 8.24592 11.0583 8.71267 10.59 9.07C10.055 9.57 9.50002 10.07 9.50002 11H10.5C10.5 10.54 10.765 10.275 11.27 9.805C11.839 9.35299 12.2925 8.77235 12.5933 8.11085C12.894 7.44935 13.0334 6.72589 13 6C13 5.34339 12.8707 4.69321 12.6194 4.08658C12.3681 3.47995 11.9998 2.92876 11.5356 2.46447C11.0713 2.00017 10.5201 1.63188 9.91344 1.3806C9.30681 1.12933 8.65663 1 8.00002 1Z"
                  fill="#818CF8"
                />
              </svg>
            </div>
            <p>What’s happening here</p>
          </div>
          <h1 className="text-5xl font-extrabold text-white">
            Determine Quantity
          </h1>
          <p className="text-base font-normal text-[#A3A3A3]">
            Here is where the interface asks the user to input a number or slide
            to indicate the amount of NFTs they want to mint. The interface
            provides feedback on unit and total price of the minting.
          </p>
        </div>
        <div className="flex h-20 w-full flex-col justify-start gap-4  ">
          <div className="flex items-center justify-start gap-2  text-base font-semibold uppercase text-indigo-400">
            <div>
              <svg
                className="h-6 w-6"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5 8.00002L12 11.5L11.295 10.795L14.085 8.00002L11.295 5.20502L12 4.50002L15.5 8.00002Z"
                  fill="#818CF8"
                />
                <path
                  d="M0.5 8.00002L4 4.50002L4.705 5.20502L1.915 8.00002L4.705 10.795L4 11.5L0.5 8.00002Z"
                  fill="#818CF8"
                />
                <path
                  d="M8.81944 3.00049L6.20925 12.7418L7.17518 13.0007L9.78537 3.25931L8.81944 3.00049Z"
                  fill="#818CF8"
                />
              </svg>
            </div>
            <p>Backend Steps</p>
          </div>
          <div className="flex  gap-12 pl-3 ">
            <div className="h-full w-0.5 border border-[#737373]" />
            <div className="w-full ">
              <ol className="list-decimal space-y-3 text-base font-normal text-white">
                <li>Users select how many NFTs they would like to mint.</li>
                <li>
                  An API call is made to our backend server to create a
                  transaction.
                </li>
                <li>
                  The Transaction is sent to Fireblocks to sign and send to
                  network.
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className="h-96 w-full border border-red-500"></div>
      </div>
    </>
  );
};
