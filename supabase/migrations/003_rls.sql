-- Enable RLS
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.posts enable row level security;
alter table public.engagements enable row level security;
alter table public.ai_captions enable row level security;
alter table public.sentiments enable row level security;
alter table public.repurposed_posts enable row level security;
alter table public.viral_predictions enable row level security;
alter table public.leads enable row level security;
alter table public.webhook_logs enable row level security;

-- Profiles: user can see/update their own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid()) with check (id = auth.uid());

-- Subscriptions: user can read their own; writes typically by service role
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions for select
using (user_id = auth.uid());

-- Allow user-initiated creation (optional). Otherwise restrict to service role header on API.
drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own"
on public.subscriptions for insert
with check (user_id = auth.uid());

drop policy if exists "subscriptions_update_own" on public.subscriptions;
create policy "subscriptions_update_own"
on public.subscriptions for update
using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Posts: full CRUD only for owner
drop policy if exists "posts_select_own" on public.posts;
create policy "posts_select_own"
on public.posts for select
using (user_id = auth.uid());

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts for insert
with check (user_id = auth.uid());

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts for update
using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
on public.posts for delete
using (user_id = auth.uid());

-- Engagements: read own; writes by owner or service role (adjust as needed)
drop policy if exists "engagements_select_own" on public.engagements;
create policy "engagements_select_own"
on public.engagements for select
using (user_id = auth.uid());

drop policy if exists "engagements_insert_own" on public.engagements;
create policy "engagements_insert_own"
on public.engagements for insert
with check (user_id = auth.uid());

drop policy if exists "engagements_update_own" on public.engagements;
create policy "engagements_update_own"
on public.engagements for update
using (user_id = auth.uid()) with check (user_id = auth.uid());

-- AI captions
drop policy if exists "ai_captions_select_own" on public.ai_captions;
create policy "ai_captions_select_own"
on public.ai_captions for select
using (user_id = auth.uid());

drop policy if exists "ai_captions_insert_own" on public.ai_captions;
create policy "ai_captions_insert_own"
on public.ai_captions for insert
with check (user_id = auth.uid());

-- Sentiments
drop policy if exists "sentiments_select_own" on public.sentiments;
create policy "sentiments_select_own"
on public.sentiments for select
using (user_id = auth.uid());

drop policy if exists "sentiments_insert_own" on public.sentiments;
create policy "sentiments_insert_own"
on public.sentiments for insert
with check (user_id = auth.uid());

-- Repurposed
drop policy if exists "repurposed_select_own" on public.repurposed_posts;
create policy "repurposed_select_own"
on public.repurposed_posts for select
using (user_id = auth.uid());

drop policy if exists "repurposed_insert_own" on public.repurposed_posts;
create policy "repurposed_insert_own"
on public.repurposed_posts for insert
with check (user_id = auth.uid());

-- Viral predictions
drop policy if exists "viral_pred_select_own" on public.viral_predictions;
create policy "viral_pred_select_own"
on public.viral_predictions for select
using (user_id = auth.uid());

drop policy if exists "viral_pred_insert_own" on public.viral_predictions;
create policy "viral_pred_insert_own"
on public.viral_predictions for insert
with check (user_id = auth.uid());

-- Leads: user may only read/write their own captured leads (optional)
drop policy if exists "leads_select_own" on public.leads;
create policy "leads_select_own"
on public.leads for select
using (user_id is null or user_id = auth.uid()); -- allow publicly captured leads with null user

drop policy if exists "leads_insert_own" on public.leads;
create policy "leads_insert_own"
on public.leads for insert
with check (user_id is null or user_id = auth.uid());

-- Webhook logs: read/write restricted to service role only
drop policy if exists "webhook_logs_no_access" on public.webhook_logs;
create policy "webhook_logs_no_access"
on public.webhook_logs for all
using (false) with check (false);