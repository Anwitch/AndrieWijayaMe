"use client";

import { useMutation } from "convex/react";
import { User } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import EditableText from "@/components/EditableText";
import ProfileImageEditor from "@/components/mission-control/ProfileImageEditor";
import { Eyebrow, Panel, Skeleton } from "@/components/ui";

interface ProfilePanelProps {
  profile: FunctionReturnType<typeof api.profile.get> | undefined;
}

export default function ProfilePanel({ profile }: ProfilePanelProps) {
  const updateProfile = useMutation(api.profile.update);

  if (profile === undefined) {
    return (
      <section
        className="rounded-sm border border-line bg-paper p-6 shadow-sm"
        aria-label="Loading profile"
      >
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24" />
          <Skeleton className="h-8" />
        </div>
      </section>
    );
  }

  return (
    <Panel icon={<User size={18} className="text-ink-muted" />} title="Profile Identity">
      <div className="space-y-6">
        <ProfileImageEditor profile={profile} />

        <div>
          <Eyebrow as="div" className="mb-1">
            Bio Summary
          </Eyebrow>
          <div className="text-sm bg-surface p-4 border border-dashed border-line rounded-sm italic">
            <EditableText
              label="Bio"
              multiline
              value={profile?.bio ?? ""}
              onSave={(bio) => updateProfile({ bio })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <ProfileField
            label="Tagline"
            value={profile?.tagline ?? ""}
            onSave={(tagline) => updateProfile({ tagline })}
          />
          <ProfileField
            label="Location"
            value={profile?.location ?? ""}
            onSave={(location) => updateProfile({ location })}
          />
          <ProfileField
            label="Status"
            value={profile?.status ?? ""}
            onSave={(status) => updateProfile({ status })}
          />
          <ProfileField
            label="Specialization"
            value={profile?.specialization ?? ""}
            onSave={(specialization) => updateProfile({ specialization })}
          />
          <ProfileField
            label="Current Focus"
            value={profile?.currentFocus ?? ""}
            onSave={(currentFocus) => updateProfile({ currentFocus })}
          />
          <ProfileField
            label="X Profile URL"
            value={profile?.xUrl ?? ""}
            onSave={(xUrl) => updateProfile({ xUrl })}
          />
          <ProfileField
            label="Instagram Profile URL"
            value={profile?.instagramUrl ?? ""}
            onSave={(instagramUrl) => updateProfile({ instagramUrl })}
          />
          <ProfileField
            label="LinkedIn Profile URL"
            value={profile?.linkedinUrl ?? ""}
            onSave={(linkedinUrl) => updateProfile({ linkedinUrl })}
          />
          <ProfileField
            label="GitHub Profile URL"
            value={profile?.githubUrl ?? ""}
            onSave={(githubUrl) => updateProfile({ githubUrl })}
          />
        </div>
      </div>
    </Panel>
  );
}

function ProfileField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (value: string) => Promise<unknown>;
}) {
  return (
    <div>
      <Eyebrow as="div" className="mb-1">
        {label}
      </Eyebrow>
      <EditableText label={label} value={value} onSave={onSave} />
    </div>
  );
}
