"use server";

import { readFileSync } from "fs";

export const getAPISec = async () => {
  const apiSecret = readFileSync("fireblocks_secret.key", "utf8");

  return apiSecret;
};
