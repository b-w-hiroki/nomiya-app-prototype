"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { CampaignInsert } from "@/types/campaign";
import { STATIONS } from "@/lib/stations";

export default function AdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignInsert>({
    brand: "",
    store_name: "",
    title: "",
    price_display: "",
    image_url: "",
    starts_at: "",
    expires_at: "",
    latitude: 35.465995,
    longitude: 139.622093,
    area: "横浜",
    source: "手入力",
    tags: [],
  });
  const [previewReady, setPreviewReady] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [stationId, setStationId] = useState<string>("yokohama");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPreviewReady(false);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewReady(false);
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image_url: url }));
    setPreviewImage(url);
  };

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreviewReady(false);
    const id = e.target.value;
    setStationId(id);
    const s = STATIONS.find((x) => x.id === id);
    if (s) {
      setFormData((prev) => ({
        ...prev,
        latitude: s.latitude,
        longitude: s.longitude,
        area: s.name,
      }));
    }
  };

  // This prototype has no administrator authentication. Never send form data
  // to Supabase merely because public connection variables are configured.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreviewReady(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <header className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-xs font-semibold tracking-wide text-amber-800">入力プレビュー・保存なし</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">キャンペーンを下書き</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          管理者認証が未実装のため、この画面から投稿・保存はできません。
          入力内容はページを離れると失われます。画像URLのプレビューは外部サイトから読み込みます。
        </p>
      </header>
      {previewReady && (
        <section role="status" className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-gray-700">入力を確認しました（未保存）</p>
          <p className="mt-2 font-bold text-gray-900">{formData.store_name}</p>
          <p className="mt-1 text-gray-700">{formData.title}</p>
          <p className="mt-1 font-semibold text-gray-900">{formData.price_display}</p>
          <p className="mt-2 text-xs text-gray-600">公開・データベース保存は行っていません。</p>
        </section>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 駅プリセット */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            基準駅（座標を自動入力）
          </label>
          <select
            value={stationId}
            onChange={handleStationChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            {STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* 緯度経度 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              緯度 (latitude) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.000001"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              経度 (longitude) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.000001"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>
        {/* ブランド（任意） */}
        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            ブランド（任意）
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="例: 串カツ田中"
          />
        </div>

        {/* 店名 */}
        <div>
          <label
            htmlFor="store_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            店名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="store_name"
            name="store_name"
            value={formData.store_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="例: 居酒屋 よこはま"
          />
        </div>

        {/* キャッチコピー */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            キャッチコピー <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="例: 19時までハイボール50円！"
          />
        </div>

        {/* 実質価格 */}
        <div>
          <label
            htmlFor="price_display"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            実質価格 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="price_display"
            name="price_display"
            value={formData.price_display}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="例: 1,200円〜"
          />
        </div>

        {/* 画像URL */}
        <div>
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            画像URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleImageUrlChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {previewImage && (
            <div className="mt-3 relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="プレビュー"
                className="w-full h-full object-cover"
                onError={() => setPreviewImage("")}
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewImage("");
                  setFormData((prev) => ({ ...prev, image_url: "" }));
                }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 開始日時（任意） */}
        <div>
          <label
            htmlFor="starts_at"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            開始日時（任意）
          </label>
          <input
            type="datetime-local"
            id="starts_at"
            name="starts_at"
            value={formData.starts_at || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* 有効期限 */}
        <div>
          <label
            htmlFor="expires_at"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            有効期限 <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="expires_at"
            name="expires_at"
            value={formData.expires_at}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        {/* エリア */}
        <div>
          <label
            htmlFor="area"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            エリア
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="横浜"
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            入力内容を確認
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
