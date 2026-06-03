"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  diagnosticRoutes,
  emptyDiagnosticProgress,
  getDiagnosticProgress,
} from "./diagnostic-progress";
import {
  type MouseFitProfileDraft,
  emptyProfile,
  getInitialProfile,
  saveProfileDraft,
  supportedGames,
} from "./profile-draft";

const gripOptions = [
  {
    value: "Palm",
    title: "PALM",
    summary: "ฝ่ามือแนบเมาส์มากที่สุด นิ้ววางค่อนข้างราบ",
    cue: "Full palm contact",
    imageAlt: "Palm grip hand position on a gaming mouse",
    imageSrc: "/images/PALM.png",
  },
  {
    value: "Claw",
    title: "CLAW",
    summary: "อุ้งมือแตะท้ายเมาส์ นิ้วงอขึ้นเหมือนเกี่ยวปุ่ม",
    cue: "Arched fingers",
    imageAlt: "Claw grip hand position on a gaming mouse",
    imageSrc: "/images/CLAW.png",
  },
  {
    value: "Fingertip",
    title: "FINGERTIP",
    summary: "ใช้ปลายนิ้วคุมเมาส์เป็นหลัก ฝ่ามือแทบไม่แตะ",
    cue: "Finger control",
    imageAlt: "Fingertip grip hand position on a gaming mouse",
    imageSrc: "/images/FINGERTIP.png",
  },
] as const;
const preferenceOptions = [
  "shape",
  "weight",
  "wireless",
  "control",
  "speed",
  "click",
  "coating",
  "anything",
] as const;
const likedFeatureOptions = [
  "lightweight",
  "shape",
  "click",
  "coating",
  "balance",
  "wireless",
  "control",
] as const;
const dislikedFeatureOptions = [
  "heavy",
  "too large",
  "too small",
  "slippery",
  "hand pain",
  "unstable aim",
  "bad click",
] as const;

function getTextValue(value: string | undefined) {
  return value?.trim() ?? "";
}

function isPositiveNumber(value: string | undefined) {
  const textValue = getTextValue(value);

  return textValue !== "" && Number(textValue) > 0;
}

function toggleItem(items: string[], item: string) {
  if (items.includes(item)) {
    return items.filter((currentItem) => currentItem !== item);
  }

  return [...items, item];
}

function getProfileCompleteness(profile: MouseFitProfileDraft) {
  const requiredFields = [
    profile.game,
    profile.dpi,
    profile.sensitivity,
    profile.gripStyle,
    profile.handLengthMm,
    profile.handWidthMm,
    profile.currentMouse,
    profile.primaryPreference,
  ];
  const completedFields = requiredFields.filter(
    (value) => getTextValue(value) !== "",
  ).length;

  return Math.round((completedFields / requiredFields.length) * 100);
}

