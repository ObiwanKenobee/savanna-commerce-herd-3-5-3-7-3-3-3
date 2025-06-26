-- Savannah Ecosystem 2.0 - Initial Database Schema
-- This migration creates all the necessary tables for the ecosystem

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table (central user management)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- user, admin, supplier, retailer, chief, student, elder
    tribe VARCHAR(100),
    location_county VARCHAR(100),
    location_subcounty VARCHAR(100),
    location_coordinates GEOMETRY(POINT, 4326),
    profile_image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for authentication
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === CONSUMER-TO-ECOSYSTEM (C2E) TABLES ===

-- Lion Loyalty Program
CREATE TABLE lion_loyalty_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id VARCHAR(100) NOT NULL,
    purchase_amount DECIMAL(10,2) NOT NULL,
    habitat_area_protected DECIMAL(10,2) NOT NULL DEFAULT 10.0, -- m²
    carbon_offset DECIMAL(8,2) NOT NULL DEFAULT 2.5, -- kg CO²
    conservation_project VARCHAR(100),
    gps_coordinates GEOMETRY(POINT, 4326),
    gs1_passport_id VARCHAR(100),
    nft_certificate_id VARCHAR(100),
    blockchain_tx_hash VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wildlife adoptions (Eco-Digital Twins)
CREATE TABLE wildlife_adoptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    animal_id VARCHAR(50) NOT NULL,
    animal_name VARCHAR(100) NOT NULL,
    species VARCHAR(100) NOT NULL,
    nft_collar_id VARCHAR(100) UNIQUE NOT NULL,
    adoption_date DATE NOT NULL,
    monthly_fee DECIMAL(8,2) NOT NULL,
    ranger_supported VARCHAR(100),
    last_location GEOMETRY(POINT, 4326),
    health_status VARCHAR(50) DEFAULT 'Good',
    total_contributed DECIMAL(10,2) DEFAULT 0,
    ar_visit_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wildlife tracking data
CREATE TABLE wildlife_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adoption_id UUID NOT NULL REFERENCES wildlife_adoptions(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    speed DECIMAL(5,2), -- km/h
    direction VARCHAR(20),
    activity VARCHAR(50), -- Migrating, Foraging, Resting, Alert
    nearby_animals INTEGER DEFAULT 0,
    temperature DECIMAL(4,1),
    weather_conditions VARCHAR(100),
    collar_battery_level INTEGER,
    signal_strength VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === EDUCATION-TO-ENTERPRISE (E2E) TABLES ===

-- Savanna Code Schools
CREATE TABLE code_school_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    school_location VARCHAR(100) NOT NULL,
    grade_level VARCHAR(20),
    programming_language VARCHAR(50) DEFAULT 'Python',
    preferred_language VARCHAR(10) DEFAULT 'Swahili', -- Swahili, English
    lessons_completed INTEGER DEFAULT 0,
    tools_deployed INTEGER DEFAULT 0,
    conservation_impact_score INTEGER DEFAULT 0,
    certificates_earned INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code lessons and curriculum
CREATE TABLE code_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- Beginner, Intermediate, Advanced
    language VARCHAR(10) NOT NULL, -- Swahili, English
    conservation_topic VARCHAR(100) NOT NULL,
    code_template TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    learning_objectives TEXT[],
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student lesson progress
CREATE TABLE student_lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES code_school_students(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES code_lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed, deployed
    submitted_code TEXT,
    execution_result TEXT,
    completion_date TIMESTAMP WITH TIME ZONE,
    deployment_date TIMESTAMP WITH TIME ZONE,
    conservation_points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, lesson_id)
);

-- Indigenous Knowledge DAOs
CREATE TABLE elder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    elder_name VARCHAR(100) NOT NULL,
    tribe VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    years_of_experience INTEGER NOT NULL,
    verification_level VARCHAR(20) DEFAULT 'Bronze', -- Bronze, Silver, Gold, Platinum
    wisdom_score INTEGER DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0,
    contributed_insights INTEGER DEFAULT 0,
    blockchain_wallet_address VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Traditional wisdom insights
