import { NFTStorage, File } from "nft.storage";

import mime from "mime";

import fs from "fs";

import path from "path";

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY as string;

async function fileFromPath(filePath: string) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], path.basename(filePath), { type });
}

export async function storeIMAGE(
  imagePath: string,
  name: string,
  description: string,
) {
  // load the file from disk
  const image = await fileFromPath(imagePath);

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  // call client.store, passing in the image & metadata
  return nftstorage.store({
    image,
    name,
    description,
  });
}