export default function Home() {
  const [profile, setProfile] = useState<MouseFitProfileDraft>(emptyProfile);
  const [diagnosticProgress, setDiagnosticProgress] = useState(
    emptyDiagnosticProgress,
  );
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [savedProfile, setSavedProfile] = useState<MouseFitProfileDraft | null>(null);

  useEffect(() => {
    const loadDraftTimer = window.setTimeout(() => {
      setProfile(getInitialProfile());
      setDiagnosticProgress(getDiagnosticProgress());
      setHasLoadedDraft(true);
    }, 0);

    return () => window.clearTimeout(loadDraftTimer);
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft) {
      return;
    }

    saveProfileDraft(profile);
  }, [hasLoadedDraft, profile]);

  const completeness = useMemo(() => getProfileCompleteness(profile), [profile]);
  const isProfileValid = useMemo(() => {
    return (
      isPositiveNumber(profile.dpi) &&
      isPositiveNumber(profile.sensitivity) &&
      isPositiveNumber(profile.handLengthMm) &&
      isPositiveNumber(profile.handWidthMm) &&
      getTextValue(profile.currentMouse) !== "" &&
      getTextValue(profile.primaryPreference) !== ""
    );
  }, [profile]);

  function updateProfile(field: keyof MouseFitProfileDraft, value: string) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  }

  function updateFeatureList(field: "likedFeatures" | "dislikedFeatures", value: string) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: toggleItem(currentProfile[field], value),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isProfileValid) {
      return;
    }

    setSavedProfile(profile);
  }

  return (
    <main className="min-h-screen bg-[#080807] text-zinc-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(245,158,11,0.14),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_18px)]" />
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
        <aside className="border border-zinc-800 bg-black/70 p-5 lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Mouse Fit
          </p>
          <h1 className="mt-4 text-4xl font-black leading-none text-white sm:text-5xl">
            Profile first.
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Thai-first intake สำหรับจับ baseline ก่อนเข้า diagnostic tests.
          </p>

          <div className="mt-7 border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Profile</span>
              <strong className="font-mono text-white">{completeness}%</strong>
            </div>
            <div className="mt-3 h-2 bg-zinc-900">
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <nav aria-label="Diagnostic tests" className="mt-7 space-y-2">
            {diagnosticRoutes.map((route) => (
              <Link
                className="flex min-h-11 items-center justify-between border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                href={route.href}
                key={route.href}
              >
                <span>{route.label}</span>
                <span className="font-mono text-xs uppercase text-emerald-300">
                  {diagnosticProgress[route.key]}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-7 border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
            Anonymous draft. Region locked to Thailand. DB save comes after final
            recommendation.
          </div>
        </aside>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form
            className="border border-zinc-800 bg-black/80 p-5 shadow-2xl sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Anonymous setup
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">Mouse profile</h2>
              </div>
              <button
                className="min-h-11 border border-emerald-400 bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
                disabled={!isProfileValid}
                type="submit"
              >
                Save profile draft
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Game">
                <select
                  className="input-control"
                  value={profile.game}
                  onChange={(event) => updateProfile("game", event.target.value)}
                >
                  {supportedGames.map((game) => (
                    <option key={game} value={game}>
                      {game}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="DPI">
                <input
                  className="input-control"
                  inputMode="numeric"
                  min="1"
                  placeholder="800"
                  type="number"
                  value={profile.dpi}
                  onChange={(event) => updateProfile("dpi", event.target.value)}
                />
              </Field>

              <Field label="Sensitivity">
                <input
                  className="input-control"
                  inputMode="decimal"
                  min="0.001"
                  placeholder="0.2"
                  step="0.001"
                  type="number"
                  value={profile.sensitivity}
                  onChange={(event) =>
                    updateProfile("sensitivity", event.target.value)
                  }
                />
              </Field>

              <Field label="Hand length (mm)">
                <input
                  className="input-control"
                  inputMode="decimal"
                  min="1"
                  placeholder="180"
                  step="0.1"
                  type="number"
                  value={profile.handLengthMm}
                  onChange={(event) => updateProfile("handLengthMm", event.target.value)}
                />
              </Field>

              <Field label="Hand width (mm)">
                <input
                  className="input-control"
                  inputMode="decimal"
                  min="1"
                  placeholder="95"
                  step="0.1"
                  type="number"
                  value={profile.handWidthMm}
                  onChange={(event) => updateProfile("handWidthMm", event.target.value)}
                />
              </Field>

              <Field label="Current mouse" className="md:col-span-2">
                <input
                  className="input-control"
                  placeholder="Logitech G Pro X Superlight"
                  value={profile.currentMouse}
                  onChange={(event) => updateProfile("currentMouse", event.target.value)}
                />
              </Field>
            </div>

            <GripSelector
              selectedGrip={profile.gripStyle}
              onSelect={(gripStyle) => updateProfile("gripStyle", gripStyle)}
            />

            <div className="mt-7 grid gap-5 xl:grid-cols-2">
              <div className="space-y-3">
                <ToggleGroup
                  label="ชอบอะไรในเมาส์เดิม"
                  options={likedFeatureOptions}
                  selectedOptions={profile.likedFeatures}
                  onToggle={(value) => updateFeatureList("likedFeatures", value)}
                />
                <Field label="Comment: ชอบเพราะอะไร">
                  <textarea
                    className="input-control min-h-24 resize-y"
                    placeholder="เช่น ทรงจับง่าย, click ดี, balance เข้ามือ"
                    value={profile.likedFeaturesComment}
                    onChange={(event) =>
                      updateProfile("likedFeaturesComment", event.target.value)
                    }
                  />
                </Field>
              </div>
              <div className="space-y-3">
                <ToggleGroup
                  label="ไม่ชอบอะไรในเมาส์เดิม"
                  options={dislikedFeatureOptions}
                  selectedOptions={profile.dislikedFeatures}
                  onToggle={(value) => updateFeatureList("dislikedFeatures", value)}
                />
                <Field label="Comment: ไม่ชอบเพราะอะไร">
                  <textarea
                    className="input-control min-h-24 resize-y"
                    placeholder="เช่น ปวดมือหลังเล่นนาน, เล็กไป, aim ไม่นิ่ง"
                    value={profile.dislikedFeaturesComment}
                    onChange={(event) =>
                      updateProfile("dislikedFeaturesComment", event.target.value)
                    }
                  />
                </Field>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <Field label="Primary preference">
                <select
                  className="input-control"
                  value={profile.primaryPreference}
                  onChange={(event) =>
                    updateProfile("primaryPreference", event.target.value)
                  }
                >
                  {preferenceOptions.map((preference) => (
                    <option key={preference} value={preference}>
                      {preference}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Secondary preference">
                <select
                  className="input-control"
                  value={profile.secondaryPreference}
                  onChange={(event) =>
                    updateProfile("secondaryPreference", event.target.value)
                  }
                >
                  <option value="">Optional</option>
                  {preferenceOptions.map((preference) => (
                    <option key={preference} value={preference}>
                      {preference}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Budget min (THB)">
                <input
                  className="input-control"
                  inputMode="numeric"
                  min="0"
                  placeholder="Optional"
                  type="number"
                  value={profile.budgetMinThb}
                  onChange={(event) => updateProfile("budgetMinThb", event.target.value)}
                />
              </Field>

              <Field label="Budget max (THB)">
                <input
                  className="input-control"
                  inputMode="numeric"
                  min="0"
                  placeholder="Optional"
                  type="number"
                  value={profile.budgetMaxThb}
                  onChange={(event) => updateProfile("budgetMaxThb", event.target.value)}
                />
              </Field>
            </div>
          </form>

          <aside className="space-y-6">
            <section className="border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Profile summary
              </p>
              <dl className="mt-5 space-y-4 text-sm">
                <SummaryRow label="Game" value={profile.game} />
                <SummaryRow label="DPI" value={profile.dpi || "-"} />
                <SummaryRow label="Sensitivity" value={profile.sensitivity || "-"} />
                <SummaryRow label="Grip" value={profile.gripStyle} />
                <SummaryRow
                  label="Hand"
                  value={`${profile.handLengthMm || "-"} x ${profile.handWidthMm || "-"} mm`}
                />
                <SummaryRow label="Mouse" value={profile.currentMouse || "-"} />
                <SummaryRow label="Primary" value={profile.primaryPreference} />
                <SummaryRow
                  label="Secondary"
                  value={profile.secondaryPreference || "-"}
                />
              </dl>
            </section>

            <section className="border border-zinc-800 bg-black p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Next run
              </p>
              <div className="mt-5 grid gap-3">
                {diagnosticRoutes.map((route) => (
                  <Link
                    className="flex min-h-11 items-center justify-between border border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    href={route.href}
                    key={route.href}
                  >
                    <span>{route.label}</span>
                    <span className="font-mono text-xs uppercase text-emerald-300">
                      {diagnosticProgress[route.key]}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section
              aria-live="polite"
              className="border border-emerald-400/40 bg-emerald-400/10 p-5 text-sm leading-6 text-emerald-100"
            >
              {savedProfile
                ? "Profile draft saved in this browser. พร้อมไป diagnostic tests แล้ว."
                : isProfileValid
                  ? "Profile ready. Save draft แล้วค่อยเริ่ม test ได้เลย."
                  : "กรอก required fields ให้ครบก่อน save draft."}
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Field({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

function GripSelector({
  onSelect,
  selectedGrip,
}: {
  onSelect: (gripStyle: string) => void;
  selectedGrip: string;
}) {
  const selectedOption =
    gripOptions.find((option) => option.value === selectedGrip) ?? gripOptions[0];

  return (
    <section className="mt-7 border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex flex-col gap-2 border-b border-zinc-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Grip style</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            เลือกรูปที่ใกล้กับท่าจับเมาส์จริงของคุณที่สุด
          </p>
        </div>
        <p className="font-mono text-sm text-emerald-300">
          Selected: {selectedOption.value}
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {gripOptions.map((option) => {
          const isSelected = option.value === selectedOption.value;

          return (
            <button
              aria-pressed={isSelected}
              className={
                isSelected
                  ? "border border-emerald-400 bg-black p-3 text-left shadow-[0_0_0_1px_rgba(52,211,153,0.45)] transition"
                  : "border border-zinc-800 bg-black p-3 text-left transition hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              }
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
            >
              <div className="relative h-56 overflow-hidden border border-zinc-900 bg-black">
                <Image
                  alt={option.imageAlt}
                  className="object-cover object-top"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  src={option.imageSrc}
                />
              </div>
              <span className="mt-3 block font-mono text-lg font-semibold text-white">
                {option.title}
              </span>
              <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-emerald-300">
                {option.cue}
              </span>
              <span className="mt-2 block text-sm leading-6 text-zinc-400">
                {option.summary}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ToggleGroup({
  label,
  onToggle,
  options,
  selectedOptions,
}: {
  label: string;
  onToggle: (value: string) => void;
  options: readonly string[];
  selectedOptions: string[];
}) {
  return (
    <fieldset className="border border-zinc-800 bg-zinc-950 p-4">
      <legend className="px-1 text-sm font-semibold text-zinc-300">{label}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);

          return (
            <button
              aria-pressed={isSelected}
              className={
                isSelected
                  ? "min-h-11 border border-emerald-400 bg-emerald-400 px-3 py-2 text-sm font-semibold text-black transition"
                  : "min-h-11 border border-zinc-800 bg-black px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
              }
              key={option}
              type="button"
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-zinc-900 pb-3">
      <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</dt>
      <dd className="mt-1 font-mono text-zinc-100">{value}</dd>
    </div>
  );
}
