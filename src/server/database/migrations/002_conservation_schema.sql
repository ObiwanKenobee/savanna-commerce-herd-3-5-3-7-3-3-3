-- Additional tables for conservation impact tracking
-- Run this after the initial schema migration

-- Conservation impact tracking
CREATE TABLE conservation_impacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES lion_loyalty_purchases(id) ON DELETE CASCADE,
    habitat_area_protected DECIMAL(12,2) NOT NULL,
    carbon_offset DECIMAL(10,2) NOT NULL,
    project_name VARCHAR(200),
    location GEOMETRY(POINT, 4326),
    lions_supported INTEGER GENERATED ALWAYS AS (CEIL(habitat_area_protected / 10000)) STORED,
    rangers_funded INTEGER GENERATED ALWAYS AS (CEIL(habitat_area_protected / 1000)) STORED,
    trees_equivalent INTEGER GENERATED ALWAYS AS (CEIL(carbon_offset / 0.025)) STORED,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conservation goals for users
CREATE TABLE conservation_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(100) NOT NULL,
    target_value DECIMAL(12,2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- habitat_area, carbon_offset, lions_supported, etc.
    current_value DECIMAL(12,2) DEFAULT 0,
    achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wildlife sightings for population tracking
CREATE TABLE wildlife_sightings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species VARCHAR(100) NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    location GEOMETRY(POINT, 4326) NOT NULL,
    sighting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    reported_by UUID REFERENCES users(id),
    confidence_level INTEGER DEFAULT 75, -- 0-100
    verified BOOLEAN DEFAULT FALSE,
    verification_method VARCHAR(100), -- GPS Collar, Camera Trap, Visual, etc.
    photos TEXT[], -- Array of photo URLs
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Satellite monitoring data
CREATE TABLE satellite_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location GEOMETRY(POINT, 4326) NOT NULL,
    project_name VARCHAR(200),
    monitoring_date TIMESTAMP WITH TIME ZONE NOT NULL,
    vegetation_index DECIMAL(4,3), -- NDVI value 0-1
    animal_activity INTEGER,
    water_sources INTEGER,
    human_encroachment BOOLEAN DEFAULT FALSE,
    weather_condition VARCHAR(100),
    temperature DECIMAL(4,1),
    data_source VARCHAR(100) DEFAULT 'NASA_FIRMS',
    confidence_score INTEGER DEFAULT 90,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Code lesson submissions and deployments
CREATE TABLE lesson_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES code_school_students(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES code_lessons(id) ON DELETE CASCADE,
    deployment_name VARCHAR(200) NOT NULL,
    deployment_url TEXT,
    github_repo TEXT,
    conservation_impact TEXT, -- Description of real-world impact
    status VARCHAR(20) DEFAULT 'deployed', -- deployed, active, retired
    uptime_percentage DECIMAL(5,2) DEFAULT 100,
    users_served INTEGER DEFAULT 0,
    deployment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_monitored TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wisdom verification and royalty payments
CREATE TABLE wisdom_royalty_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insight_id UUID NOT NULL REFERENCES wisdom_insights(id) ON DELETE CASCADE,
    elder_id UUID NOT NULL REFERENCES elder_profiles(id) ON DELETE CASCADE,
    payment_amount DECIMAL(8,2) NOT NULL,
    payment_currency VARCHAR(3) DEFAULT 'USD',
    ai_usage_count INTEGER NOT NULL,
    accuracy_improvement DECIMAL(5,2), -- Percentage improvement
    payment_method VARCHAR(20), -- stellar, mobile_money, bank_transfer
    blockchain_tx_hash VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chief system case updates and resolution tracking
CREATE TABLE case_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID NOT NULL REFERENCES community_cases(id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL, -- status_change, evidence_added, resolution, escalation
    update_text TEXT NOT NULL,
    updated_by UUID REFERENCES users(id),
    updater_role VARCHAR(50), -- chief, community_member, admin
    attachments TEXT[], -- URLs to documents, photos, etc.
    is_public BOOLEAN DEFAULT TRUE, -- Whether visible to case participants
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community meeting attendance and decisions
CREATE TABLE community_meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chief_id UUID NOT NULL REFERENCES chief_profiles(id) ON DELETE CASCADE,
    meeting_title VARCHAR(200) NOT NULL,
    meeting_description TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200) NOT NULL,
    agenda JSONB, -- Structured agenda items
    attendance_count INTEGER DEFAULT 0,
    decisions_made JSONB, -- Decisions and votes
    meeting_notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tree verification history
CREATE TABLE tree_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    planting_id UUID NOT NULL REFERENCES tree_plantings(id) ON DELETE CASCADE,
    verification_date TIMESTAMP WITH TIME ZONE NOT NULL,
    verification_method VARCHAR(50) NOT NULL, -- satellite, field_visit, drone, photos
    trees_verified INTEGER NOT NULL,
    survival_rate DECIMAL(5,2) NOT NULL,
    health_score INTEGER, -- 0-100
    satellite_image_url TEXT,
    field_notes TEXT,
    verified_by VARCHAR(100), -- Organization or person
    verification_cost DECIMAL(8,2),
    blockchain_recorded BOOLEAN DEFAULT FALSE,
    blockchain_tx_hash VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Elephant movement and route optimization
CREATE TABLE elephant_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    herd_id UUID NOT NULL REFERENCES elephant_herds(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,
    speed DECIMAL(5,2), -- km/h
    direction VARCHAR(20),
    activity VARCHAR(50),
    collar_id VARCHAR(100),
    signal_strength INTEGER, -- 0-100
    battery_level INTEGER, -- 0-100
    nearby_humans BOOLEAN DEFAULT FALSE,
    route_optimization_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route optimization events
CREATE TABLE route_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES delivery_routes(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL, -- elephant_movement, weather, traffic, emergency
    original_route GEOMETRY(LINESTRING, 4326),
    optimized_route GEOMETRY(LINESTRING, 4326),
    optimization_reason TEXT,
    time_saved_minutes INTEGER,
    distance_change_km DECIMAL(6,2),
    carbon_impact_kg DECIMAL(6,2),
    fragmentation_score_before INTEGER,
    fragmentation_score_after INTEGER,
    optimization_algorithm VARCHAR(100),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biohub monitoring data
CREATE TABLE biohub_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    biohub_id UUID NOT NULL REFERENCES biohub_networks(id) ON DELETE CASCADE,
    monitoring_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    active_hives INTEGER NOT NULL,
    pollination_activity DECIMAL(5,2),
    network_uptime DECIMAL(5,2),
    energy_generated_kwh DECIMAL(8,2),
    temperature DECIMAL(4,1),
    humidity DECIMAL(4,1),
    environmental_alert_triggered BOOLEAN DEFAULT FALSE,
    alert_type VARCHAR(100), -- silence, temperature, humidity, vibration
    sensor_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drought monitoring and triggers
CREATE TABLE drought_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location GEOMETRY(POINT, 4326) NOT NULL,
    county VARCHAR(100) NOT NULL,
    monitoring_date DATE NOT NULL,
    rainfall_mm DECIMAL(6,2) NOT NULL,
    temperature_avg DECIMAL(4,1),
    humidity_avg DECIMAL(4,1),
    drought_index DECIMAL(5,2), -- Standardized Precipitation Index
    risk_level VARCHAR(20), -- Low, Medium, High, Critical
    data_source VARCHAR(100) DEFAULT 'NASA_FIRMS',
    policies_triggered INTEGER DEFAULT 0,
    payouts_processed DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refugee skill verification and reviews
CREATE TABLE refugee_skill_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refugee_skill_id UUID NOT NULL REFERENCES refugee_skills(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL, -- UNHCR, skill_test, portfolio, reference
    verified_by VARCHAR(200) NOT NULL,
    verification_date TIMESTAMP WITH TIME ZONE NOT NULL,
    skill_level_confirmed VARCHAR(20), -- Basic, Intermediate, Expert, Master
    notes TEXT,
    verification_documents TEXT[], -- URLs to certificates, references
    is_valid BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace reviews and ratings
CREATE TABLE marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES refugee_marketplace_transactions(id) ON DELETE CASCADE,
    reviewer_type VARCHAR(20) NOT NULL, -- buyer, seller
    reviewer_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    product_quality_rating INTEGER CHECK (product_quality_rating >= 1 AND product_quality_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    would_recommend BOOLEAN DEFAULT TRUE,
    photos TEXT[], -- Review photos
    response_text TEXT, -- Response from the other party
    response_date TIMESTAMP WITH TIME ZONE,
    is_verified_purchase BOOLEAN DEFAULT TRUE,
    helpful_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- === INDEXES FOR NEW TABLES ===

-- Conservation impact indexes
CREATE INDEX idx_conservation_impacts_user_id ON conservation_impacts(user_id);
CREATE INDEX idx_conservation_impacts_location ON conservation_impacts USING GIST(location);
CREATE INDEX idx_conservation_impacts_calculated_at ON conservation_impacts(calculated_at);

-- Wildlife tracking indexes
CREATE INDEX idx_wildlife_sightings_species ON wildlife_sightings(species);
CREATE INDEX idx_wildlife_sightings_location ON wildlife_sightings USING GIST(location);
CREATE INDEX idx_wildlife_sightings_date ON wildlife_sightings(sighting_date);

-- Satellite monitoring indexes
CREATE INDEX idx_satellite_monitoring_location ON satellite_monitoring USING GIST(location);
CREATE INDEX idx_satellite_monitoring_date ON satellite_monitoring(monitoring_date);
CREATE INDEX idx_satellite_monitoring_source ON satellite_monitoring(data_source);

-- Elephant movement indexes
CREATE INDEX idx_elephant_movements_herd_id ON elephant_movements(herd_id);
CREATE INDEX idx_elephant_movements_timestamp ON elephant_movements(timestamp);
CREATE INDEX idx_elephant_movements_location ON elephant_movements USING GIST(location);

-- Tree verification indexes
CREATE INDEX idx_tree_verifications_planting_id ON tree_verifications(planting_id);
CREATE INDEX idx_tree_verifications_date ON tree_verifications(verification_date);

-- Drought monitoring indexes
CREATE INDEX idx_drought_monitoring_location ON drought_monitoring USING GIST(location);
CREATE INDEX idx_drought_monitoring_date ON drought_monitoring(monitoring_date);
CREATE INDEX idx_drought_monitoring_county ON drought_monitoring(county);

-- Marketplace indexes
CREATE INDEX idx_marketplace_reviews_transaction_id ON marketplace_reviews(transaction_id);
CREATE INDEX idx_marketplace_reviews_rating ON marketplace_reviews(rating);

-- === TRIGGERS FOR NEW TABLES ===

CREATE TRIGGER update_conservation_goals_timestamp BEFORE UPDATE ON conservation_goals FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_community_meetings_timestamp BEFORE UPDATE ON community_meetings FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_lesson_deployments_timestamp BEFORE UPDATE ON lesson_deployments FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER update_marketplace_reviews_timestamp BEFORE UPDATE ON marketplace_reviews FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- === FUNCTIONS FOR ECOSYSTEM CALCULATIONS ===

-- Function to calculate user's total conservation impact
CREATE OR REPLACE FUNCTION calculate_user_conservation_impact(user_uuid UUID)
RETURNS TABLE(
    total_habitat_protected DECIMAL,
    total_carbon_offset DECIMAL,
    total_lions_supported INTEGER,
    total_rangers_funded INTEGER,
    achievement_level VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ci.habitat_area_protected), 0) as total_habitat_protected,
        COALESCE(SUM(ci.carbon_offset), 0) as total_carbon_offset,
        COALESCE(SUM(ci.lions_supported), 0) as total_lions_supported,
        COALESCE(SUM(ci.rangers_funded), 0) as total_rangers_funded,
        CASE 
            WHEN COALESCE(SUM(ci.habitat_area_protected), 0) >= 100000 THEN 'Conservation Hero'
            WHEN COALESCE(SUM(ci.habitat_area_protected), 0) >= 50000 THEN 'Habitat Guardian'
            WHEN COALESCE(SUM(ci.habitat_area_protected), 0) >= 10000 THEN 'Pride Leader'
            WHEN COALESCE(SUM(ci.habitat_area_protected), 0) > 0 THEN 'Conservation Champion'
            ELSE 'New Member'
        END as achievement_level
    FROM conservation_impacts ci
    WHERE ci.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update conservation goals progress
CREATE OR REPLACE FUNCTION update_conservation_goals_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update habitat area goals
    UPDATE conservation_goals cg
    SET 
        current_value = impact.total_habitat,
        achieved = (impact.total_habitat >= cg.target_value),
        achieved_at = CASE 
            WHEN impact.total_habitat >= cg.target_value AND cg.achieved_at IS NULL 
            THEN NOW() 
            ELSE cg.achieved_at 
        END,
        updated_at = NOW()
    FROM (
        SELECT 
            user_id,
            SUM(habitat_area_protected) as total_habitat
        FROM conservation_impacts
        WHERE user_id = NEW.user_id
        GROUP BY user_id
    ) impact
    WHERE cg.user_id = impact.user_id 
      AND cg.metric_type = 'habitat_area';

    -- Update carbon offset goals
    UPDATE conservation_goals cg
    SET 
        current_value = impact.total_carbon,
        achieved = (impact.total_carbon >= cg.target_value),
        achieved_at = CASE 
            WHEN impact.total_carbon >= cg.target_value AND cg.achieved_at IS NULL 
            THEN NOW() 
            ELSE cg.achieved_at 
        END,
        updated_at = NOW()
    FROM (
        SELECT 
            user_id,
            SUM(carbon_offset) as total_carbon
        FROM conservation_impacts
        WHERE user_id = NEW.user_id
        GROUP BY user_id
    ) impact
    WHERE cg.user_id = impact.user_id 
      AND cg.metric_type = 'carbon_offset';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conservation goals when new impact is recorded
CREATE TRIGGER update_goals_after_impact 
    AFTER INSERT ON conservation_impacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_conservation_goals_progress();

-- Function to detect drought conditions and trigger payouts
CREATE OR REPLACE FUNCTION check_drought_triggers()
RETURNS void AS $$
DECLARE
    drought_record RECORD;
    policy_record RECORD;
BEGIN
    -- Check for drought conditions in recent monitoring data
    FOR drought_record IN 
        SELECT DISTINCT county, rainfall_mm, monitoring_date
        FROM drought_monitoring
        WHERE monitoring_date >= CURRENT_DATE - INTERVAL '7 days'
          AND rainfall_mm < 50 -- Threshold for drought
          AND risk_level IN ('High', 'Critical')
    LOOP
        -- Find active insurance policies in affected area
        FOR policy_record IN
            SELECT id, farmer_id, coverage_amount, rainfall_threshold_mm
            FROM drought_insurance_policies
            WHERE status = 'Active'
              AND location && ST_Buffer(
                  (SELECT ST_Centroid(ST_Collect(location)) 
                   FROM drought_monitoring 
                   WHERE county = drought_record.county), 
                  0.1 -- ~10km buffer
              )
              AND drought_record.rainfall_mm < rainfall_threshold_mm
        LOOP
            -- Update policy status to trigger payout
            UPDATE drought_insurance_policies
            SET 
                status = 'Claim Pending',
                actual_rainfall_mm = drought_record.rainfall_mm,
                updated_at = NOW()
            WHERE id = policy_record.id;

            -- Log the trigger event
            INSERT INTO job_queue (job_type, job_data, priority)
            VALUES ('drought_payout', json_build_object(
                'policy_id', policy_record.id,
                'farmer_id', policy_record.farmer_id,
                'coverage_amount', policy_record.coverage_amount,
                'actual_rainfall', drought_record.rainfall_mm,
                'county', drought_record.county
            ), 1);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
