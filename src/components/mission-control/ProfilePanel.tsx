"use client";

import { useMutation } from "convex/react";
import { User } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import EditableText from "@/components/EditableText";
import ProfileImageEditor from "@/components/mission-control/ProfileImageEditor";

interface ProfilePanelProps {
  profile: FunctionReturnType<typeof api.profile.get> | undefined;
}

export default function ProfilePanel({ profile }: ProfilePanelProps) {
  const updateProfile = useMutation(api.profile.update);

  if (profile === undefined) {
    return (
      <section
        className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm"
        aria-label="Loading profile"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-100" />
          <div className="h-24 bg-gray-100" />
          <div className="h-8 bg-gray-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
        <User size={18} className="text-gray-400" />
        <h2 className="font-mono text-xs uppercase tracking-widest font-bold">
          Profile Identity
        </h2>
      </div>

      <div className="space-y-6">
        <ProfileImageEditor profile={profile} />

        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
            Bio Summary
          </div>
          <div className="text-sm bg-gray-50 p-4 border border-dashed border-gray-200 rounded-sm italic">
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
        </div>
      </div>
    </section>
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
      <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </div>
      <EditableText label={label} value={value} onSave={onSave} />
    </div>
  );
}
