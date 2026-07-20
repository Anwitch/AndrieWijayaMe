"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Settings2 } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { SiteSettings } from "@/lib/site-settings";
import { getErrorMessage } from "@/lib/errors";

export default function SiteSettingsPanel({
  settings,
}: {
  settings: SiteSettings | undefined;
}) {
  if (!settings) {
    return (
      <section className="border border-gray-200 bg-white p-6 shadow-sm" aria-label="Loading site settings">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-40 bg-gray-100" />
          <div className="h-10 bg-gray-100" />
          <div className="h-24 bg-gray-100" />
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
    <section className="border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-2">
        <Settings2 size={18} className="text-gray-400" />
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest">
          Site Settings
        </h2>
      </div>

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

        <fieldset className="space-y-3 border-t border-gray-100 pt-5">
          <legend className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
            Navigation
          </legend>
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

        {error && (
          <p role="alert" className="border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="border border-green-200 bg-green-50 p-3 text-xs text-green-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-black py-3 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isSaving ? "Saving Settings..." : "Save Site Settings"}
        </button>
      </form>
    </section>
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
    className:
      "w-full border border-gray-200 p-2 text-sm outline-none transition-colors focus:border-black disabled:bg-gray-50",
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-4">
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
          {label}
        </label>
        <span className="font-mono text-[9px] text-gray-300">
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
      <label className="flex h-10 items-center gap-2 border border-gray-200 px-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">
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
