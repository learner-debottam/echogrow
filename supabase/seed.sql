-- Two sample users (replace with real auth.users ids locally if desired)
-- If using Supabase Auth locally, you can insert into auth.users and reuse those UUIDs.
-- Here we assume two fixed UUIDs for dev only.

with u1 as (
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at, created_at, updated_at, last_sign_in_at, role, aud, raw_app_meta_data, raw_user_meta_data
  ) values (
    '11111111-1111-1111-1111-111111111111',
    'alice@example.com',
    '$2a$10$Qn3m2mJb1k8q5S6o3v5b6OWqk0pQk8aA2aOqZ6YB8s0uQ1k9h8rD2', -- bcrypt("password")
    now(), now(), now(), now(),
    'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  )
  on conflict (id) do nothing
  returning id
),
u2 as (
  insert into auth.users (
    id, email, encrypted_password, email_confirmed_at, created_at, updated_at, last_sign_in_at, role, aud, raw_app_meta_data, raw_user_meta_data
  ) values (
    '22222222-2222-2222-2222-222222222222',
    'bob@example.com',
    '$2a$10$Qn3m2mJb1k8q5S6o3v5b6OWqk0pQk8aA2aOqZ6YB8s0uQ1k9h8rD2', -- bcrypt("password")
    now(), now(), now(), now(),
    'authenticated', 'authenticated',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  )
  on conflict (id) do nothing
  returning id
)
select 1;

-- Now profiles can reference those IDs:
insert into public.profiles (id, email, full_name, locale)
values
  ('11111111-1111-1111-1111-111111111111','alice@example.com','Alice','en'),
  ('22222222-2222-2222-2222-222222222222','bob@example.com','Bob','en')
on conflict (id) do update set email=excluded.email;

with upsert_profiles as (
  insert into public.profiles (id, email, full_name, locale)
  values
    ('11111111-1111-1111-1111-111111111111','alice@example.com','Alice','en'),
    ('22222222-2222-2222-2222-222222222222','bob@example.com','Bob','en')
  on conflict (id) do update set email=excluded.email
  returning id
)
select 1;

-- Subscriptions (Stripe ids are placeholders)
insert into public.subscriptions (id, user_id, status, plan_id, current_period_end)
values
  ('sub_test_001','11111111-1111-1111-1111-111111111111','active','price_basic', now() + interval '30 days'),
  ('sub_test_002','22222222-2222-2222-2222-222222222222','trialing','price_pro', now() + interval '14 days')
on conflict (id) do nothing;

-- Posts
insert into public.posts (id, user_id, content, platform, status, scheduled_for)
values
  (gen_random_uuid(),'11111111-1111-1111-1111-111111111111','Hello world from EchoGrow','twitter','scheduled', now() + interval '1 day'),
  (gen_random_uuid(),'11111111-1111-1111-1111-111111111111','AI tips for creators','linkedin','published', null),
  (gen_random_uuid(),'22222222-2222-2222-2222-222222222222','Best posting times','twitter','draft', null);

-- Sample engagements (attach to existing posts)
insert into public.engagements (user_id, post_id, likes, shares, comments, impressions)
select p.user_id, p.id, (random()*100)::int, (random()*50)::int, (random()*30)::int, (random()*1000)::int
from public.posts p;

-- AI captions
insert into public.ai_captions (user_id, post_id, prompt, caption, sentiment_score, language)
select p.user_id, p.id, 'Generate caption', 'This is an AI-generated caption.', 0.2, 'en'
from public.posts p
limit 2;

-- Sentiment results
insert into public.sentiments (user_id, post_id, positive, neutral, negative, aggregated_score)
select p.user_id, p.id, 0.4, 0.4, 0.2, 0.2
from public.posts p
limit 2;

-- Repurposed posts
insert into public.repurposed_posts (user_id, source_post_id, platform, content)
select p.user_id, p.id, 'linkedin', 'Repurposed version for LinkedIn'
from public.posts p
limit 1;

-- Viral predictions
insert into public.viral_predictions (user_id, post_id, engagement_score, probability)
select p.user_id, p.id, 0.65, 0.42
from public.posts p
limit 2;

-- Leads
insert into public.leads (user_id, email, source)
values
  ('11111111-1111-1111-1111-111111111111', 'lead1@example.com', 'landing'),
  (null, 'lead2@example.com', 'newsletter');