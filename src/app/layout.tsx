import { Navbar } from "@/components/headers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fireblocks",
  description: "Remove the complexity of working with digital assets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div>
            <Navbar />
            <div>{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
