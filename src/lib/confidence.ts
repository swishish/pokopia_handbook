import type { Confidence } from "./types";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  official: "官方",
  "community-tested": "社群實測",
  "community-compiled": "社群實測",
  unverified: "未驗證",
};

export const CONFIDENCE_HINT: Record<Confidence, string> = {
  official: "來自官方說明或遊戲內可直接核對的字句",
  "community-tested": "玩家在遊戲內測過，附日期；更新後請再核對",
  "community-compiled": "社群整理，尚未逐條官方確認",
  unverified: "尚未核對，請勿當最終答案",
};

export function confidenceLabel(value: string): string {
  return CONFIDENCE_LABEL[value as Confidence] ?? "未驗證";
}

export function confidenceHint(value: string): string {
  return CONFIDENCE_HINT[value as Confidence] ?? CONFIDENCE_HINT.unverified;
}

export function confidenceClass(value: string): string {
  if (value === "official") return "badge badge-official";
  if (value === "unverified") return "badge badge-unverified";
  return "badge badge-community";
}
