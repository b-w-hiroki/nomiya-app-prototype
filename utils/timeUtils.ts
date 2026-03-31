import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale/ja";

/**
 * 有効期限までの残り時間を日本語で表示
 * @param expiresAt 有効期限のISO文字列
 * @returns 残り時間の表示文字列（例: "あと2時間"）
 */
export function getTimeRemaining(expiresAt: string): string {
  try {
    const now = new Date();
    const expires = new Date(expiresAt);
    
    if (expires < now) {
      return "期限切れ";
    }
    
    const distance = formatDistanceToNow(expires, { 
      locale: ja,
      addSuffix: true 
    });
    
    // "約2時間後" → "あと2時間" に変換
    return distance.replace("約", "").replace("後", "").replace("以内", "");
  } catch (error) {
    return "期限不明";
  }
}

/**
 * 期限が迫っているかどうか（1時間以内）
 */
export function isUrgent(expiresAt: string): boolean {
  try {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    return diff > 0 && diff <= 60 * 60 * 1000; // 1時間以内
  } catch {
    return false;
  }
}
