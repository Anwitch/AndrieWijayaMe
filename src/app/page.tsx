import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import HomeContent from "@/components/HomeContent";

export default async function Home() {
  const preloadedProfile = await preloadQuery(api.profile.get, {});
  return <HomeContent preloadedProfile={preloadedProfile} />;
}
