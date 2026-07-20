"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePaginatedQuery, useQuery } from "convex/react";
import { ArrowLeft, Layout, PenLine } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import AddPostForm from "@/components/AddPostForm";
import AddProjectForm from "@/components/AddProjectForm";
import PostManager from "@/components/mission-control/PostManager";
import ProfilePanel from "@/components/mission-control/ProfilePanel";
import ProjectManager from "@/components/mission-control/ProjectManager";
import SiteSettingsPanel from "@/components/mission-control/SiteSettingsPanel";
import MediaManager from "@/components/mission-control/MediaManager";
import { Button, Eyebrow, Panel } from "@/components/ui";

export default function MissionControl() {
  const isAdmin = useQuery(api.admin.isCurrentUserAdmin);

  if (isAdmin === undefined) {
    return <MissionControlLoading />;
  }

  if (!isAdmin) {
    return <UnauthorizedMissionControl />;
  }

  return <MissionControlContent />;
}

function MissionControlContent() {
  const {
    results: projects,
    status: projectStatus,
    loadMore: loadMoreProjects,
  } = usePaginatedQuery(api.projects.listAll, {}, { initialNumItems: 50 });
  const {
    results: posts,
    status: postStatus,
    loadMore: loadMorePosts,
  } = usePaginatedQuery(api.posts.listAll, {}, { initialNumItems: 50 });
  const profile = useQuery(api.profile.get);
  const siteSettings = useQuery(api.siteSettings.get);
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/thisisandwitch/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <header className="bg-ink text-paper py-6 px-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-paper text-ink p-2 rounded-sm font-mono text-xs font-semibold">
            AND-WITCH
          </div>
          <div>
            <h1 className="text-xl font-semibold uppercase tracking-widest">
              Mission Control
            </h1>
            <p className="font-mono text-xs text-ink-faint uppercase tracking-widest">
              Command &amp; Control Center // Internal Use Only
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-ink-faint transition-colors"
          >
            <ArrowLeft size={14} /> Back to Public Site
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="font-mono text-xs uppercase tracking-widest text-ink-faint hover:text-paper"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12">
        <aside className="space-y-8">
          <ProfilePanel profile={profile} />
          <SiteSettingsPanel settings={siteSettings} />
          <Panel
            icon={<Layout size={18} className="text-ink-muted" />}
            title="New Mission"
          >
            <AddProjectForm />
          </Panel>
          <Panel
            icon={<PenLine size={18} className="text-ink-muted" />}
            title="New Log"
          >
            <AddPostForm />
          </Panel>
        </aside>

        <div className="space-y-12">
          <MediaManager />
          <ProjectManager
            projects={
              projectStatus === "LoadingFirstPage" ? undefined : projects
            }
            status={projectStatus}
            onLoadMore={() => loadMoreProjects(50)}
          />
          <PostManager
            posts={postStatus === "LoadingFirstPage" ? undefined : posts}
            status={postStatus}
            onLoadMore={() => loadMorePosts(50)}
          />
        </div>
      </main>
    </div>
  );
}

function MissionControlLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-ink">
      <Eyebrow>Verifying clearance...</Eyebrow>
    </main>
  );
}

function UnauthorizedMissionControl() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/thisisandwitch/login");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 text-ink">
      <section className="w-full max-w-md rounded-sm border border-danger-line bg-paper p-8 text-center shadow-sm">
        <Eyebrow as="div" className="text-danger">
          Clearance denied
        </Eyebrow>
        <h1 className="mt-4 text-2xl font-semibold">Unauthorized Account</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          This authenticated account is not configured as the Mission Control
          administrator.
        </p>
        <Button
          type="button"
          onClick={() => void handleSignOut()}
          className="mt-8 w-full"
        >
          Sign Out
        </Button>
      </section>
    </main>
  );
}
