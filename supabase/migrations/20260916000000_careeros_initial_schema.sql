-- CareerOS Supabase Initial Schema Migration
-- Matches src/types/index.ts domain objects field-for-field
-- Includes RLS policies, Faculty access, and Auth triggers

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT DEFAULT 'JECRC University',
  degree TEXT DEFAULT 'B.Tech Computer Science & Engineering',
  branch TEXT DEFAULT 'CSE',
  graduation_year INTEGER DEFAULT 2026,
  cgpa NUMERIC(4, 2) DEFAULT 8.50,
  target_role_id TEXT DEFAULT 'role-sde-1',
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Target Roles Table (Catalog of career roles & required skill benchmarks)
CREATE TABLE IF NOT EXISTS public.target_roles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  salary_range TEXT,
  market_demand TEXT,
  experience_level TEXT,
  education_expectations TEXT,
  experience_expectations TEXT,
  soft_skills JSONB DEFAULT '[]'::jsonb,
  interview_areas JSONB DEFAULT '[]'::jsonb,
  aptitude_areas JSONB DEFAULT '[]'::jsonb,
  communication_expectations TEXT,
  required_skills JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Student Skills Table
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_proficiency INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_by TEXT,
  last_assessed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, name)
);

-- 5. Roadmap Tasks Table
CREATE TABLE IF NOT EXISTS public.roadmap_tasks (
  id TEXT PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  action_type TEXT DEFAULT 'practice',
  estimated_minutes INTEGER DEFAULT 30,
  difficulty TEXT DEFAULT 'Intermediate',
  priority TEXT DEFAULT 'High',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Technical Interview Evaluations Table
CREATE TABLE IF NOT EXISTS public.technical_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  code_submission TEXT NOT NULL,
  language TEXT NOT NULL,
  correctness_score INTEGER NOT NULL,
  problem_solving_score INTEGER NOT NULL,
  communication_score INTEGER NOT NULL,
  time_management_score INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  strengths JSONB DEFAULT '[]'::jsonb,
  areas_to_improve JSONB DEFAULT '[]'::jsonb,
  ai_assessment TEXT,
  next_best_action TEXT,
  duration_seconds INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. HR Interview Evaluations Table
CREATE TABLE IF NOT EXISTS public.hr_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  transcript TEXT NOT NULL,
  star_analysis JSONB DEFAULT '{}'::jsonb,
  communication_score INTEGER NOT NULL,
  confidence_score INTEGER NOT NULL,
  structure_score INTEGER NOT NULL,
  culture_fit_score INTEGER NOT NULL,
  overall_score INTEGER NOT NULL,
  feedback TEXT,
  recommended_improvement TEXT,
  duration_seconds INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Communication Metrics Table
CREATE TABLE IF NOT EXISTS public.communication_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  duration_seconds INTEGER NOT NULL,
  words_per_minute INTEGER NOT NULL,
  filler_words_detected JSONB DEFAULT '[]'::jsonb,
  clarity_score INTEGER NOT NULL,
  pacing_score INTEGER NOT NULL,
  eye_contact_score INTEGER NOT NULL,
  transcript TEXT,
  feedback TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Aptitude Assessment Sessions Table
CREATE TABLE IF NOT EXISTS public.aptitude_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  category_scores JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Career Events Log Table
CREATE TABLE IF NOT EXISTS public.career_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Readiness Scores Table (Historical Tracking)
CREATE TABLE IF NOT EXISTS public.readiness_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  overall INTEGER NOT NULL,
  technical INTEGER NOT NULL,
  aptitude INTEGER NOT NULL,
  communication INTEGER NOT NULL,
  hr INTEGER NOT NULL,
  interview INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Helper Function to Check Faculty or Admin Privileges
CREATE OR REPLACE FUNCTION public.is_faculty_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('faculty', 'admin')
  );
$$;

-- 13. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aptitude_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_scores ENABLE ROW LEVEL SECURITY;

-- 14. Define RLS Policies

-- target_roles: Anyone authenticated or anonymous can read target roles
CREATE POLICY "target_roles_read_policy" ON public.target_roles
  FOR SELECT USING (true);

