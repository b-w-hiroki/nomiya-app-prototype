-- campaigns テーブル
create table if not exists public.campaigns (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  brand text,
  store_name text not null,
  title text not null,
  price_display text not null,
  image_url text,
  starts_at timestamptz,
  expires_at timestamptz not null,
  latitude double precision not null,
  longitude double precision not null,
  area text,
  source text,
  tags text[]
);

-- インデックス
create index if not exists idx_campaigns_expires_at on public.campaigns (expires_at);
create index if not exists idx_campaigns_lat_lng on public.campaigns (latitude, longitude);

-- RLS 設定（必要に応じて調整）
alter table public.campaigns enable row level security;

-- 参照用（全体読み取り許可）
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'campaigns' and policyname = 'Anyone can read campaigns'
  ) then
    create policy "Anyone can read campaigns" on public.campaigns for select using (true);
  end if;
end $$;

