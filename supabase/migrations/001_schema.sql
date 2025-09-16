-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$
begin
  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type subscription_status as enum (
      'trialing','active','past_due','canceled','incomplete','incomplete_expired','paused','unpaid'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'post_status') then
    create type post_status as enum ('draft','scheduled','published','failed');
  end if;

  if not exists (select 1 from pg_type where typname = 'platform') then
    create type platform as enum ('twitter','linkedin','instagram','facebook','youtube','tiktok','threads','other');
  end if;
end$$;

-- Updated-at trigger function
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  locale text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Subscriptions (Stripe)
create table if not exists public.subscriptions (
  id text primary key, -- Stripe subscription id
  user_id uuid not null references public.profiles(id) on delete cascade,
  status subscription_status not null,
  plan_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

-- Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  platform platform not null default 'other',
  status post_status not null default 'draft',
  scheduled_for timestamptz,
  published_at timestamptz,
  language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

-- Engagements (used by backend analytics endpoint)
create table if not exists public.engagements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  likes int not null default 0,
  shares int not null default 0,
  comments int not null default 0,
  impressions int not null default 0,
  created_at timestamptz not null default now()
);

-- AI Captions
create table if not exists public.ai_captions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete set null,
  prompt text,
  caption text not null,
  sentiment_score numeric,
  language text default 'en',
  created_at timestamptz not null default now()
);

-- Sentiment Analysis Results
create table if not exists public.sentiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  positive numeric,
  neutral numeric,
  negative numeric,
  aggregated_score numeric,
  created_at timestamptz not null default now()
);

-- Repurposed Post Suggestions
create table if not exists public.repurposed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_post_id uuid not null references public.posts(id) on delete cascade,
  platform platform not null default 'other',
  content text not null,
  created_at timestamptz not null default now()
);

-- Viral Predictor Results
create table if not exists public.viral_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  engagement_score numeric,
  probability numeric,
  created_at timestamptz not null default now()
);

-- Leads (marketing capture)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  source text,
  created_at timestamptz not null default now()
);

-- Webhook logs (observability)
create table if not exists public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  request_body jsonb,
  status_code int,
  error text,
  created_at timestamptz not null default now()
);

-- GDPR helpers: anonymize a user's personal data
create or replace function public.anonymize_user(target_user uuid)
returns void language plpgsql security definer as $$
begin
  update public.profiles
    set email = null,
        full_name = null,
        avatar_url = null,
        deleted_at = now(),
        updated_at = now()
  where id = target_user;

  update public.posts
    set content = '[deleted by user]',
        updated_at = now()
  where user_id = target_user;

  update public.ai_captions
    set prompt = null,
        caption = '[deleted by user]'
  where user_id = target_user;

  update public.repurposed_posts
    set content = '[deleted by user]'
  where user_id = target_user;

  -- keep analytics data but detached from user if desired
  -- update public.engagements set user_id = null where user_id = target_user;
end$$;

-- Aggregate views (observability/perf)
create or replace view public.v_post_performance as
select
  p.id as post_id,
  p.user_id,
  p.platform,
  coalesce(sum(e.likes),0) as likes,
  coalesce(sum(e.shares),0) as shares,
  coalesce(sum(e.comments),0) as comments,
  coalesce(sum(e.impressions),0) as impressions,
  p.created_at
from public.posts p
left join public.engagements e on e.post_id = p.id
group by p.id, p.user_id, p.platform, p.created_at;

create or replace view public.v_user_summary as
select
  u.id as user_id,
  count(distinct p.id) as posts_count,
  count(distinct s.id) filter (where s.status in ('active','trialing')) as active_subscriptions,
  coalesce(sum(e.likes),0) as total_likes,
  coalesce(sum(e.shares),0) as total_shares,
  coalesce(sum(e.comments),0) as total_comments
from public.profiles u
left join public.posts p on p.user_id = u.id
left join public.subscriptions s on s.user_id = u.id and s.deleted_at is null
left join public.engagements e on e.user_id = u.id
group by u.id;