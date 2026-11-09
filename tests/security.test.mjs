import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
test('unauthenticated prototype never submits campaign data', () => {
  const page = read('app/admin/page.tsx');
  assert.doesNotMatch(page, /import .*supabase|\.insert\(|fetch\(/i);
  assert.match(page, /入力プレビュー・保存なし/);
  assert.match(page, /未保存/);
  assert.doesNotMatch(page, /投稿しました|投稿完了/);
});
test('schema remains read-only and documentation does not install permissive insert', () => {
  const sql = read('supabase/schema.sql');
  assert.match(sql, /enable row level security/i);
  assert.doesNotMatch(sql, /for\s+(insert|update|delete|all)/i);
  const fencedSql = [...read('README.md').matchAll(/```sql\n([\s\S]*?)```/g)].map(m => m[1]).join('\n');
  assert.doesNotMatch(fencedSql, /create\s+policy|with\s+check\s*\(true\)/i);
  assert.match(read('README.md'), /この変更だけで既存DBの権限は変わりません/);
});
test('image removal clears confirmation and controls have accessible names', () => {
  const page = read('app/admin/page.tsx');
  assert.match(page, /aria-label="画像プレビューを削除"\s+onClick=\{\(\) => \{\s+setPreviewReady\(false\);\s+setPreviewImage\(""\);/);
  for (const id of ['station', 'latitude', 'longitude']) {
    assert.match(page, new RegExp(`htmlFor="${id}"`));
    assert.match(page, new RegExp(`id="${id}"`));
  }
});
