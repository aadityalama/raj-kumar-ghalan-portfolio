"use client";

import { useState } from "react";

/**
 * Optional company logo URL + file upload with live preview for Experience admin forms.
 */
export function CompanyLogoFields({ defaultUrl = "" }: { defaultUrl?: string }) {
  const [url, setUrl] = useState(defaultUrl);
  const [failed, setFailed] = useState(false);
  const previewUrl = url.trim();
  const showPreview = Boolean(previewUrl) && !failed;

  return (
    <div className="grid gap-3 sm:col-span-2">
      <label className="grid gap-2 text-sm">
        Company Logo URL
        <input
          className="admin-input"
          name="company_logo_url"
          type="url"
          inputMode="url"
          placeholder="https://… (optional)"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setFailed(false);
          }}
        />
      </label>
      <label className="grid gap-2 text-sm">
        Or upload a logo
        <input
          className="admin-input"
          type="file"
          name="company_logo_file"
          accept="image/jpeg,image/png,image/webp,image/gif"
        />
      </label>
      {previewUrl ? (
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center overflow-hidden rounded-lg border border-border bg-white p-1.5">
            {showPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary URLs
              <img
                src={previewUrl}
                alt="Company logo preview"
                className="max-h-full max-w-full object-contain"
                onError={() => setFailed(true)}
              />
            ) : (
              <span className="font-mono text-[10px] uppercase text-subtle">N/A</span>
            )}
          </div>
          <p className="text-xs text-subtle">
            {failed ? "Preview unavailable — check the URL after saving." : "Logo preview"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