-- profiles:
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_faculty_or_admin());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_faculty_or_admin());

-- student_skills:
CREATE POLICY "student_skills_select" ON public.student_skills
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "student_skills_all_own" ON public.student_skills
  FOR ALL USING (auth.uid() = profile_id);

-- roadmap_tasks:
CREATE POLICY "roadmap_tasks_select" ON public.roadmap_tasks
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "roadmap_tasks_all_own" ON public.roadmap_tasks
  FOR ALL USING (auth.uid() = profile_id);

-- technical_evaluations:
CREATE POLICY "technical_evaluations_select" ON public.technical_evaluations
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "technical_evaluations_insert_own" ON public.technical_evaluations
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- hr_evaluations:
CREATE POLICY "hr_evaluations_select" ON public.hr_evaluations
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "hr_evaluations_insert_own" ON public.hr_evaluations
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- communication_metrics:
CREATE POLICY "communication_metrics_select" ON public.communication_metrics
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "communication_metrics_insert_own" ON public.communication_metrics
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- aptitude_sessions:
CREATE POLICY "aptitude_sessions_select" ON public.aptitude_sessions
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "aptitude_sessions_insert_own" ON public.aptitude_sessions
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- career_events:
CREATE POLICY "career_events_select" ON public.career_events
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "career_events_insert_own" ON public.career_events
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- readiness_scores:
CREATE POLICY "readiness_scores_select" ON public.readiness_scores
  FOR SELECT USING (auth.uid() = profile_id OR public.is_faculty_or_admin());

CREATE POLICY "readiness_scores_insert_own" ON public.readiness_scores
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- 15. Automatic User Profile Creation Trigger on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    university,
    degree,
    branch,
    graduation_year,
    cgpa,
    target_role_id
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'university', 'JECRC University'),
    COALESCE(NEW.raw_user_meta_data->>'degree', 'B.Tech Computer Science & Engineering'),
    COALESCE(NEW.raw_user_meta_data->>'branch', 'CSE'),
    COALESCE((NEW.raw_user_meta_data->>'graduation_year')::INTEGER, 2026),
    COALESCE((NEW.raw_user_meta_data->>'cgpa')::NUMERIC, 8.50),
    COALESCE(NEW.raw_user_meta_data->>'target_role_id', 'role-sde-1')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. Seed Data for Target Roles (Extracted from mockData.ts)
