"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BASELINE_GAME,
  BASELINE_SENSITIVITY,
  type MouseFitProfileDraft,
  emptyProfile,
  getAimSensitivityScale,
  getInitialProfile,
  saveProfileDraft,
  supportedGames,
} from "./profile-draft";

type DiagnosticProfileControlsProps = {
  onProfileChange: () => void;
};

export function DiagnosticProfileControls({
  onProfileChange,
}: DiagnosticProfileControlsProps) {
  const [profile, setProfile] = useState<MouseFitProfileDraft>(emptyProfile);
  const aimScale = useMemo(() => getAimSensitivityScale(profile), [profile]);

  useEffect(() => {
    const loadProfileTimer = window.setTimeout(() => {
      setProfile(getInitialProfile());
    }, 0);

    return () => window.clearTimeout(loadProfileTimer);
  }, []);

  function updateProfile(field: "game" | "sensitivity", value: string) {
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
        Aim input
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-zinc-400">Game</span>
          <select
            className="input-control min-h-10 text-sm"
            value={profile.game}
            onChange={(event) => updateProfile("game", event.target.value)}
          >
            {supportedGames.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-zinc-400">Sens</span>
          <input
            className="input-control min-h-10 text-sm"
            inputMode="decimal"
            min="0"
            placeholder="0.5"
            step="0.001"
            type="number"
            value={profile.sensitivity}
            onChange={(event) => updateProfile("sensitivity", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-3 text-xs">
        <span className="font-mono text-zinc-300">
          {profile.game} sens {profile.sensitivity || "-"}
        </span>
        <span className="font-mono text-emerald-300">
          {aimScale.toFixed(2)}x vs {BASELINE_GAME} {BASELINE_SENSITIVITY}
        </span>
      </div>
    </div>
  );
}
