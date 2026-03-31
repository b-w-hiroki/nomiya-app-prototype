/** 逆引き用。値はデータ側のキーと一致させる */
export const DRINK_FILTER_OPTIONS: {
  value: string;
  label: string;
  description?: string;
}[] = [
  { value: "sapporo", label: "サッポロビール", description: "樽生・黒ラベルなど" },
  { value: "asahi", label: "アサヒ（スーパードライ等）" },
  { value: "kirin", label: "キリン（一番搾り等）" },
  { value: "yebisu", label: "ヱビス" },
  { value: "craft", label: "クラフトビール" },
  { value: "highball", label: "ハイボール系" },
  { value: "whiskey", label: "ウイスキー" },
  { value: "sour", label: "サワー・酎ハイ" },
  { value: "wine", label: "ワイン" },
  { value: "cocktail", label: "カクテル" },
];

export const DRINK_LABELS: Record<string, string> = Object.fromEntries(
  DRINK_FILTER_OPTIONS.map((o) => [o.value, o.label])
) as Record<string, string>;

export function drinkLabel(key: string): string {
  return DRINK_LABELS[key] ?? key;
}
