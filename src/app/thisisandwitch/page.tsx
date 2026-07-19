"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { ArrowLeft, Layout, PenLine } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import AddPostForm from "@/components/AddPostForm";
import AddProjectForm from "@/components/AddProjectForm";
import PostManager from "@/components/mission-control/PostManager";
import ProfilePanel from "@/components/mission-control/ProfilePanel";
import ProjectManager from "@/components/mission-control/ProjectManager";

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
  const projects = useQuery(api.projects.getProjects);
  const posts = useQuery(api.posts.listAll);
  const profile = useQuery(api.profile.get);
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/thisisandwitch/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black">
      <header className="bg-black text-white py-6 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white text-black p-2 rounded-sm font-mono text-xs font-bold">
            AND-WITCH
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-widest">
              Mission Control
            </h1>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              Command &amp; Control Center // Internal Use Only
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:text-gray-300 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Public Site
          </Link>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12">
        <aside className="space-y-8">
          <ProfilePanel profile={profile} />
          <section className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
              <Layout size={18} className="text-gray-400" />
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold">
                New Mission
              </h2>
            </div>
            <AddProjectForm />
          </section>
          <section className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
              <PenLine size={18} className="text-gray-400" />
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold">
                New Log
              </h2>
            </div>
            <AddPostForm />
          </section>
        </aside>

        <div className="space-y-12">
          <ProjectManager projects={projects} />
          <PostManager posts={posts} />
        </div>
      </main>
    </div>
  );
}

function MissionControlLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 text-black">
      <div className="font-mono text-xs uppercase tracking-widest text-gray-400">
        Verifying clearance...
      </div>
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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6 text-black">
      <section className="w-full max-w-md border border-red-200 bg-white p-8 text-center shadow-sm">
        <div className="font-mono text-xs uppercase tracking-widest text-red-600">
          Clearance denied
        </div>
        <h1 className="mt-4 text-2xl font-bold">Unauthorized Account</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          This authenticated account is not configured as the Mission Control
          administrator.
        </p>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="mt-8 w-full bg-black px-4 py-3 font-mono text-xs uppercase tracking-widest text-white hover:bg-gray-800"
        >
          Sign Out
        </button>
      </section>
    </main>
  );
}
