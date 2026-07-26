"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Check, Edit2, User, X } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import EditableText from "@/components/EditableText";
import ProfileImageEditor from "@/components/mission-control/ProfileImageEditor";
import { Eyebrow, FeedbackNote, Panel, Skeleton } from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";
import {
  SOCIAL_PLATFORMS,
  type SocialPlatformKey,
} from "@/lib/social-links";

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
        </div>

        <div className="border-t border-line pt-6">
          <Eyebrow as="div" className="mb-4 font-semibold text-ink">
            Education Section
          </Eyebrow>
          <div className="grid grid-cols-1 gap-4">
            <ProfileField
              label="Education Title"
              value={profile?.educationTitle ?? ""}
              onSave={(educationTitle) => updateProfile({ educationTitle })}
            />
            <ProfileField
              label="Education Period"
              value={profile?.educationPeriod ?? ""}
              onSave={(educationPeriod) => updateProfile({ educationPeriod })}
            />
            <div>
              <Eyebrow as="div" className="mb-1">
                Education Description
              </Eyebrow>
              <div className="text-sm bg-surface p-4 border border-dashed border-line rounded-sm italic">
                <EditableText
                  label="Education Description"
                  multiline
                  value={profile?.educationDescription ?? ""}
                  onSave={(educationDescription) =>
                    updateProfile({ educationDescription })
                  }
                />
              </div>
            </div>
            <ProfileField
              label="Education Focus"
              value={profile?.educationFocus ?? ""}
              onSave={(educationFocus) => updateProfile({ educationFocus })}
            />
            <ProfileField
              label="Education Method"
              value={profile?.educationMethod ?? ""}
              onSave={(educationMethod) => updateProfile({ educationMethod })}
            />
            <ProfileField
              label="Education Location"
              value={profile?.educationLocation ?? ""}
              onSave={(educationLocation) =>
                updateProfile({ educationLocation })
              }
            />
          </div>
        </div>

        <div className="border-t border-line pt-6">
          <Eyebrow as="div" className="mb-4 font-semibold text-ink">
            Experience Section
          </Eyebrow>
          <div className="grid grid-cols-1 gap-4">
            <ProfileField
              label="Experience Title"
              value={profile?.experienceTitle ?? ""}
              onSave={(experienceTitle) => updateProfile({ experienceTitle })}
            />
            <ProfileField
              label="Experience Period"
              value={profile?.experiencePeriod ?? ""}
              onSave={(experiencePeriod) =>
                updateProfile({ experiencePeriod })
              }
            />
            <div>
              <Eyebrow as="div" className="mb-1">
                Experience Description
              </Eyebrow>
              <div className="text-sm bg-surface p-4 border border-dashed border-line rounded-sm italic">
                <EditableText
                  label="Experience Description"
                  multiline
                  value={profile?.experienceDescription ?? ""}
                  onSave={(experienceDescription) =>
                    updateProfile({ experienceDescription })
                  }
                />
              </div>
            </div>
            <ProfileField
              label="Experience Role"
              value={profile?.experienceRole ?? ""}
              onSave={(experienceRole) => updateProfile({ experienceRole })}
            />
            <ProfileField
              label="Experience Capabilities"
              value={profile?.experienceCapabilities ?? ""}
              onSave={(experienceCapabilities) =>
                updateProfile({ experienceCapabilities })
              }
            />
            <ProfileField
              label="Experience Base"
              value={profile?.experienceBase ?? ""}
              onSave={(experienceBase) => updateProfile({ experienceBase })}
            />
          </div>
        </div>

        <div>
          <Eyebrow as="div" className="mb-2">
            Social Links
          </Eyebrow>
          <div className="space-y-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <SocialLinkField
                key={platform.key}
                label={platform.label}
                value={profile?.[platform.key] ?? ""}
                onSave={(url) =>
                  updateProfile({ [platform.key]: url } as Partial<
                    Record<SocialPlatformKey, string>
                  >)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function SocialLinkField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (value: string) => Promise<unknown>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setError(null);
    setDraft(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await onSave(draft.trim());
      setIsEditing(false);
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, `Failed to save ${label}. Please try again.`),
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border border-ink rounded-sm p-3 space-y-2 animate-fade-in-up">
        <label
          htmlFor={`social-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          className="font-mono text-[10px] uppercase tracking-widest text-ink-muted"
        >
          {label}
        </label>
        <input
          id={`social-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          type="url"
          disabled={isSaving}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full border-b border-ink py-1 font-mono text-xs outline-none bg-transparent"
          placeholder={`https://... (empty removes ${label})`}
          autoFocus
        />
        {error && <FeedbackNote tone="error">{error}</FeedbackNote>}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="p-1.5 bg-ink text-paper hover:bg-ink-secondary disabled:bg-ink-faint transition-colors rounded-sm"
            title={`Save ${label}`}
          >
            <Check size={14} />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
            className="p-1.5 border border-line-strong hover:bg-surface transition-colors rounded-sm"
            title="Cancel"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 border border-line rounded-sm px-3 py-2">
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          {label}
        </div>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate font-mono text-xs text-ink-secondary hover:text-accent transition-colors"
            title={value}
          >
            {value}
          </a>
        ) : (
          <span className="font-mono text-xs text-ink-faint italic">
            Not set
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={startEditing}
        className="shrink-0 p-1.5 text-ink-muted hover:text-ink border border-transparent hover:border-line rounded-sm transition-colors"
        title={`Edit ${label}`}
      >
        <Edit2 size={14} />
      </button>
    </div>
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
