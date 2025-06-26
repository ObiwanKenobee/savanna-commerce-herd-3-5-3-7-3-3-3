
-- First, let's check if organizations table exists and drop/recreate if needed
DROP TABLE IF EXISTS organizations CASCADE;

-- Create organizations table with proper structure
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('supplier', 'retailer', 'distributor', 'manufacturer')),
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  industry TEXT NOT NULL,
  annual_revenue DECIMAL(15,2),
  employee_count INTEGER,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles with enterprise roles (check if it exists first)
DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'analyst', 'operator')),
  department TEXT,
  phone TEXT,
  avatar_url TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products catalog
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  sku TEXT UNIQUE NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  bulk_price DECIMAL(10,2),
  minimum_order_quantity INTEGER DEFAULT 1,
  stock_quantity INTEGER DEFAULT 0,
  unit_of_measure TEXT NOT NULL,
  origin_country TEXT,
  certifications JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders management
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_id UUID NOT NULL REFERENCES organizations(id),
  supplier_id UUID NOT NULL REFERENCES organizations(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'KSH',
  delivery_address JSONB NOT NULL,
  delivery_date DATE,
  payment_terms TEXT,
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order line items
DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and metrics tracking
DROP TABLE IF EXISTS analytics_events CASCADE;
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  organization_id UUID REFERENCES organizations(id),
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Innovation projects tracking
DROP TABLE IF EXISTS innovation_projects CASCADE;
CREATE TABLE innovation_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'ideation' CHECK (status IN ('ideation', 'development', 'testing', 'deployment', 'completed', 'cancelled')),
  budget DECIMAL(12,2),
  expected_roi DECIMAL(5,2),
  start_date DATE,
  target_completion DATE,
  team_members JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supply chain tracking
DROP TABLE IF EXISTS supply_chain_events CASCADE;
CREATE TABLE supply_chain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  event_type TEXT NOT NULL,
  location JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ESG metrics tracking
DROP TABLE IF EXISTS esg_metrics CASCADE;
CREATE TABLE esg_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('environmental', 'social', 'governance')),
  metric_name TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT,
  reporting_period TEXT,
  reporting_date DATE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_organizations_type ON organizations(organization_type);
CREATE INDEX idx_organizations_country ON organizations(country);
CREATE INDEX idx_user_profiles_org ON user_profiles(organization_id);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_org ON analytics_events(organization_id);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE esg_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (
    id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

-- RLS Policies for user profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- RLS Policies for products
CREATE POLICY "Users can view products from their organization or public" ON products
  FOR SELECT USING (
    supplier_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR status = 'active'
  );

CREATE POLICY "Suppliers can manage their products" ON products
  FOR ALL USING (
    supplier_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

-- RLS Policies for orders
CREATE POLICY "Users can view orders involving their organization" ON orders
  FOR SELECT USING (
    buyer_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
    OR supplier_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can create orders for their organization" ON orders
  FOR INSERT WITH CHECK (
    buyer_id IN (SELECT organization_id FROM user_profiles WHERE id = auth.uid())
  );

-- Create functions for analytics
CREATE OR REPLACE FUNCTION track_analytics_event(
  p_event_type TEXT,
  p_event_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  event_id UUID;
  user_org_id UUID;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO user_org_id
  FROM user_profiles WHERE id = auth.uid();
  
  -- Insert analytics event
  INSERT INTO analytics_events (event_type, user_id, organization_id, event_data)
  VALUES (p_event_type, auth.uid(), user_org_id, p_event_data)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_innovation_projects_updated_at BEFORE UPDATE ON innovation_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
