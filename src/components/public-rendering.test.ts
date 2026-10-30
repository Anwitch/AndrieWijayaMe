// @vitest-environment node

import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ConvexProvider, ConvexReactClient, type Preloaded } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { describe, expect, test, vi } from "vitest";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { DEFAULT_SITE_SETTINGS } from "../lib/site-settings";
import HomeContent from "./HomeContent";
import ProjectsArchive from "./ProjectsArchive";

// The shell adds navigation and animation unrelated to the page's data.
vi.mock("@/components/PublicShell", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("@/components/SiteSettingsProvider", () => ({
  useSiteSettings: () => DEFAULT_SITE_SETTINGS,
}));

const project = {
  _id: "project-1" as Id<"projects">,
  _creationTime: 1,
  createdAt: 1,
  title: "Otirra",
  slug: "otirra",
  link: "https://example.com/otirra",
  description: "Pemrosesan data untuk skrining pendengaran bayi.",
  tags: "Python, FPGA",
  year: "2026",
  coverUrl: "https://example.com/otirra.webp",
};

const preloadedProjects = {
  _name: "projects:getFeaturedProjects",
  _argsJSON: {},
  _valueJSON: [project],
} as unknown as Preloaded<typeof api.projects.getFeaturedProjects>;

const profile = {
  _id: "profile-1",
  _creationTime: 1,
  bio: "Merancang solusi dari masalah nyata.",
  tagline: "Product thinker dan problem solver.",
  location: "Pontianak",
  status: "Terbuka untuk kolaborasi",
  linkedinUrl: "https://www.linkedin.com/in/andrie-wijaya",
  githubUrl: "https://github.com/Anwitch",
  avatarUrl: null,
  avatarAltText: null,
};

const preloadedProfile = {
  _name: "profile:get",
  _argsJSON: {},
  _valueJSON: profile,
} as unknown as Preloaded<typeof api.profile.get>;

function renderPage(page: ReactNode) {
  const client = new ConvexReactClient("https://example.convex.cloud");
  try {
    return renderToStaticMarkup(
      createElement(ConvexProvider, { client }, page),
    );
  } finally {
    void client.close();
  }
}

function renderHome() {
  return renderPage(
    createElement(HomeContent, {
      preloadedProfile,
      preloadedProjects,
      experiences: [],
    }),
  );
}

describe("public pages before browser JavaScript loads", () => {
  test("homepage includes project details, cover, and case-study link", () => {
    const html = renderHome();
    expect(html).toContain("Otirra");
    expect(html).toContain(project.description);
    expect(html).toContain('href="/projects/otirra"');
    expect(html).toContain('src="https://example.com/otirra.webp"');
    expect(html).toContain("1 FEATURED MISSIONS");
    expect(html).not.toContain("animate-pulse");
  });

  test("archive includes its server-provided first page without a loading flash", () => {
    const initialPage: FunctionReturnType<typeof api.projects.listPublished> = {
      page: [null, project],
      isDone: true,
      continueCursor: "",
    };
    const html = renderPage(createElement(ProjectsArchive, { initialPage }));
    expect(html).toContain("Otirra");
    expect(html).toContain('href="/projects/otirra"');
    expect(html).not.toContain("animate-pulse");
    expect(html).not.toContain("Load More Missions");
  });

  test("contact links have visible platform names and an explicit contact action", () => {
    const html = renderHome();
    expect(html).toMatch(/<a\b[^>]*href="https:\/\/github.com\/Anwitch"[^>]*>GitHub<\/a>/);
    expect(html).toMatch(/<a\b[^>]*href="https:\/\/www.linkedin.com\/in\/andrie-wijaya"[^>]*>Hubungi[^<]*LinkedIn<\/a>/);
  });

  test("archive does not enable loading more before its live query connects", () => {
    const initialPage: FunctionReturnType<typeof api.projects.listPublished> = {
      page: [project],
      isDone: false,
      continueCursor: "next-page",
    };
    const html = renderPage(createElement(ProjectsArchive, { initialPage }));
    expect(html).toContain("Otirra");
    expect(html).toMatch(/<button\b[^>]*disabled=""[^>]*>Load More Missions<\/button>/);
  });

  test("an exhausted archive with no public projects renders its empty state", () => {
    const initialPage: FunctionReturnType<typeof api.projects.listPublished> = {
      page: [null],
      isDone: true,
      continueCursor: "",
    };
    const html = renderPage(createElement(ProjectsArchive, { initialPage }));
    expect(html).toContain("No missions found in the logs.");
    expect(html).not.toContain("Scanning mission logs");
    expect(html).not.toContain("Load More Missions");
  });

  test("missing education fields describe the university without inventing study dates", () => {
    const html = renderHome();
    const section = html.match(/<section id="pendidikan"[\s\S]*?<\/section>/)?.[0];
    expect(section).toContain("Informatika");
    expect(section).toContain("Universitas Tanjungpura");
    expect(section).not.toContain("Otodidak");
    expect(section).not.toContain("2020");
  });

  test("configured education takes precedence over the fallback", () => {
    const profileWithEducation = {
      ...preloadedProfile,
      _valueJSON: {
        ...profile,
        educationTitle: "Pendidikan dari profil",
        educationPeriod: "2023 — SEKARANG",
        educationDescription: "Deskripsi pendidikan dari profil.",
      },
    } as unknown as Preloaded<typeof api.profile.get>;
    const html = renderPage(
      createElement(HomeContent, {
        preloadedProfile: profileWithEducation,
        preloadedProjects,
        experiences: [],
      }),
    );
    const section = html.match(/<section id="pendidikan"[\s\S]*?<\/section>/)?.[0];
    expect(section).toContain("Pendidikan dari profil");
    expect(section).toContain("2023 — SEKARANG");
    expect(section).toContain("Deskripsi pendidikan dari profil.");
    expect(section).not.toContain("Sedang menempuh studi");
  });
});