INSERT INTO public.target_roles (
  id, title, category, description, salary_range, market_demand, experience_level,
  education_expectations, experience_expectations, soft_skills, interview_areas,
  aptitude_areas, communication_expectations, required_skills
) VALUES
(
  'role-sde-1',
  'Software Engineer — SDE-1',
  'Software Engineering',
  'Build backend microservices, write clean maintainable code, optimize database queries, and contribute to scalable distributed systems.',
  '₹12 LPA — ₹24 LPA',
  'Very High',
  'Entry Level (0-2 yrs)',
  'B.Tech/B.E. in Computer Science, IT, or related technical disciplines with CGPA ≥ 7.0.',
  '1-2 production projects or internships demonstrating REST APIs, database schemas, and clean code.',
  '["Analytical Problem Solving","STAR Behavioral Framing","Active Code Review Communication","Technical Articulation"]'::jsonb,
  '["Round 1: DSA (Arrays, Hashmaps, Two-Pointer)","Round 2: System Design & Databases","Round 3: Core CS & HR Culture Fit"]'::jsonb,
  '["Quantitative (Work & Time, Probability)","Logical Series & Deduction","Abstract Code Tracing"]'::jsonb,
  'Target 125-145 WPM speaking cadence with minimal verbal fillers during design explanation.',
  '[{"name":"Python","category":"Programming","requiredProficiency":85,"weight":0.9,"critical":true,"benchmarkDescription":"Idiomatic code, generator functions, memory model"},{"name":"Data Structures","category":"Programming","requiredProficiency":85,"weight":1,"critical":true,"benchmarkDescription":"Arrays, Hashmaps, Linked Lists, Trees, Graphs"},{"name":"SQL","category":"Data","requiredProficiency":80,"weight":0.85,"critical":true,"benchmarkDescription":"Multi-table joins, aggregations, subqueries"},{"name":"SQL Indexing","category":"Data","requiredProficiency":75,"weight":0.7,"critical":false,"benchmarkDescription":"B-tree index, clustered vs non-clustered, EXPLAIN"},{"name":"System Design","category":"Backend","requiredProficiency":70,"weight":0.8,"critical":true,"benchmarkDescription":"Load balancers, caching, microservice separation"},{"name":"REST APIs","category":"Backend","requiredProficiency":80,"weight":0.8,"critical":true,"benchmarkDescription":"Stateless endpoints, idempotency, status codes"},{"name":"Git","category":"Programming","requiredProficiency":75,"weight":0.6,"critical":false,"benchmarkDescription":"Branching, PR reviews, merge conflict resolution"},{"name":"Advanced DSA","category":"Programming","requiredProficiency":80,"weight":0.9,"critical":true,"benchmarkDescription":"Dynamic programming, sliding window, topological sort"},{"name":"Docker","category":"Backend","requiredProficiency":65,"weight":0.6,"critical":false,"benchmarkDescription":"Containerization, Dockerfile optimization, ports"},{"name":"Object-Oriented Design","category":"CS Fundamentals","requiredProficiency":80,"weight":0.75,"critical":false,"benchmarkDescription":"SOLID principles, factory patterns, composition"},{"name":"Operating Systems","category":"CS Fundamentals","requiredProficiency":75,"weight":0.7,"critical":false,"benchmarkDescription":"Processes vs threads, concurrency, deadlocks"},{"name":"Communication","category":"Communication","requiredProficiency":75,"weight":0.7,"critical":false,"benchmarkDescription":"Clear technical explanation of code complexity"},{"name":"Behavioral Framing","category":"Interview Skills","requiredProficiency":75,"weight":0.7,"critical":false,"benchmarkDescription":"STAR structure with quantified impact"},{"name":"React","category":"Frontend","requiredProficiency":65,"weight":0.5,"critical":false,"benchmarkDescription":"Component hierarchy, state hooks, fetch integration"}]'::jsonb
),
(
  'role-data-analyst',
  'Data Analyst',
  'Data & Analytics',
  'Transform raw data into business intelligence, build interactive PowerBI/Tableau dashboards, and write complex statistical SQL queries.',
  '₹8 LPA — ₹16 LPA',
  'High',
  'Entry Level (0-2 yrs)',
  'B.Tech/BCA/B.Sc in CS, IT, Statistics, Mathematics or Data Science with strong quantitative baseline.',
  'Portfolio of end-to-end data cleaning, EDA, and dashboard storytelling projects.',
  '["Business Acumen","Data Storytelling","Executive Presentation","Curiosity"]'::jsonb,
  '["Round 1: Complex SQL Queries & Window Functions","Round 2: Data Cleaning & Visualization Case Study","Round 3: Business Metrics & Culture Fit"]'::jsonb,
  '["Data Interpretation (Tables, Charts)","Probability & Statistics","Logical Deduction"]'::jsonb,
  'Ability to translate statistical observations into non-technical business recommendations.',
  '[{"name":"SQL","category":"Data","requiredProficiency":90,"weight":1,"critical":true,"benchmarkDescription":"Window functions, CTEs, self-joins, ranking"},{"name":"Python","category":"Programming","requiredProficiency":80,"weight":0.85,"critical":true,"benchmarkDescription":"Data manipulation, automated script reporting"},{"name":"Pandas & NumPy","category":"Data","requiredProficiency":85,"weight":0.9,"critical":true,"benchmarkDescription":"DataFrames, merging, groupby, imputation"},{"name":"Data Visualization","category":"Frontend","requiredProficiency":80,"weight":0.8,"critical":true,"benchmarkDescription":"Tableau, PowerBI, Seaborn, interactive visuals"},{"name":"Communication","category":"Communication","requiredProficiency":85,"weight":0.8,"critical":true,"benchmarkDescription":"Presenting data narratives to stakeholders"},{"name":"Statistics","category":"Data","requiredProficiency":75,"weight":0.75,"critical":false,"benchmarkDescription":"Distributions, hypothesis testing, correlation"}]'::jsonb
),
(
  'role-ml-engineer',
  'Machine Learning Engineer',
  'AI / Machine Learning',
  'Train, evaluate, and deploy machine learning and LLM pipeline models into production infrastructure with low inference latencies.',
  '₹14 LPA — ₹28 LPA',
  'Very High',
  'Entry Level (0-2 yrs)',
  'B.Tech/M.Tech in CSE with AI/ML specialization or Data Science with strong linear algebra foundation.',
  'GitHub repositories showing trained PyTorch/TensorFlow models with deployment containerization.',
  '["Experimental Rigor","Model Explainability","Research Translation","System Thinking"]'::jsonb,
  '["Round 1: ML Fundamentals & Linear Algebra","Round 2: Model Architecture & Evaluation Metrics","Round 3: ML System Design & Serving"]'::jsonb,
  '["Multivariate Calculus & Linear Algebra","Probability Distributions","Algorithmic Problem Solving"]'::jsonb,
  'Explaining trade-offs between precision, recall, latency, and compute cost.',
  '[{"name":"Python","category":"Programming","requiredProficiency":90,"weight":1,"critical":true,"benchmarkDescription":"Advanced Python, vectorized operations, concurrency"},{"name":"Machine Learning","category":"AI/ML","requiredProficiency":85,"weight":1,"critical":true,"benchmarkDescription":"Supervised, unsupervised, feature engineering, cross-validation"},{"name":"Deep Learning / PyTorch","category":"AI/ML","requiredProficiency":80,"weight":0.9,"critical":true,"benchmarkDescription":"CNNs, Transformers, autograd, GPU acceleration"},{"name":"Data Structures","category":"Programming","requiredProficiency":80,"weight":0.8,"critical":true,"benchmarkDescription":"Graph traversals, matrix manipulation, hash structures"},{"name":"System Design","category":"Backend","requiredProficiency":75,"weight":0.8,"critical":false,"benchmarkDescription":"Model serving, batch vs stream inference, caching"},{"name":"Docker","category":"Backend","requiredProficiency":75,"weight":0.7,"critical":false,"benchmarkDescription":"Containerized deployment of Triton/TorchServe engines"}]'::jsonb
),
(
  'role-data-scientist',
  'Data Scientist',
  'Data & Analytics',
  'Apply advanced statistical modeling, predictive algorithms, and hypothesis testing to solve core business problems.',
  '₹12 LPA — ₹22 LPA',
  'High',
  'Entry Level (0-2 yrs)',
  'B.Tech or M.Sc in CS, Applied Math, Statistics, or Data Science.',
  'Kaggle or research projects with thorough documentation of feature engineering and validation.',
  '["Scientific Skepticism","Strategic Reasoning","Stakeholder Communication"]'::jsonb,
  '["Round 1: Probability & Hypothesis Testing","Round 2: Predictive Modeling Case Study","Round 3: Business Translation"]'::jsonb,
  '["Advanced Probability & Combinatorics","Statistical Significance","Logical Inference"]'::jsonb,
  'Presenting technical conclusions to business teams with clear actionable next steps.',
  '[{"name":"Python","category":"Programming","requiredProficiency":85,"weight":0.9,"critical":true,"benchmarkDescription":"Scikit-learn, statsmodels, NumPy"},{"name":"Statistics","category":"Data","requiredProficiency":90,"weight":1,"critical":true,"benchmarkDescription":"A/B testing, Bayesian inference, regression"},{"name":"Machine Learning","category":"AI/ML","requiredProficiency":80,"weight":0.85,"critical":true,"benchmarkDescription":"Gradient boosting, clustering, dimension reduction"},{"name":"SQL","category":"Data","requiredProficiency":85,"weight":0.85,"critical":true,"benchmarkDescription":"Aggregating large historical event tables"},{"name":"Communication","category":"Communication","requiredProficiency":80,"weight":0.8,"critical":false,"benchmarkDescription":"Translating statistical confidence intervals"}]'::jsonb
),
(
  'role-business-analyst',
  'Business Analyst',
  'Product & Business',
  'Bridge business strategy and technical requirements, document user stories, analyze process flows, and evaluate ROI.',
  '₹8 LPA — ₹15 LPA',
  'High',
  'Entry Level (0-2 yrs)',
  'B.Tech/BBA/BCA with demonstrated analytical and communication aptitude.',
  'Projects documenting functional requirements, BPMN workflows, and financial cost-benefit models.',
  '["Stakeholder Interviewing","Cross-Functional Empathy","Negotiation","Documentation Clarity"]'::jsonb,
  '["Round 1: Business Case Studies & Guesstimates","Round 2: Requirement Gathering & Flowcharts","Round 3: Behavioral Fit"]'::jsonb,
  '["Logical Deductive Reasoning","Critical Reading Comprehension","Data Sufficiency"]'::jsonb,
  'Crisp verbal facilitation and written functional requirements documentation.',
  '[{"name":"Communication","category":"Communication","requiredProficiency":90,"weight":1,"critical":true,"benchmarkDescription":"Executive presentations and conflict resolution"},{"name":"SQL","category":"Data","requiredProficiency":70,"weight":0.75,"critical":true,"benchmarkDescription":"Ad-hoc data extraction and validation"},{"name":"Data Visualization","category":"Frontend","requiredProficiency":75,"weight":0.8,"critical":true,"benchmarkDescription":"PowerBI/Excel dashboarding and trend tracking"},{"name":"Behavioral Framing","category":"Interview Skills","requiredProficiency":85,"weight":0.9,"critical":true,"benchmarkDescription":"Scenario handling and stakeholder alignment"}]'::jsonb
),
(
  'role-product-analyst',
  'Product Analyst',
  'Product & Business',
  'Define product metrics, analyze cohort retention, conduct A/B test experiments, and drive user feature adoption.',
  '₹10 LPA — ₹18 LPA',
  'Very High',
  'Entry Level (0-2 yrs)',
  'B.Tech in CS/IT or quantitative degree with product curiosity.',
  'Case study work analyzing retention curves, funnel drop-offs, and onboarding teardowns.',
  '["User Empathy","Hypothesis-Driven Thinking","Product Sense"]'::jsonb,
  '["Round 1: Product Sense & Metric Definition","Round 2: A/B Testing & Funnel Diagnostics","Round 3: Behavioral"]'::jsonb,
  '["Analytical Reasoning","Probabilistic Thinking","Data Interpretation"]'::jsonb,
  'Synthesizing funnel metrics into compelling product design recommendations.',
  '[{"name":"SQL","category":"Data","requiredProficiency":85,"weight":0.9,"critical":true,"benchmarkDescription":"Funnel analytics, retention cohorts, session tracking"},{"name":"Data Visualization","category":"Frontend","requiredProficiency":80,"weight":0.8,"critical":true,"benchmarkDescription":"Plotting user funnels and retention heatmaps"},{"name":"Communication","category":"Communication","requiredProficiency":85,"weight":0.9,"critical":true,"benchmarkDescription":"Aligning designers and engineers on product specs"},{"name":"Python","category":"Programming","requiredProficiency":70,"weight":0.7,"critical":false,"benchmarkDescription":"Automated telemetry data wrangling"}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  salary_range = EXCLUDED.salary_range,
  market_demand = EXCLUDED.market_demand,
  experience_level = EXCLUDED.experience_level,
  education_expectations = EXCLUDED.education_expectations,
  experience_expectations = EXCLUDED.experience_expectations,
  soft_skills = EXCLUDED.soft_skills,
  interview_areas = EXCLUDED.interview_areas,
  aptitude_areas = EXCLUDED.aptitude_areas,
  communication_expectations = EXCLUDED.communication_expectations,
  required_skills = EXCLUDED.required_skills;

