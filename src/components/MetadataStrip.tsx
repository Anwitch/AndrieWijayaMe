"use client";

import EditableText from "./EditableText";
import { Eyebrow } from "@/components/ui";
import { useMutation } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { api } from "../../convex/_generated/api";

export default function MetadataStrip({
  profile,
  isPublic = false,
}: {
  profile: FunctionReturnType<typeof api.profile.get>;
  isPublic?: boolean;
}) {
  const updateProfile = useMutation(api.profile.update);

  const metadata = [
    {
      label: "Status",
      value: profile?.status ?? "Available for Work",
      key: "status",
    },
    {
      label: "Based in",
      value: profile?.location ?? "Pontianak, ID",
      key: "location",
    },
    {
      label: "Specialization",
      value: profile?.specialization ?? "Full-stack Development",
      key: "specialization",
    },
    {
      label: "Current Focus",
      value: profile?.currentFocus ?? "Next.js & Cloud Architecture",
      key: "currentFocus",
    },
  ];

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-line py-6 my-8 animate-fade-in-up">
      {metadata.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <Eyebrow>{item.label}</Eyebrow>
          <span className="text-sm font-medium text-ink">
            {isPublic ? (
              item.value
            ) : (
              <EditableText
                label={item.label}
                value={item.value}
                onSave={async (newValue) => {
                  await updateProfile({ [item.key as string]: newValue });
                }}
              />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
