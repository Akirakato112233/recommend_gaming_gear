export const PROFILE_DRAFT_STORAGE_KEY = "mouse-fit-profile-draft";
export const BASELINE_DPI = 800;
export const BASELINE_MOUSE_DEGREES_PER_COUNT = 0.035;

export const supportedGames = ["CS2", "Valorant", "OW2", "Apex"] as const;

type SupportedGame = (typeof supportedGames)[number];

export type MouseFitProfileDraft = {
  game: string;
  dpi: string;
  gripStyle: string;
  handLengthMm: string;
  handWidthMm: string;
  currentMouse: string;
  likedFeatures: string[];
  dislikedFeatures: string[];
  likedFeaturesComment: string;
  dislikedFeaturesComment: string;
  primaryPreference: string;
  secondaryPreference: string;
  budgetMinThb: string;
  budgetMaxThb: string;
};

export const emptyProfile: MouseFitProfileDraft = {
  game: "Valorant",
  dpi: "",
  gripStyle: "Claw",
  handLengthMm: "",
  handWidthMm: "",
  currentMouse: "",
  likedFeatures: [],
  dislikedFeatures: [],
  likedFeaturesComment: "",
  dislikedFeaturesComment: "",
  primaryPreference: "control",
  secondaryPreference: "",
  budgetMinThb: "",
  budgetMaxThb: "",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toPositiveNumber(value: string) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return null;
  }

  return numberValue;
}

function isSupportedGame(game: string): game is SupportedGame {
  return supportedGames.includes(game as SupportedGame);
}

function normalizeProfileDraft(profile: Partial<MouseFitProfileDraft>): MouseFitProfileDraft {
  const game = profile.game ?? "";

  return {
    game: isSupportedGame(game) ? game : emptyProfile.game,
    dpi: profile.dpi ?? emptyProfile.dpi,
    gripStyle: profile.gripStyle ?? emptyProfile.gripStyle,
    handLengthMm: profile.handLengthMm ?? emptyProfile.handLengthMm,
    handWidthMm: profile.handWidthMm ?? emptyProfile.handWidthMm,
    currentMouse: profile.currentMouse ?? emptyProfile.currentMouse,
    likedFeatures: Array.isArray(profile.likedFeatures) ? profile.likedFeatures : [],
    dislikedFeatures: Array.isArray(profile.dislikedFeatures) ? profile.dislikedFeatures : [],
    likedFeaturesComment: profile.likedFeaturesComment ?? emptyProfile.likedFeaturesComment,
    dislikedFeaturesComment:
      profile.dislikedFeaturesComment ?? emptyProfile.dislikedFeaturesComment,
    primaryPreference: profile.primaryPreference ?? emptyProfile.primaryPreference,
    secondaryPreference: profile.secondaryPreference ?? emptyProfile.secondaryPreference,
    budgetMinThb: profile.budgetMinThb ?? emptyProfile.budgetMinThb,
    budgetMaxThb: profile.budgetMaxThb ?? emptyProfile.budgetMaxThb,
  };
}

export function calculateDpiScale(profile: Pick<MouseFitProfileDraft, "dpi">) {
  const dpi = toPositiveNumber(profile.dpi);

  if (dpi === null) {
    return 1;
  }

  return clamp(dpi / BASELINE_DPI, 0.35, 3);
}

export function getInitialProfile(): MouseFitProfileDraft {
  if (typeof window === "undefined") {
    return emptyProfile;
  }

  const savedDraft = window.sessionStorage.getItem(PROFILE_DRAFT_STORAGE_KEY);
  if (!savedDraft) {
    return emptyProfile;
  }

  try {
    return normalizeProfileDraft({ ...emptyProfile, ...JSON.parse(savedDraft) });
  } catch {
    window.sessionStorage.removeItem(PROFILE_DRAFT_STORAGE_KEY);
    return emptyProfile;
  }
}

export function saveProfileDraft(profile: MouseFitProfileDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    PROFILE_DRAFT_STORAGE_KEY,
    JSON.stringify(normalizeProfileDraft(profile)),
  );
}

export function getStoredMouseRadiansPerCount() {
  const dpiScale = calculateDpiScale(getInitialProfile());
  const degreesPerCount = BASELINE_MOUSE_DEGREES_PER_COUNT * dpiScale;

  return degreesPerCount * (Math.PI / 180);
}
