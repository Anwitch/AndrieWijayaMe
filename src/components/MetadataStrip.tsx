"use client";

import EditableText from "./EditableText";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MetadataStrip({
  isPublic = false,
}: {
  isPublic?: boolean;
}) {
  const profile = useQuery(api.profile.get);
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
      value: "Full-stack Development",
      isStatic: true,
    },
    {
      label: "Current Focus",
      value: "Next.js & Cloud Architecture",
      isStatic: true,
    },
  ];

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-gray-200 py-6 my-8 animate-fade-in-up">
      {metadata.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
            {item.label}
          </span>
          <span className="text-sm font-medium text-black">
            {item.isStatic || isPublic ? (
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
