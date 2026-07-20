export interface SiteSettings {
  siteName: string;
  seoTitle: string;
  seoDescription: string;
  navAboutLabel: string;
  navAboutVisible: boolean;
  navProjectsLabel: string;
  navProjectsVisible: boolean;
  navWritingLabel: string;
  navWritingVisible: boolean;
  footerText: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Andrie Wijaya",
  seoTitle: "Andrie Wijaya — Merancang Solusi dari Masalah Nyata",
  seoDescription:
    "Aku mendokumentasikan proses memahami masalah dunia nyata, lalu merancang bagaimana teknologi bisa menyelesaikannya. Problem solving, bukan sekadar coding.",
  navAboutLabel: "About",
  navAboutVisible: true,
  navProjectsLabel: "Projects",
  navProjectsVisible: true,
  navWritingLabel: "Writing",
  navWritingVisible: true,
  footerText: "Mission Control: Restricted",
};
