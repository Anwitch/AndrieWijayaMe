"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Settings2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { SiteSettings } from "@/lib/site-settings";
import {
  Button,
  FeedbackNote,
  Panel,
  Skeleton,
  inputClass,
  labelClass,
} from "@/components/ui";
import { getErrorMessage } from "@/lib/errors";

export default function SiteSettingsPanel({
  settings,
}: {
  settings: SiteSettings | undefined;
}) {
  if (!settings) {
    return (
      <section
        className="rounded-sm border border-line bg-paper p-6 shadow-sm"
        aria-label="Loading site settings"
      >
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10" />
          <Skeleton className="h-24" />
        </div>
      </section>
    );
  }

  return <SiteSettingsForm initialSettings={settings} />;
}

function SiteSettingsForm({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const [form, setForm] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const updateSettings = useMutation(api.siteSettings.update);
  const router = useRouter();

  const setField = <K extends keyof SiteSettings>(
    field: K,
    value: SiteSettings[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);
    try {
      await updateSettings(form);
      setMessage("Site settings saved.");
      router.refresh();
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, "Failed to save site settings."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Panel icon={<Settings2 size={18} className="text-ink-muted" />} title="Site Settings">
      <form onSubmit={handleSubmit} className="space-y-5">
        <SettingsField
          id="site-name"
          label="Site / Display Name"
          value={form.siteName}
          maxLength={80}
          disabled={isSaving}
          onChange={(value) => setField("siteName", value)}
        />
        <SettingsField
          id="seo-title"
          label="SEO Title"
          value={form.seoTitle}
          maxLength={160}
          disabled={isSaving}
          onChange={(value) => setField("seoTitle", value)}
        />
        <SettingsField
          id="seo-description"
          label="SEO Description"
          value={form.seoDescription}
          maxLength={320}
          multiline
          disabled={isSaving}
          onChange={(value) => setField("seoDescription", value)}
        />

        <fieldset className="space-y-3 border-t border-line pt-5">
          <legend className={labelClass}>Navigation</legend>
          <NavigationField
            id="nav-about"
            label="About"
            value={form.navAboutLabel}
            visible={form.navAboutVisible}
            disabled={isSaving}
            onValueChange={(value) => setField("navAboutLabel", value)}
            onVisibleChange={(value) => setField("navAboutVisible", value)}
          />
          <NavigationField
            id="nav-projects"
            label="Projects"
            value={form.navProjectsLabel}
            visible={form.navProjectsVisible}
            disabled={isSaving}
            onValueChange={(value) => setField("navProjectsLabel", value)}
            onVisibleChange={(value) => setField("navProjectsVisible", value)}
          />
          <NavigationField
            id="nav-writing"
            label="Writing"
            value={form.navWritingLabel}
            visible={form.navWritingVisible}
            disabled={isSaving}
            onValueChange={(value) => setField("navWritingLabel", value)}
            onVisibleChange={(value) => setField("navWritingVisible", value)}
          />
        </fieldset>

        <SettingsField
          id="footer-text"
          label="Footer Status"
          value={form.footerText}
          maxLength={240}
          disabled={isSaving}
          required={false}
          onChange={(value) => setField("footerText", value)}
        />

        {error && <FeedbackNote tone="error">{error}</FeedbackNote>}
        {message && <FeedbackNote tone="success">{message}</FeedbackNote>}

        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? "Saving Settings..." : "Save Site Settings"}
        </Button>
      </form>
    </Panel>
  );
}

function SettingsField({
  id,
  label,
  value,
  maxLength,
  disabled,
  multiline = false,
  required = true,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  maxLength: number;
  disabled: boolean;
  multiline?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const sharedProps = {
    id,
    value,
    maxLength,
    disabled,
    required,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    className: inputClass,
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-4">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <span className="font-mono text-xs text-ink-faint">
          {value.length}/{maxLength}
        </span>
      </div>
      {multiline ? (
        <textarea {...sharedProps} rows={4} />
      ) : (
        <input {...sharedProps} type="text" />
      )}
    </div>
  );
}

function NavigationField({
  id,
  label,
  value,
  visible,
  disabled,
  onValueChange,
  onVisibleChange,
}: {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  disabled: boolean;
  onValueChange: (value: string) => void;
  onVisibleChange: (value: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-3">
      <SettingsField
        id={id}
        label={`${label} Label`}
        value={value}
        maxLength={32}
        disabled={disabled}
        onChange={onValueChange}
      />
      <label
        className={`flex h-10 items-center gap-2 border border-line px-3 ${labelClass}`}
      >
        <input
          type="checkbox"
          checked={visible}
          disabled={disabled}
          onChange={(event) => onVisibleChange(event.target.checked)}
        />
        Visible
      </label>
    </div>
  );
}
