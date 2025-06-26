-- Complete Enterprise Platform Database Schema
-- Savanna Marketplace Production Database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- User profiles and authentication
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT,
    user_type TEXT CHECK (user_type IN ('admin', 'supplier', 'retailer', 'logistics')) NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations (businesses)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    organization_type TEXT CHECK (organization_type IN ('supplier', 'retailer', 'logistics', 'service_provider')) NOT NULL,
    business_license TEXT,
    tax_number TEXT,
    country TEXT DEFAULT 'Kenya',
    region TEXT,
    city TEXT,
    address TEXT,
    coordinates POINT,
    industry TEXT,
    annual_revenue DECIMAL,
    employee_count INTEGER,
    verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    membership_tier TEXT CHECK (membership_tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
    featured BOOLEAN DEFAULT FALSE,
    premium BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES user_profiles(id),
    contact_email TEXT,
    contact_phone TEXT,
    website_url TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    operating_hours JSONB,
    social_links JSONB DEFAULT '{}',
    certifications JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading hubs (watering holes)
CREATE TABLE IF NOT EXISTS trading_hubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    coordinates POINT,
    category TEXT NOT NULL,
    image_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website_url TEXT,
    operating_hours JSONB,
    specialties TEXT[] DEFAULT '{}',
    stats JSONB DEFAULT '{"active_suppliers": 0, "monthly_volume": 0, "rating": 0, "total_trades": 0}',
    status TEXT CHECK (status IN ('active', 'pending', 'inactive')) DEFAULT 'pending',
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business profiles for herd directory
CREATE TABLE IF NOT EXISTS business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    business_type TEXT CHECK (business_type IN ('retailer', 'supplier', 'logistics', 'service_provider')) NOT NULL,
    description TEXT,
    location TEXT,
    contact_info JSONB,
    specialties TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    stats JSONB DEFAULT '{"years_in_business": 0, "total_transactions": 0, "rating": 0, "review_count": 0}',
    verification JSONB DEFAULT '{"business_license": false, "tax_compliance": false, "quality_certification": false, "financial_verification": false}',
    membership_tier TEXT CHECK (membership_tier IN ('bronze', 'silver', 'gold', 'platinum')) DEFAULT 'bronze',
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swift retailers with velocity metrics
CREATE TABLE IF NOT EXISTS swift_retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    velocity_score INTEGER DEFAULT 0,
    performance_metrics JSONB DEFAULT '{}',
    speed_indicators JSONB DEFAULT '{}',
    trading_patterns JSONB DEFAULT '{}',
    seasonal_data JSONB DEFAULT '{}',
    achievements JSONB DEFAULT '[]',
    tier_classification TEXT CHECK (tier_classification IN ('lightning', 'cheetah', 'gazelle', 'standard')) DEFAULT 'standard',
    partnership_status TEXT CHECK (partnership_status IN ('open', 'selective', 'closed')) DEFAULT 'open',
    collaboration_features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pack stories (success stories)
CREATE TABLE IF NOT EXISTS pack_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES user_profiles(id),
    author_name TEXT NOT NULL,
    author_role TEXT,
    author_organization TEXT,
    story_type TEXT CHECK (story_type IN ('success', 'innovation', 'partnership', 'growth', 'challenge')) NOT NULL,
    categories TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    media JSONB DEFAULT '{"images": [], "videos": [], "audio": []}',
    impact_metrics JSONB DEFAULT '{}',
    engagement JSONB DEFAULT '{"views": 0, "likes": 0, "shares": 0, "comments": 0}',
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    reading_time INTEGER,
    location TEXT,
    date_occurred DATE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products catalog
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    sku TEXT UNIQUE NOT NULL,
    unit_price DECIMAL NOT NULL,
    bulk_price DECIMAL,
    minimum_order_quantity INTEGER DEFAULT 1,
    stock_quantity INTEGER DEFAULT 0,
    unit_of_measure TEXT NOT NULL,
    origin_country TEXT DEFAULT 'Kenya',
    certifications JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    status TEXT CHECK (status IN ('active', 'inactive', 'out_of_stock')) DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    quality_score INTEGER DEFAULT 0,
    sustainability_rating INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders management
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    buyer_id UUID REFERENCES organizations(id),
    supplier_id UUID REFERENCES organizations(id),
    status TEXT CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    total_amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'KES',
    delivery_address JSONB,
    delivery_date DATE,
    payment_terms TEXT,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    notes TEXT,
    tracking_number TEXT,
    logistics_provider TEXT,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL NOT NULL,
    total_price DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    transaction_id TEXT UNIQUE NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('mpesa', 'card', 'bank_transfer', 'paypal')) NOT NULL,
    amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'KES',
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    provider_response JSONB,
    fees DECIMAL DEFAULT 0,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- M-Pesa specific transactions
CREATE TABLE IF NOT EXISTS mpesa_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_request_id TEXT,
    checkout_request_id TEXT UNIQUE,
    result_code INTEGER,
    result_desc TEXT,
    amount DECIMAL,
    mpesa_receipt_number TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE,
    phone_number TEXT,
    payment_transaction_id UUID REFERENCES payment_transactions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User connections/network
CREATE TABLE IF NOT EXISTS user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES user_profiles(id),
    addressee_id UUID REFERENCES user_profiles(id),
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')) DEFAULT 'pending',
    connection_type TEXT CHECK (connection_type IN ('business', 'personal', 'supplier', 'buyer')) DEFAULT 'business',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id)
);

-- Hub memberships
CREATE TABLE IF NOT EXISTS hub_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hub_id UUID REFERENCES trading_hubs(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    member_type TEXT CHECK (member_type IN ('supplier', 'buyer', 'admin')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hub_id, organization_id)
);

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('order', 'payment', 'system', 'marketing', 'security')) NOT NULL,
    data JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES user_profiles(id),
    organization_id UUID REFERENCES organizations(id),
    event_data JSONB,
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    page_url TEXT,
    referrer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES user_profiles(id),
    reviewee_id UUID REFERENCES organizations(id),
    order_id UUID REFERENCES orders(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory tracking
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    change_type TEXT CHECK (change_type IN ('restock', 'sale', 'adjustment', 'damaged', 'expired')) NOT NULL,
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reference_id UUID, -- Could reference order_id or other relevant id
    notes TEXT,
    created_by UUID REFERENCES user_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(organization_type);
CREATE INDEX IF NOT EXISTS idx_organizations_location ON organizations(country, region, city);
CREATE INDEX IF NOT EXISTS idx_organizations_verification ON organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (basic examples)
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_hubs_updated_at BEFORE UPDATE ON trading_hubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO user_profiles (user_id, email, full_name, user_type) VALUES
    (uuid_generate_v4(), 'admin@savanna-marketplace.com', 'Pride Leader Admin', 'admin'),
    (uuid_generate_v4(), 'supplier@savanna-marketplace.com', 'Acacia Supplies Ltd', 'supplier'),
    (uuid_generate_v4(), 'retailer@savanna-marketplace.com', 'Baobab Retail Chain', 'retailer')
ON CONFLICT (email) DO NOTHING;
