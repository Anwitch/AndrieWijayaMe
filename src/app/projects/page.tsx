import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import ProjectsArchive from "@/components/ProjectsArchive";

export default async function ProjectsPage() {
  const initialPage = await fetchQuery(api.projects.listPublished, {
    paginationOpts: { numItems: 50, cursor: null },
  });

  return <ProjectsArchive initialPage={initialPage} />;
}
