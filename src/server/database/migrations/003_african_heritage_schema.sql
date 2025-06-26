-- African Heritage Engineering Features Schema
-- Based on pre-colonial African innovations modernized for digital marketplace

-- 1. Granary Inventory Systems (Benin-inspired AI stock forecasting)
CREATE TABLE IF NOT EXISTS granary_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    warehouse_location JSONB NOT NULL, -- {lat, lng, description}
    current_stock INTEGER NOT NULL DEFAULT 0,
    optimal_stock INTEGER NOT NULL DEFAULT 0,
    silo_conditions JSONB NOT NULL DEFAULT '{}', -- humidity, temperature, ventilation
    termite_algorithm_config JSONB NOT NULL DEFAULT '{}',
    forecast_data JSONB NOT NULL DEFAULT '{}',
    preservation_score DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS iot_silo_sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    granary_id UUID REFERENCES granary_inventory(id) ON DELETE CASCADE,
    sensor_type VARCHAR(50) NOT NULL, -- humidity, temperature, ventilation, termite_activity
    current_value DECIMAL(10,4) NOT NULL,
    optimal_range JSONB NOT NULL, -- {min, max, unit}
    alert_threshold DECIMAL(10,4),
    last_reading TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    solar_power_level DECIMAL(5,2) DEFAULT 100.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Talking Drums Network (Yoruba-inspired decentralized communications)
CREATE TABLE IF NOT EXISTS drum_network_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id VARCHAR(50) UNIQUE NOT NULL,
    location JSONB NOT NULL,
    drum_frequency_range JSONB NOT NULL, -- {low_hz, high_hz}
    transmission_radius_km DECIMAL(8,2) DEFAULT 50.00,
    solar_charge_level DECIMAL(5,2) DEFAULT 100.00,
    mesh_connections JSONB DEFAULT '[]', -- array of connected node_ids
    status VARCHAR(20) DEFAULT 'active', -- active, offline, maintenance
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drum_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(100) UNIQUE NOT NULL,
    source_node VARCHAR(50) REFERENCES drum_network_nodes(node_id),
    destination_node VARCHAR(50),
    message_type VARCHAR(50) NOT NULL, -- price_update, stock_alert, transaction, news
    encoded_rhythm JSONB NOT NULL, -- drum pattern encoding
    decoded_content JSONB NOT NULL,
    transmission_path JSONB DEFAULT '[]', -- array of node_ids in transmission route
    priority INTEGER DEFAULT 1, -- 1=low, 5=high
    transmitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    received_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' -- pending, transmitted, received, failed
);

-- 3. Jua Kali Manufacturing (Mbeya iron smelting-inspired localized production)
CREATE TABLE IF NOT EXISTS jua_kali_workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_name VARCHAR(200) NOT NULL,
    location JSONB NOT NULL,
    specialization VARCHAR(100) NOT NULL, -- 3d_printing, metalwork, electronics, textiles
    equipment JSONB NOT NULL DEFAULT '[]',
    solar_furnace_config JSONB DEFAULT '{}',
    recycling_materials JSONB DEFAULT '[]', -- matatu_parts, pet_plastic, iron_sand
    production_capacity INTEGER DEFAULT 0,
    efficiency_score DECIMAL(5,2) DEFAULT 0.00,
    environmental_impact JSONB DEFAULT '{}',
    owner_id UUID REFERENCES users(id),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manufacturing_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID REFERENCES jua_kali_workshops(id),
    product_specification JSONB NOT NULL,
    materials_required JSONB NOT NULL,
    quantity INTEGER NOT NULL,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    actual_completion TIMESTAMP WITH TIME ZONE,
    quality_score DECIMAL(5,2),
    carbon_footprint DECIMAL(10,4) DEFAULT 0.0000,
    cost_breakdown JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    ordered_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Data Aqueducts (Kushite-inspired offline data transmission)
CREATE TABLE IF NOT EXISTS data_aqueduct_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name VARCHAR(200) NOT NULL,
    source_location JSONB NOT NULL,
    destination_location JSONB NOT NULL,
    waypoints JSONB DEFAULT '[]', -- charging stations, hubs
    boda_carriers JSONB DEFAULT '[]', -- registered courier details
    route_distance_km DECIMAL(8,2) NOT NULL,
    average_transit_time INTERVAL,
    encryption_protocol VARCHAR(50) DEFAULT 'AES-256',
    data_capacity_gb DECIMAL(8,2) DEFAULT 32.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offline_data_packets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    packet_id VARCHAR(100) UNIQUE NOT NULL,
    route_id UUID REFERENCES data_aqueduct_routes(id),
    data_payload JSONB NOT NULL, -- encrypted transaction data
    packet_size_mb DECIMAL(8,2) NOT NULL,
    priority INTEGER DEFAULT 1,
    source_hub VARCHAR(100) NOT NULL,
    destination_hub VARCHAR(100) NOT NULL,
    carrier_assignment JSONB,
    encryption_hash VARCHAR(256),
    transmission_status VARCHAR(20) DEFAULT 'queued',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 5. Swahili Microservices (Great Zimbabwe-inspired modular architecture)
