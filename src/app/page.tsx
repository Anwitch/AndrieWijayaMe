import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import HomeContent from "@/components/HomeContent";
import { personExperienceSchema } from "@/lib/structured-data";

async function getExperiences(): Promise<Doc<"experiences">[]> {
  try {
    return await fetchQuery(api.experiences.listPublished, {});
  } catch {
    // Convex unreachable or backend not deployed yet — section stays empty.
    return [];
  }
}

export default async function Home() {
  const [preloadedProfile, preloadedProjects, experiences] = await Promise.all([
    preloadQuery(api.profile.get, {}),
    preloadQuery(api.projects.getFeaturedProjects, {}),
    getExperiences(),
  ]);

  return (
    <>
      {experiences.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personExperienceSchema(experiences)),
          }}
        />
      )}
      <HomeContent
        preloadedProfile={preloadedProfile}
        preloadedProjects={preloadedProjects}
        experiences={experiences}
      />
    </>
  );
}
