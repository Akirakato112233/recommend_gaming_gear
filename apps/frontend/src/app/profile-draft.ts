export const PROFILE_DRAFT_STORAGE_KEY = "mouse-fit-profile-draft";

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

function isSupportedGame(game: string): game is SupportedGame {
  return supportedGames.includes(game as SupportedGame);
}

type ProfileDraftInput = Partial<MouseFitProfileDraft> & {
  sen?: string;
};

function normalizeProfileDraft(profile: ProfileDraftInput): MouseFitProfileDraft {
  const game = profile.game ?? "";

  return {
    game: isSupportedGame(game) ? game : emptyProfile.game,
    dpi: profile.dpi ?? emptyProfile.dpi,
    sensitivity: profile.sensitivity ?? profile.sen ?? emptyProfile.sensitivity,
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
