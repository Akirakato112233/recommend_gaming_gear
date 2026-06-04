export const DIAGNOSTIC_PROGRESS_STORAGE_KEY = "mouse-fit-diagnostic-progress";

export const diagnosticRoutes = [
  { href: "/tracking", key: "tracking", label: "Tracking" },
  { href: "/flick", key: "flick", label: "Flick" },
  { href: "/micro-adjustmest", key: "micro", label: "Micro" },
] as const;

export type DiagnosticKey = (typeof diagnosticRoutes)[number]["key"];
export type DiagnosticStatus = "ready" | "done";
export type DiagnosticProgress = Record<DiagnosticKey, DiagnosticStatus>;

export const emptyDiagnosticProgress: DiagnosticProgress = {
  tracking: "ready",
  flick: "ready",
  micro: "ready",
};

function isDiagnosticKey(value: string): value is DiagnosticKey {
  return diagnosticRoutes.some((route) => route.key === value);
}

function normalizeDiagnosticProgress(value: unknown): DiagnosticProgress {
  if (!value || typeof value !== "object") {
    return emptyDiagnosticProgress;
  }

  const progress = { ...emptyDiagnosticProgress };
  const rawProgress = value as Partial<Record<string, unknown>>;

  for (const [key, status] of Object.entries(rawProgress)) {
    if (isDiagnosticKey(key) && status === "done") {
      progress[key] = "done";
    }
  }

  return progress;
}

export function getDiagnosticProgress(): DiagnosticProgress {
  if (typeof window === "undefined") {
    return emptyDiagnosticProgress;
  }

  const savedProgress = window.sessionStorage.getItem(DIAGNOSTIC_PROGRESS_STORAGE_KEY);
  if (!savedProgress) {
    return emptyDiagnosticProgress;
  }

  try {
    return normalizeDiagnosticProgress(JSON.parse(savedProgress));
  } catch {
    window.sessionStorage.removeItem(DIAGNOSTIC_PROGRESS_STORAGE_KEY);
    return emptyDiagnosticProgress;
  }
}

export function setDiagnosticComplete(key: DiagnosticKey) {
  if (typeof window === "undefined") {
    return;
  }

  const progress = getDiagnosticProgress();
  progress[key] = "done";
  window.sessionStorage.setItem(
    DIAGNOSTIC_PROGRESS_STORAGE_KEY,
    JSON.stringify(progress),
  );
}

export function isDiagnosticComplete(key: DiagnosticKey) {
  return getDiagnosticProgress()[key] === "done";
}
