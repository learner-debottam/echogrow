-- Profiles
create index if not exists idx_profiles_email on public.profiles(email);

-- Subscriptions
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);

-- Posts
create index if not exists idx_posts_user on public.posts(user_id);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_platform on public.posts(platform);
create index if not exists idx_posts_created_at on public.posts(created_at);

-- Engagements
create index if not exists idx_engagements_user on public.engagements(user_id);
create index if not exists idx_engagements_post on public.engagements(post_id);
create index if not exists idx_engagements_created_at on public.engagements(created_at);

-- AI
create index if not exists idx_ai_captions_user on public.ai_captions(user_id);
create index if not exists idx_ai_captions_post on public.ai_captions(post_id);

create index if not exists idx_sentiments_user on public.sentiments(user_id);
create index if not exists idx_sentiments_post on public.sentiments(post_id);

create index if not exists idx_viral_predictions_user on public.viral_predictions(user_id);
create index if not exists idx_viral_predictions_post on public.viral_predictions(post_id);

-- Repurposed
create index if not exists idx_repurposed_user on public.repurposed_posts(user_id);
create index if not exists idx_repurposed_source on public.repurposed_posts(source_post_id);

-- Leads
create index if not exists idx_leads_user on public.leads(user_id);
create index if not exists idx_leads_email on public.leads(email);