import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import { Hero } from "./_components/Hero";

export default async function Home() {
  return (
    <HydrateClient>
      <Hero />
    </HydrateClient>
  );
}
