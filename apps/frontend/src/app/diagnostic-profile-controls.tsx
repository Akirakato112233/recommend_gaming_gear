"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BASELINE_DPI,
  type MouseFitProfileDraft,
  calculateDpiScale,
  emptyProfile,
  getInitialProfile,
  saveProfileDraft,
} from "./profile-draft";

type DiagnosticProfileControlsProps = {
  onProfileChange: () => void;
};

export function DiagnosticProfileControls({
  onProfileChange,
}: DiagnosticProfileControlsProps) {
  const [profile, setProfile] = useState<MouseFitProfileDraft>(emptyProfile);
  const dpiScale = useMemo(() => calculateDpiScale(profile), [profile]);

  useEffect(() => {
    const loadProfileTimer = window.setTimeout(() => {
      setProfile(getInitialProfile());
    }, 0);

    return () => window.clearTimeout(loadProfileTimer);
  }, []);

  function updateProfile(field: "dpi", value: string) {
    const nextProfile = {
      ...profile,
      [field]: value,
    };

    setProfile(nextProfile);
    saveProfileDraft(nextProfile);
    onProfileChange();
  }

  return (
    <div className="mt-5 border border-zinc-800 bg-zinc-950 p-4 text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Mouse input
      </p>
      <div className="mt-3 grid gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-zinc-400">DPI</span>
          <input
            className="input-control min-h-10 text-sm"
            inputMode="numeric"
            min="1"
            placeholder="800"
            step="1"
            type="number"
            value={profile.dpi}
            onChange={(event) => updateProfile("dpi", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-3 text-xs">
        <span className="font-mono text-zinc-300">
          Mouse DPI {profile.dpi || "-"}
        </span>
        <span className="font-mono text-emerald-300">
          {dpiScale.toFixed(2)}x vs {BASELINE_DPI} DPI
        </span>
      </div>
    </div>
  );
}
