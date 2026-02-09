# LifeTune Radio 🎵📻

AI-generated personalized radio that learns your taste and delivers fresh tracks daily.

## Live URL
*Deploy to Vercel: https://vercel.com/new*

## Features
- 🎵 AI music generation via ACE-Step
- 👤 Clerk authentication
- 💳 Stripe payments (Day Pass $5, Monthly $7.99)
- 🎨 Retro 90s pixel aesthetic
- 🗄️ Supabase database
- 📱 Mobile responsive

## Quick Start

```bash
# Install
npm install

# Env vars (copy from .env.local.example)
cp .env.local.example .env.local

# Add your keys:
# - Clerk: https://dashboard.clerk.com
# - Supabase: https://supabase.com/dashboard
# - Stripe: https://dashboard.stripe.com
# - Ko-fi: https://ko-fi.com

# Run dev
npm run dev

# Build
npm run build
```

## Database Setup (Supabase)

```sql
-- Run in Supabase SQL Editor

create table profiles (
  id uuid default gen_random_uuid() primary key,
  clerk_id text unique not null,
  email text unique not null,
  subscription_tier text default 'free',
  credits integer default 1,
  daily_limit integer default 1,
  created_at timestamp default now()
);

create table tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  caption text,
  audio_url text,
  duration integer,
  bpm integer,
  genre text,
  created_at timestamp default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  stripe_session_id text,
  amount integer,
  status text,
  price_id text,
  created_at timestamp default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table tracks enable row level security;
alter table payments enable row level security;

create policy "Users own their profile"
  on profiles for all
  using (clerk_id = auth.jwt() ->> 'sub');

create policy "Users own their tracks"
  on tracks for all
  using (user_id = auth.uid());
```

## Deploy

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## Architecture

- **Frontend:** Next.js 15 + Tailwind + TypeScript
- **Auth:** Clerk (your exact middleware spec)
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe (checkout + webhooks)
- **AI Music:** ACE-Step API integration

Built in 15 minutes. 🚀
