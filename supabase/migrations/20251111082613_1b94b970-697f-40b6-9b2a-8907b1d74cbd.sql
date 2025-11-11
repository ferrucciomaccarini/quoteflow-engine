-- Disable Row Level Security on all user-specific tables to make the app public for demos

-- Disable RLS on assessment_history
ALTER TABLE public.assessment_history DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own assessments" ON public.assessment_history;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessment_history;

-- Disable RLS on credit_bureau_spreads
ALTER TABLE public.credit_bureau_spreads DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own credit_bureau_spreads" ON public.credit_bureau_spreads;
DROP POLICY IF EXISTS "Users can delete their own credit_bureau_spreads" ON public.credit_bureau_spreads;
DROP POLICY IF EXISTS "Users can update their own credit_bureau_spreads" ON public.credit_bureau_spreads;
DROP POLICY IF EXISTS "Users can view their own credit_bureau_spreads" ON public.credit_bureau_spreads;

-- Disable RLS on customers
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view their own customers" ON public.customers;

-- Disable RLS on eaas_simulations
ALTER TABLE public.eaas_simulations DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own simulations" ON public.eaas_simulations;
DROP POLICY IF EXISTS "Users can delete their own simulations" ON public.eaas_simulations;
DROP POLICY IF EXISTS "Users can update their own simulations" ON public.eaas_simulations;
DROP POLICY IF EXISTS "Users can view their own simulations" ON public.eaas_simulations;

-- Disable RLS on internal_rating_spreads
ALTER TABLE public.internal_rating_spreads DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own internal_rating_spreads" ON public.internal_rating_spreads;
DROP POLICY IF EXISTS "Users can delete their own internal_rating_spreads" ON public.internal_rating_spreads;
DROP POLICY IF EXISTS "Users can update their own internal_rating_spreads" ON public.internal_rating_spreads;
DROP POLICY IF EXISTS "Users can view their own internal_rating_spreads" ON public.internal_rating_spreads;

-- Disable RLS on knowledge_documents
ALTER TABLE public.knowledge_documents DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.knowledge_documents;

-- Disable RLS on machine_categories
ALTER TABLE public.machine_categories DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own machine categories" ON public.machine_categories;
DROP POLICY IF EXISTS "Users can delete their own machine categories" ON public.machine_categories;
DROP POLICY IF EXISTS "Users can update their own machine categories" ON public.machine_categories;
DROP POLICY IF EXISTS "Users can view their own machine categories" ON public.machine_categories;

-- Disable RLS on machines
ALTER TABLE public.machines DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own machines" ON public.machines;
DROP POLICY IF EXISTS "Users can delete their own machines" ON public.machines;
DROP POLICY IF EXISTS "Users can update their own machines" ON public.machines;
DROP POLICY IF EXISTS "Users can view their own machines" ON public.machines;

-- Disable RLS on quote_calculations
ALTER TABLE public.quote_calculations DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can delete their own quote calculations" ON public.quote_calculations;
DROP POLICY IF EXISTS "Users can insert their own quote calculations" ON public.quote_calculations;
DROP POLICY IF EXISTS "Users can update their own quote calculations" ON public.quote_calculations;
DROP POLICY IF EXISTS "Users can view their own quote calculations" ON public.quote_calculations;

-- Disable RLS on quotes
ALTER TABLE public.quotes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can view their own quotes" ON public.quotes;

-- Disable RLS on risk_assessments
ALTER TABLE public.risk_assessments DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can delete their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can update their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Users can view their own risk assessments" ON public.risk_assessments;

-- Disable RLS on service_categories
ALTER TABLE public.service_categories DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Users can delete their own service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Users can update their own service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Users can view their own service categories" ON public.service_categories;

-- Disable RLS on services
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can create their own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their own services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own services" ON public.services;
DROP POLICY IF EXISTS "Users can view their own services" ON public.services;

-- Disable RLS on synthetic_projections
ALTER TABLE public.synthetic_projections DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own projections" ON public.synthetic_projections;

-- Disable RLS on virtual_machinery
ALTER TABLE public.virtual_machinery DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own machinery" ON public.virtual_machinery;