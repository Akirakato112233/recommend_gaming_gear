"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDiagnosticFeedback } from "../diagnostic-feedback";
import {
  diagnosticRoutes,
  emptyDiagnosticProgress,
  getDiagnosticProgress,
  type DiagnosticProgress,
} from "../diagnostic-progress";
import {
  type MouseFitProfileDraft,
  getInitialProfile,
} from "../profile-draft";

type MouseCatalogResponse = {
  id: string;
  name_mouse: string;
  price_thb: number | null;
  web_price_ref: { store: string; url: string; checked_at: string } | null;
  grip: string[];
};

type RagChunkResponse = {
  id: string;
  mouse_id: string;
  mouse_name: string;
  topic: string;
  content: string;
};

type SummaryResponse = {
  summary: string;
  candidate_mouse_ids: string[];
  evidence_chunks: RagChunkResponse[];
};

type AnalysisState = {
  stage: "idle" | "filtering" | "summarizing" | "done" | "error";
  error: string;
  summary: SummaryResponse | null;
  candidateMice: MouseCatalogResponse[];
};

const DEFAULT_STATE: AnalysisState = {
  stage: "idle",
  error: "",
  summary: null,
  candidateMice: [],
};

function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:3001/api";
  }

  return `${window.location.protocol}//${window.location.hostname}:3001/api`;
}

function getTextValue(value: string | undefined) {
  return value?.trim() ?? "";
}

function isPositiveNumber(value: string | undefined) {
  const textValue = getTextValue(value);

  return textValue !== "" && Number(textValue) > 0;
}

function lowerGame(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "valorant") return "valorant";
  if (normalized === "cs2") return "cs2";
  if (normalized === "ow2") return "ow2";
  if (normalized === "apex") return "apex";
  if (normalized === "pubg") return "pubg";
  return "valorant";
}

function lowerGrip(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "palm") return "palm";
  if (normalized === "claw") return "claw";
  if (normalized === "fingertip") return "fingertip";
  return "hybrid";
}

function inferPreferredShape(profile: MouseFitProfileDraft) {
  const grip = lowerGrip(profile.gripStyle);
  if (grip === "palm") return "ergonomic";
  if (grip === "claw" || grip === "fingertip") return "symmetric";
  return "unknown";
}

function inferConnectivity(profile: MouseFitProfileDraft) {
  const wantsWireless =
    profile.primaryPreference === "wireless" ||
    profile.secondaryPreference === "wireless" ||
    profile.likedFeatures.includes("wireless");

  return wantsWireless ? "wireless_only" : "any";
}

function buildDraftClientContext(profile: MouseFitProfileDraft) {
  const lines = [
    `sensitivity: ${getTextValue(profile.sensitivity) || "-"}`,
    `liked features: ${
      profile.likedFeatures.length ? profile.likedFeatures.join(", ") : "-"
    }`,
    `liked features comment: ${getTextValue(profile.likedFeaturesComment) || "-"}`,
    `disliked features: ${
      profile.dislikedFeatures.length ? profile.dislikedFeatures.join(", ") : "-"
    }`,
    `disliked features comment: ${getTextValue(profile.dislikedFeaturesComment) || "-"}`,
    `primary preference: ${getTextValue(profile.primaryPreference) || "-"}`,
    `secondary preference: ${getTextValue(profile.secondaryPreference) || "-"}`,
    `budget min thb: ${getTextValue(profile.budgetMinThb) || "-"}`,
    `budget max thb: ${getTextValue(profile.budgetMaxThb) || "-"}`,
  ];

  return lines.join("\n");
}

function buildBackendProfile(profile: MouseFitProfileDraft) {
  const budgetMin = Number(profile.budgetMinThb);
  const budgetMax = Number(profile.budgetMaxThb);

  return {
    game: lowerGame(profile.game),
    dpi: Number(profile.dpi),
    grip_style: lowerGrip(profile.gripStyle),
    hand_length_mm: Number(profile.handLengthMm),
    hand_width_mm: Number(profile.handWidthMm),
    current_mouse: {
      mouse_name: getTextValue(profile.currentMouse),
      likes: [
        ...profile.likedFeatures,
        getTextValue(profile.likedFeaturesComment),
      ].filter(Boolean),
      dislikes: [
        ...profile.dislikedFeatures,
        getTextValue(profile.dislikedFeaturesComment),
      ].filter(Boolean),
    },
    preference: {
      preferred_shape: inferPreferredShape(profile),
      connectivity: inferConnectivity(profile),
      budget_min_thb: getTextValue(profile.budgetMinThb)
        ? Number.isFinite(budgetMin)
          ? budgetMin
          : null
        : null,
      budget_max_thb: getTextValue(profile.budgetMaxThb)
        ? Number.isFinite(budgetMax)
          ? budgetMax
          : null
        : null,
      thailand_only: true,
    },
  };
}

