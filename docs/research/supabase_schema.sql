-- Enable the pgvector extension to work with embeddings
create extension if not exists vector;

-- Table for Hardware Components (Solar Panels, Inverters, Batteries)
create table if not exists public.hardware_components (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('panel', 'inverter', 'battery')),
  manufacturer text,
  model_number text,
  technical_specs jsonb default '{}'::jsonb,
  description text,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536), -- Standard dimension for many embedding models
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for vector similarity search
create index on public.hardware_components using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Enable Row Level Security (RLS)
alter table public.hardware_components enable row level security;

-- Allow public read access (assuming a public catalog for now)
create policy "Allow public read access"
  on public.hardware_components for select
  using (true);

-- Table for User Assessments (RAG Input/Output History)
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  site_data jsonb default '{}'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assessments enable row level security;

create policy "Users can only see their own assessments"
  on public.assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own assessments"
  on public.assessments for insert
  with check (auth.uid() = user_id);

-- RPC Function for Vector Similarity Search
create or replace function match_hardware (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  category text,
  manufacturer text,
  technical_specs jsonb,
  description text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    hc.id,
    hc.name,
    hc.category,
    hc.manufacturer,
    hc.technical_specs,
    hc.description,
    1 - (hc.embedding <=> query_embedding) as similarity
  from hardware_components hc
  where 1 - (hc.embedding <=> query_embedding) > match_threshold
  order by hc.embedding <=> query_embedding
  limit match_count;
end;
$$;