CREATE TABLE wisdom_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    elder_id UUID NOT NULL REFERENCES elder_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    insight_text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Migration, Weather, Medicinal Plants, Water Sources, Seasonal Patterns
    ai_accuracy_score DECIMAL(5,2) DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    royalties_earned DECIMAL(8,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    nft_token_id VARCHAR(100),
    blockchain_tx_hash VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === GOVERNMENT-TO-GRASSROOTS (G2G) TABLES ===

-- Digital Chief System
CREATE TABLE chief_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chief_name VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    tribal_affiliation VARCHAR(100),
    years_in_office INTEGER NOT NULL,
    cases_resolved INTEGER DEFAULT 0,
    community_rating DECIMAL(3,1) DEFAULT 0,
    digital_skill_level VARCHAR(20) DEFAULT 'Basic', -- Basic, Intermediate, Advanced
    ussd_access_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community dispute cases
CREATE TABLE community_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(50) UNIQUE NOT NULL,
    chief_id UUID NOT NULL REFERENCES chief_profiles(id) ON DELETE CASCADE,
    submitted_by_user_id UUID REFERENCES users(id),
    submitter_name VARCHAR(100) NOT NULL,
    submitter_phone VARCHAR(20),
    case_type VARCHAR(50) NOT NULL, -- Land Dispute, Family Conflict, Resource Management, Environmental Issue
    priority VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Critical
    description TEXT NOT NULL,
    location VARCHAR(200),
    status VARCHAR(30) DEFAULT 'Open', -- Open, Under Review, Resolved, Escalated
    resolution_notes TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather forecasts and grazing data
CREATE TABLE weather_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(100) NOT NULL,
    county VARCHAR(100) NOT NULL,
    forecast_date DATE NOT NULL,
    temperature_min DECIMAL(4,1),
    temperature_max DECIMAL(4,1),
    rainfall_mm DECIMAL(6,2),
    conditions VARCHAR(100),
    grazing_recommendation TEXT,
    risk_level VARCHAR(20), -- Low, Medium, High
    data_source VARCHAR(50) DEFAULT 'MeteorologicalService',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carbon Credit Micro-Exchanges
CREATE TABLE tree_plantings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    planting_id VARCHAR(50) UNIQUE NOT NULL,
    tree_species VARCHAR(100) NOT NULL,
    trees_planted INTEGER NOT NULL,
    planting_date DATE NOT NULL,
    location VARCHAR(200) NOT NULL,
    gps_coordinates GEOMETRY(POINT, 4326),
    estimated_carbon_credits DECIMAL(8,2),
    verification_status VARCHAR(30) DEFAULT 'Planted', -- Planted, Verified, Matured, Credited
    survival_rate DECIMAL(5,2),
    payout_earned DECIMAL(8,2) DEFAULT 0,
    satellite_image_urls TEXT[],
    blockchain_registry_hash VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carbon credit transactions
CREATE TABLE carbon_credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planting_id UUID NOT NULL REFERENCES tree_plantings(id) ON DELETE CASCADE,
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trees_verified INTEGER NOT NULL,
    carbon_offset DECIMAL(8,2) NOT NULL,
    credit_tokens INTEGER NOT NULL,
    market_price DECIMAL(6,2) NOT NULL,
    buyer_name VARCHAR(100),
    buyer_organization VARCHAR(200),
    transaction_amount DECIMAL(10,2) NOT NULL,
    blockchain_tx_hash VARCHAR(100),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === WILDLIFE-TO-WALLET (W2W) TABLES ===

-- Elephant herds and tracking
CREATE TABLE elephant_herds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    herd_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    park_reserve VARCHAR(100),
    herd_size INTEGER NOT NULL,
    matriarch_name VARCHAR(100),
    current_activity VARCHAR(50), -- Migrating, Foraging, Resting, Alert
    last_gps_location GEOMETRY(POINT, 4326),
    last_movement TIMESTAMP WITH TIME ZONE,
    tracking_collar_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery route optimizations
CREATE TABLE delivery_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_name VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    original_distance_km DECIMAL(6,2) NOT NULL,
    optimized_distance_km DECIMAL(6,2),
    time_saved_minutes INTEGER DEFAULT 0,
    carbon_reduced_kg DECIMAL(6,2) DEFAULT 0,
    fragmentation_score INTEGER, -- 0-100, higher is better
    elephant_collaboration_active BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'Active', -- Active, Rerouted, Delayed, Elephant-Optimized
    route_coordinates GEOMETRY(LINESTRING, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bio-hub networks (beehives)
CREATE TABLE biohub_networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hub_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    gps_coordinates GEOMETRY(POINT, 4326),
    hive_count INTEGER NOT NULL,
    active_hives INTEGER NOT NULL,
    pollination_activity DECIMAL(5,2), -- percentage
    network_uptime DECIMAL(5,2), -- percentage
    energy_generated_kwh DECIMAL(8,2) DEFAULT 0,
    environmental_alerts INTEGER DEFAULT 0,
    clean_energy_credits DECIMAL(8,2) DEFAULT 0,
    last_monitored TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === CRISIS-TO-OPPORTUNITY (C2O) TABLES ===

-- Drought insurance policies
CREATE TABLE drought_insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_number VARCHAR(50) UNIQUE NOT NULL,
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_type VARCHAR(50) NOT NULL,
    seed_cost DECIMAL(8,2) NOT NULL,
    premium_paid DECIMAL(8,2) NOT NULL,
    coverage_amount DECIMAL(8,2) NOT NULL,
    rainfall_threshold_mm DECIMAL(6,2) NOT NULL DEFAULT 50,
    location VARCHAR(200) NOT NULL,
    gps_coordinates GEOMETRY(POINT, 4326),
    policy_start_date DATE NOT NULL,
    policy_end_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Active', -- Active, Claim Pending, Paid Out, Expired
    actual_rainfall_mm DECIMAL(6,2),
    payout_amount DECIMAL(8,2),
    payout_date TIMESTAMP WITH TIME ZONE,
    smart_contract_address VARCHAR(100),
    blockchain_tx_hash VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refugee skills marketplace
CREATE TABLE refugee_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refugee_name VARCHAR(100) NOT NULL,
    camp_name VARCHAR(100) NOT NULL,
    unhcr_id VARCHAR(50),
    skill_category VARCHAR(50) NOT NULL, -- Traditional Crafts, Technology, Agriculture, Education, Healthcare
    specific_skill VARCHAR(100) NOT NULL,
    experience_years INTEGER NOT NULL,
    certification_level VARCHAR(20) DEFAULT 'Basic', -- Basic, Intermediate, Expert, Master
    products_available INTEGER DEFAULT 0,
    monthly_earnings DECIMAL(8,2) DEFAULT 0,
    global_buyers INTEGER DEFAULT 0,
    ethical_score INTEGER DEFAULT 0, -- 0-100
    portfolio_images TEXT[],
    contact_method VARCHAR(20) DEFAULT 'platform', -- platform, phone, email
    contact_details JSONB,
    blockchain_wallet_address VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refugee marketplace transactions
CREATE TABLE refugee_marketplace_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    refugee_skill_id UUID NOT NULL REFERENCES refugee_skills(id) ON DELETE CASCADE,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_email VARCHAR(255),
    buyer_country VARCHAR(100),
    product_description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(8,2) NOT NULL,
    total_amount DECIMAL(8,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(20), -- stellar, bank_transfer, mobile_money
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    shipping_address JSONB,
    tracking_number VARCHAR(100),
    blockchain_tx_hash VARCHAR(100),
    escrow_released BOOLEAN DEFAULT FALSE,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === SYSTEM TABLES ===

-- USSD session management
CREATE TABLE ussd_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    user_id UUID REFERENCES users(id),
    service_code VARCHAR(20) NOT NULL,
    current_menu VARCHAR(50),
    menu_stack TEXT[], -- JSON array of menu history
    session_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- sms, email, push, ussd
    title VARCHAR(200),
    message TEXT NOT NULL,
    channel_data JSONB, -- phone, email, device_token, etc.
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(200) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent TEXT,
    request_size INTEGER,
    response_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Background job queue
CREATE TABLE job_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(50) NOT NULL,
    job_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    priority INTEGER DEFAULT 5, -- 1-10, lower is higher priority
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === INDEXES FOR PERFORMANCE ===

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location_coords ON users USING GIST(location_coordinates);

-- Geospatial indexes
CREATE INDEX idx_wildlife_tracking_location ON wildlife_tracking USING GIST(location);
CREATE INDEX idx_tree_plantings_location ON tree_plantings USING GIST(gps_coordinates);
CREATE INDEX idx_elephant_herds_location ON elephant_herds USING GIST(last_gps_location);
CREATE INDEX idx_biohub_networks_location ON biohub_networks USING GIST(gps_coordinates);

-- Time-based indexes
CREATE INDEX idx_wildlife_tracking_timestamp ON wildlife_tracking(timestamp);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_api_usage_logs_created_at ON api_usage_logs(created_at);

-- Foreign key indexes
CREATE INDEX idx_lion_loyalty_user_id ON lion_loyalty_purchases(user_id);
CREATE INDEX idx_wildlife_adoptions_user_id ON wildlife_adoptions(user_id);
CREATE INDEX idx_student_progress_student_id ON student_lesson_progress(student_id);
CREATE INDEX idx_community_cases_chief_id ON community_cases(chief_id);
CREATE INDEX idx_job_queue_status ON job_queue(status);
CREATE INDEX idx_job_queue_scheduled_at ON job_queue(scheduled_at);

-- === FUNCTIONS AND TRIGGERS ===

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to relevant tables
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_wildlife_adoptions_timestamp BEFORE UPDATE ON wildlife_adoptions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_code_school_students_timestamp BEFORE UPDATE ON code_school_students FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_elder_profiles_timestamp BEFORE UPDATE ON elder_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_chief_profiles_timestamp BEFORE UPDATE ON chief_profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_tree_plantings_timestamp BEFORE UPDATE ON tree_plantings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_elephant_herds_timestamp BEFORE UPDATE ON elephant_herds FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_biohub_networks_timestamp BEFORE UPDATE ON biohub_networks FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_drought_insurance_timestamp BEFORE UPDATE ON drought_insurance_policies FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_refugee_skills_timestamp BEFORE UPDATE ON refugee_skills FOR EACH ROW EXECUTE FUNCTION update_timestamp();