function buildFilterQuery(profile: MouseFitProfileDraft) {
  const params = new URLSearchParams();
  params.set("grip_style", lowerGrip(profile.gripStyle));

  if (getTextValue(profile.budgetMinThb)) {
    params.set("min_price_thb", String(Number(profile.budgetMinThb)));
  }
  if (getTextValue(profile.budgetMaxThb)) {
    params.set("max_price_thb", String(Number(profile.budgetMaxThb)));
  }

  return params;
}

function getProfileReadiness(profile: MouseFitProfileDraft) {
  return (
    isPositiveNumber(profile.dpi) &&
    isPositiveNumber(profile.handLengthMm) &&
    isPositiveNumber(profile.handWidthMm) &&
    getTextValue(profile.currentMouse) !== "" &&
    getTextValue(profile.gripStyle) !== ""
  );
}

export default function AnalysisPage() {
  const [profile, setProfile] = useState<MouseFitProfileDraft | null>(null);
  const [diagnosticProgress, setDiagnosticProgress] = useState<DiagnosticProgress>(
    emptyDiagnosticProgress,
  );
  const [diagnosticFeedback, setDiagnosticFeedback] = useState(
    getDiagnosticFeedback(),
  );
  const [state, setState] = useState<AnalysisState>(DEFAULT_STATE);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setProfile(getInitialProfile());
      setDiagnosticProgress(getDiagnosticProgress());
      setDiagnosticFeedback(getDiagnosticFeedback());
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  const readiness = useMemo(
    () => (profile ? getProfileReadiness(profile) : false),
    [profile],
  );

  async function handleAnalyze() {
    if (!profile) {
      return;
    }

    if (!getProfileReadiness(profile)) {
      setState({
        stage: "error",
        error: "ยังกรอก profile ไม่ครบ",
        summary: null,
        candidateMice: [],
      });
      return;
    }

    setState({
      stage: "filtering",
      error: "",
      summary: null,
      candidateMice: [],
    });

    try {
      const apiBase = getApiBaseUrl();
      const filterUrl = new URL(`${apiBase}/mice/filter`);
      const filterQuery = buildFilterQuery(profile);
      filterQuery.forEach((value, key) => {
        filterUrl.searchParams.set(key, value);
      });

      const filterResponse = await fetch(filterUrl.toString());
      if (!filterResponse.ok) {
        throw new Error(`Filter request failed (${filterResponse.status})`);
      }

      const candidateMice = (await filterResponse.json()) as MouseCatalogResponse[];
      if (candidateMice.length === 0) {
        throw new Error("ไม่พบ mouse ที่ผ่าน filter");
      }

      setState((current) => ({
        ...current,
        stage: "summarizing",
        candidateMice,
      }));

      const summaryResponse = await fetch(`${apiBase}/recommendations/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
            profile: buildBackendProfile(profile),
            candidate_mouse_ids: candidateMice.map((mouse) => mouse.id),
            top_k: 8,
            diagnostic_progress: diagnosticProgress,
            diagnostic_feedback: diagnosticFeedback,
            client_context: buildDraftClientContext(profile),
          }),
        });

      if (!summaryResponse.ok) {
        throw new Error(`Summary request failed (${summaryResponse.status})`);
      }

      const summary = (await summaryResponse.json()) as SummaryResponse;
      setState({
        stage: "done",
        error: "",
        summary,
        candidateMice,
      });
    } catch (error) {
      setState({
        stage: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        summary: null,
        candidateMice: [],
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#080807] text-zinc-100">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_18px)]" />
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
        <aside className="border border-zinc-800 bg-black/80 p-5 lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
            Mouse Fit
          </p>
          <h1 className="mt-4 text-4xl font-black leading-none text-white">
            AI analysis
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            รวม profile, diagnostic session, filter results, แล้วให้ qwen3 สรุป
            เป็นคำแนะนำที่อ่านจบในหน้าเดียว
          </p>

          <div className="mt-7 border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Readiness</span>
              <strong className="font-mono text-white">{readiness ? "READY" : "MISSING"}</strong>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              ใช้ข้อมูลจาก session ของ browser นี้เท่านั้น
            </p>
            <Link
              className="mt-4 block border border-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-emerald-400 hover:text-white"
              href="/"
            >
              Back to profile
            </Link>
          </div>

          <section className="mt-7 border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Diagnostics
            </p>
            <div className="mt-4 space-y-2">
              {diagnosticRoutes.map((route) => (
                <div
                  className="flex items-center justify-between border border-zinc-800 px-3 py-2 text-sm"
                  key={route.key}
                >
                  <span>{route.label}</span>
                  <span className="font-mono text-xs uppercase text-emerald-300">
                    {diagnosticProgress[route.key]}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7 border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Session notes
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <KeyValue label="Feedback tests" value={Object.keys(diagnosticFeedback).length} />
              <KeyValue label="Current mouse" value={profile?.currentMouse || "-"} />
              <KeyValue label="Grip" value={profile?.gripStyle || "-"} />
              <KeyValue
                label="Budget"
                value={
                  profile
                    ? `${profile.budgetMinThb || "-"} - ${profile.budgetMaxThb || "-"}`
                    : "-"
                }
              />
            </dl>
          </section>

          <button
            className="mt-7 min-h-11 w-full border border-emerald-400 bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500"
            disabled={!readiness || state.stage === "filtering" || state.stage === "summarizing"}
            type="button"
            onClick={handleAnalyze}
          >
            {state.stage === "filtering" || state.stage === "summarizing"
              ? "Analyzing..."
              : "Run AI analysis"}
          </button>
        </aside>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="border border-zinc-800 bg-black/80 p-5 sm:p-6">
            <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Live summary
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">AI readout</h2>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
                {state.stage.toUpperCase()}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <InfoBand
                label="Profile"
                value={
                  profile
                    ? `${profile.game} / ${profile.gripStyle} / ${profile.handLengthMm} x ${profile.handWidthMm} mm`
                    : "-"
                }
              />
              <InfoBand
                label="Filter candidates"
                value={`${state.candidateMice.length}`}
              />
              <InfoBand
                label="Diagnostics sent"
                value={`${Object.keys(diagnosticFeedback).length}`}
              />
              <InfoBand
                label="Current mouse"
                value={profile?.currentMouse || "-"}
              />
            </div>

            {state.error && (
              <div className="mt-6 border border-red-400/30 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
                {state.error}
              </div>
            )}

            {state.summary ? (
              <div className="mt-6 grid gap-6">
                <section className="border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    AI answer
                  </p>
                  <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-100">
                    {state.summary.summary}
                  </pre>
                </section>

                <section className="border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    Evidence chunks
                  </p>
                  <div className="mt-4 space-y-3">
                    {state.summary.evidence_chunks.map((chunk, index) => (
                      <article
                        className="border border-zinc-800 bg-black p-4"
                        key={chunk.id}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-zinc-100">
                            {index + 1}. {chunk.mouse_name}
                          </h3>
                          <span className="font-mono text-xs uppercase text-emerald-300">
                            {chunk.topic}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">
                          {chunk.content}
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-600">
                          {chunk.mouse_id}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="mt-6 border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-500">
                กดปุ่มด้านซ้ายเพื่อให้ระบบ filter mouse ก่อน แล้วค่อยส่ง evidence
                ให้ qwen3 สรุปผล
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Candidate mice
              </p>
              <div className="mt-4 space-y-3">
                {state.candidateMice.length > 0 ? (
                  state.candidateMice.map((mouse) => (
                    <div className="border border-zinc-800 bg-black p-3" key={mouse.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-zinc-100">
                            {mouse.name_mouse}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                            {mouse.grip.join(" / ")}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-emerald-300">
                          {mouse.price_thb ? `${mouse.price_thb} THB` : "-"}
                        </span>
                      </div>
                      <p className="mt-2 break-all text-xs uppercase tracking-[0.16em] text-zinc-600">
                        {mouse.id}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-zinc-500">
                    ยังไม่มี candidate ต้องรัน analysis ก่อน
                  </p>
                )}
              </div>
            </section>

            <section className="border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Prompt inputs
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <KeyValue
                  label="Preferred shape"
                  value={profile ? inferPreferredShape(profile) : "-"}
                />
                <KeyValue
                  label="Connectivity"
                  value={profile ? inferConnectivity(profile) : "-"}
                />
                <KeyValue
                  label="Client context"
                  value={profile ? "included" : "-"}
                />
              </dl>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function InfoBand({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 font-mono text-sm leading-6 text-zinc-100">{value}</p>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-900 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-sm text-zinc-500">{label}</dt>
      <dd className="text-right font-mono text-sm text-zinc-100">{value}</dd>
    </div>
  );
}
