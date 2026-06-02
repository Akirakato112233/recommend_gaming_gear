export const PROFILE_DRAFT_STORAGE_KEY = "mouse-fit-profile-draft";
export const BASELINE_EDPI = 400;
export const BASELINE_SENSITIVITY = 0.5;
export const BASELINE_GAME = "Valorant";
export const BASELINE_GAME_YAW = 0.07;
export const BASELINE_ANGULAR_SPEED =
  BASELINE_SENSITIVITY * BASELINE_GAME_YAW;

export const supportedGames = ["CS2", "Valorant", "OW2", "Apex"] as const;

type SupportedGame = (typeof supportedGames)[number];

export type MouseFitProfileDraft = {
  game: string;
  dpi: string;
  sensitivity: string;
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
  sensitivity: "",
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

function getGameYaw(game: string) {
  if (!isSupportedGame(game)) {
    return null;
  }

  const gameYaw: Record<SupportedGame, number> = {
    CS2: 0.022,
    Valorant: BASELINE_GAME_YAW,
    OW2: 0.0066,
    Apex: 0.022,
  };

  return gameYaw[game];
}

function normalizeProfileDraft(profile: MouseFitProfileDraft): MouseFitProfileDraft {
  return {
    ...profile,
    game: isSupportedGame(profile.game) ? profile.game : emptyProfile.game,
  };
}

export function calculateEdpi(profile: Pick<MouseFitProfileDraft, "dpi" | "sensitivity">) {
  const dpi = toPositiveNumber(profile.dpi);
  const sensitivity = toPositiveNumber(profile.sensitivity);

  if (dpi === null || sensitivity === null) {
    return null;
  }

  return Math.round(dpi * sensitivity * 100) / 100;
}

export function calculateGameAngularSpeed(
  profile: Pick<MouseFitProfileDraft, "game" | "sensitivity">,
) {
  const degreesPerCount = calculateGameDegreesPerMouseCount(profile);

  if (degreesPerCount === null) {
    return null;
  }

  return Math.round(degreesPerCount * 1000) / 1000;
}

export function calculateInchesPer360(
  profile: Pick<MouseFitProfileDraft, "dpi" | "game" | "sensitivity">,
) {
  const dpi = toPositiveNumber(profile.dpi);
  const degreesPerCount = calculateGameDegreesPerMouseCount(profile);

  if (dpi === null || degreesPerCount === null) {
    return null;
  }

  return 360 / (dpi * degreesPerCount);
}

export function calculateCentimetersPer360(
  profile: Pick<MouseFitProfileDraft, "dpi" | "game" | "sensitivity">,
) {
  const inchesPer360 = calculateInchesPer360(profile);

  if (inchesPer360 === null) {
    return null;
  }

  return inchesPer360 * 2.54;
}

function calculateGameDegreesPerMouseCount(
  profile: Pick<MouseFitProfileDraft, "game" | "sensitivity">,
) {
  const sensitivity = toPositiveNumber(profile.sensitivity);
  const gameYaw = getGameYaw(profile.game);

  if (sensitivity === null || gameYaw === null) {
    return null;
  }

  return sensitivity * gameYaw;
}

export function getAimSensitivityScale(
  profile: Pick<MouseFitProfileDraft, "game" | "sensitivity">,
) {
  const angularSpeed = calculateGameAngularSpeed(profile);

  if (angularSpeed === null) {
    return 1;
  }

  return clamp(angularSpeed / BASELINE_ANGULAR_SPEED, 0.45, 2.25);
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

export function getStoredAimSensitivityScale() {
  return getAimSensitivityScale(getInitialProfile());
}

export function getStoredMouseRadiansPerCount() {
  const degreesPerCount = calculateGameDegreesPerMouseCount(getInitialProfile());

  if (degreesPerCount === null) {
    return BASELINE_ANGULAR_SPEED * (Math.PI / 180);
  }

  return degreesPerCount * (Math.PI / 180);
}
