import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { NavBar } from "~/app/_components/NavBar";

export const metadata: Metadata = {
  title: "Fast Food Delivery & Catering",
  description: "Fast food delivery and catering services",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <NavBar />
          <div className="pt-16 md:pt-20">{children}</div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