CREATE TABLE IF NOT EXISTS microservice_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(100) UNIQUE NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- granary, drum_tower, aqueduct, workshop
    dependencies JSONB DEFAULT '[]', -- other modules this depends on
    api_endpoints JSONB NOT NULL,
    resource_requirements JSONB NOT NULL,
    scaling_config JSONB DEFAULT '{}',
    health_check_url VARCHAR(500),
    documentation_url VARCHAR(500),
    version VARCHAR(20) DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS module_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_module UUID REFERENCES microservice_modules(id),
    target_module UUID REFERENCES microservice_modules(id),
    interaction_type VARCHAR(50) NOT NULL, -- api_call, data_sync, event_trigger
    frequency INTEGER DEFAULT 0, -- calls per hour
    avg_response_time_ms INTEGER DEFAULT 0,
    error_rate DECIMAL(5,2) DEFAULT 0.00,
    last_interaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Blockchain Madrasa (Timbuktu-inspired distributed knowledge)
CREATE TABLE IF NOT EXISTS indigenous_knowledge_nfts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_token_id VARCHAR(100) UNIQUE NOT NULL,
    knowledge_type VARCHAR(100) NOT NULL, -- farming, weather, medicine, crafts
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    knowledge_content JSONB NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, disputed
    elder_verification JSONB DEFAULT '{}', -- elder signatures/approvals
    community_source VARCHAR(200),
    geographical_origin JSONB,
    language_code VARCHAR(10) DEFAULT 'sw', -- sw=Swahili, others
    blockchain_hash VARCHAR(256),
    royalty_percentage DECIMAL(5,2) DEFAULT 5.00,
    usage_count INTEGER DEFAULT 0,
    contributor_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nft_id UUID REFERENCES indigenous_knowledge_nfts(id),
    user_id UUID REFERENCES users(id),
    usage_type VARCHAR(50) NOT NULL, -- viewed, applied, shared, purchased
    context_data JSONB DEFAULT '{}',
    royalty_paid DECIMAL(10,2) DEFAULT 0.00,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text TEXT,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Earthen Firewall (Benin City walls-inspired cyber security)
CREATE TABLE IF NOT EXISTS security_defense_layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layer_name VARCHAR(100) NOT NULL,
    defense_type VARCHAR(50) NOT NULL, -- pattern_detection, transaction_molding, supplier_verification
    ancient_principle VARCHAR(200), -- the pre-colonial defense tactic it's based on
    ai_model_config JSONB NOT NULL,
    threat_patterns JSONB DEFAULT '[]',
    detection_accuracy DECIMAL(5,2) DEFAULT 0.00,
    false_positive_rate DECIMAL(5,2) DEFAULT 0.00,
    response_actions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    last_trained TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_type VARCHAR(100) NOT NULL,
    severity_level INTEGER CHECK (severity_level >= 1 AND severity_level <= 5),
    detection_layer UUID REFERENCES security_defense_layers(id),
    threat_signature JSONB NOT NULL,
    affected_entities JSONB DEFAULT '[]', -- users, transactions, data affected
    response_actions_taken JSONB DEFAULT '[]',
    investigation_notes TEXT,
    resolution_status VARCHAR(20) DEFAULT 'investigating',
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_granary_inventory_location ON granary_inventory USING GIN (warehouse_location);
CREATE INDEX IF NOT EXISTS idx_drum_messages_status ON drum_messages (status, priority);
CREATE INDEX IF NOT EXISTS idx_jua_kali_specialization ON jua_kali_workshops (specialization);
CREATE INDEX IF NOT EXISTS idx_data_packets_status ON offline_data_packets (transmission_status);
CREATE INDEX IF NOT EXISTS idx_knowledge_nfts_type ON indigenous_knowledge_nfts (knowledge_type);
CREATE INDEX IF NOT EXISTS idx_security_incidents_severity ON security_incidents (severity_level, detected_at);

-- Functions for African Heritage calculations
CREATE OR REPLACE FUNCTION calculate_termite_algorithm_stock(
    product_type VARCHAR,
    base_demand INTEGER,
    seasonal_factor DECIMAL DEFAULT 1.0
) RETURNS INTEGER AS $$
BEGIN
    CASE product_type
        WHEN 'maize' THEN RETURN FLOOR(base_demand * 1.2 * seasonal_factor);
        WHEN 'beans' THEN RETURN FLOOR(base_demand * 1.15 * seasonal_factor);
        WHEN 'rice' THEN RETURN FLOOR(base_demand * 1.3 * seasonal_factor);
        ELSE RETURN FLOOR(base_demand * 1.1 * seasonal_factor);
    END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION encode_drum_message(
    message_type VARCHAR,
    content JSONB
) RETURNS JSONB AS $$
DECLARE
    rhythm_pattern JSONB;
BEGIN
    -- Simple encoding based on message type
    CASE message_type
        WHEN 'price_update' THEN 
            rhythm_pattern := '{"pattern": "...-.-", "tempo": "120bpm", "duration": "30s"}';
        WHEN 'stock_alert' THEN 
            rhythm_pattern := '{"pattern": "-.-.-.--", "tempo": "140bpm", "duration": "45s"}';
        WHEN 'transaction' THEN 
            rhythm_pattern := '{"pattern": ".--.--.--", "tempo": "100bpm", "duration": "60s"}';
        ELSE 
            rhythm_pattern := '{"pattern": ".-.-.-", "tempo": "110bpm", "duration": "40s"}';
    END CASE;
    
    RETURN rhythm_pattern || jsonb_build_object('encoded_at', NOW());
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_granary_inventory_modtime BEFORE UPDATE ON granary_inventory FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_jua_kali_workshops_modtime BEFORE UPDATE ON jua_kali_workshops FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_microservice_modules_modtime BEFORE UPDATE ON microservice_modules FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_indigenous_knowledge_nfts_modtime BEFORE UPDATE ON indigenous_knowledge_nfts FOR EACH ROW EXECUTE FUNCTION update_modified_column();
