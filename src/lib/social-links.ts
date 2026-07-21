export interface SocialProfile {
  xUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export const SOCIAL_PLATFORMS = [
  { key: "linkedinUrl", label: "LinkedIn", short: "in" },
  { key: "githubUrl", label: "GitHub", short: "GH" },
  { key: "xUrl", label: "X (Twitter)", short: "X" },
  { key: "instagramUrl", label: "Instagram", short: "IG" },
] as const;

export type SocialPlatformKey = (typeof SOCIAL_PLATFORMS)[number]["key"];

export function socialLinks(profile: SocialProfile | null | undefined) {
  return SOCIAL_PLATFORMS.flatMap((platform) => {
    const href = profile?.[platform.key];
    return href ? [{ ...platform, href }] : [];
  });
}
