#!/bin/bash
# 🦁 Savanna Marketplace - Environment Setup Script
# This script helps set up environment variables for different deployment environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Wildlife-themed banner
echo -e "${GREEN}"
echo "🦁 ========================================"
echo "   SAVANNA MARKETPLACE ENVIRONMENT SETUP"
echo "   Welcome to the African Tech Ecosystem"
echo "========================================${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment argument is provided
if [ $# -eq 0 ]; then
    print_error "Please specify environment: development, staging, or production"
    echo "Usage: $0 [development|staging|production]"
    exit 1
fi

ENVIRONMENT=$1

print_status "Setting up environment for: ${ENVIRONMENT}"

# Validate environment
case $ENVIRONMENT in
    development|dev)
        ENV_FILE=".env.local"
        ENV_TYPE="development"
        ;;
    staging|stage)
        ENV_FILE=".env.staging"
        ENV_TYPE="staging"
        ;;
    production|prod)
        ENV_FILE=".env.production"
        ENV_TYPE="production"
        ;;
    *)
        print_error "Invalid environment. Use: development, staging, or production"
        exit 1
        ;;
esac

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    print_error ".env.example file not found. Please run this script from the project root."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    print_status "Creating $ENV_FILE from template..."
    cp .env.example "$ENV_FILE"
    print_success "Created $ENV_FILE"
else
    print_warning "$ENV_FILE already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env.example "$ENV_FILE"
        print_success "Overwritten $ENV_FILE"
    else
        print_status "Keeping existing $ENV_FILE"
    fi
fi

# Function to prompt for API key with validation
prompt_api_key() {
    local var_name=$1
    local service_name=$2
    local example_format=$3
    local required=${4:-false}
    
    echo ""
    print_status "Setting up $service_name"
    
    if [ "$required" = true ]; then
        echo -e "${YELLOW}⚠️  This is a REQUIRED service for Kenya operations${NC}"
    fi
    
    echo "Format example: $example_format"
    
    read -p "Enter $var_name (or press Enter to skip): " api_key
    
    if [ -n "$api_key" ]; then
        # Update the environment file
        if grep -q "^$var_name=" "$ENV_FILE"; then
            sed -i.bak "s|^$var_name=.*|$var_name=\"$api_key\"|" "$ENV_FILE"
        else
            echo "$var_name=\"$api_key\"" >> "$ENV_FILE"
        fi
        print_success "✅ $var_name configured"
    elif [ "$required" = true ]; then
        print_warning "⚠️  Skipping required service: $service_name"
    else
        print_status "⏭️  Skipped: $service_name"
    fi
}

# Kenya-specific critical services setup
echo ""
echo -e "${GREEN}🇰🇪 KENYA-CRITICAL SERVICES SETUP${NC}"
echo "================================================"

# M-Pesa (Most Critical for Kenya)
prompt_api_key "VITE_MPESA_CONSUMER_KEY" "M-Pesa API (Safaricom)" "4kGGOlnKAIGmGGOlnKAIGm..." true
prompt_api_key "VITE_MPESA_CONSUMER_SECRET" "M-Pesa Secret" "UYlqkYlqkYlqkYlqkYlq..." true
prompt_api_key "VITE_MPESA_SHORTCODE" "M-Pesa Shortcode" "174379" true
prompt_api_key "VITE_MPESA_PASSKEY" "M-Pesa Passkey" "bfb279f9aa9bdbcf158e97dd..." true

# Africa's Talking (USSD for feature phones)
prompt_api_key "VITE_AFRICAS_TALKING_API_KEY" "Africa's Talking USSD" "atsk_xxxxxxxxxxxxx" true
prompt_api_key "VITE_AFRICAS_TALKING_USERNAME" "Africa's Talking Username" "sandbox or your_username" true

# Supabase (Database)
prompt_api_key "VITE_SUPABASE_URL" "Supabase Project URL" "https://abcdefgh.supabase.co" true
prompt_api_key "VITE_SUPABASE_ANON_KEY" "Supabase Anon Key" "eyJhbGciOiJIUzI1NiIs..." true

echo ""
echo -e "${BLUE}🌍 LOGISTICS & DELIVERY SERVICES${NC}"
echo "================================================"

# Google Maps (Essential for Kenya delivery)
prompt_api_key "VITE_GOOGLE_MAPS_API_KEY" "Google Maps API" "AIzaSyDDDDDDDDDDDDDDDD..." true

# SafeBoda (Kenyan last-mile delivery)
prompt_api_key "SAFEBODA_API_KEY" "SafeBoda API" "sandbox_key_123456" false

# Sendy (Kenyan logistics)
prompt_api_key "SENDY_API_KEY" "Sendy Logistics API" "sendy_api_key_12345" false

# Twilio (SMS/WhatsApp)
prompt_api_key "TWILIO_ACCOUNT_SID" "Twilio Account SID" "ACxxxxxxxxxxxxxxxx" false
prompt_api_key "TWILIO_AUTH_TOKEN" "Twilio Auth Token" "your_auth_token" false

echo ""
echo -e "${YELLOW}💳 ADDITIONAL PAYMENT SERVICES${NC}"
echo "================================================"

# Stripe (International cards)
prompt_api_key "VITE_STRIPE_PUBLISHABLE_KEY" "Stripe Publishable Key" "pk_test_51234567890..." false
prompt_api_key "STRIPE_SECRET_KEY" "Stripe Secret Key" "sk_test_51234567890..." false

# Pesapal (Kenya payment gateway)
prompt_api_key "PESAPAL_CONSUMER_KEY" "Pesapal Consumer Key" "pesapal_consumer_key" false
prompt_api_key "PESAPAL_CONSUMER_SECRET" "Pesapal Consumer Secret" "pesapal_secret" false

echo ""
echo -e "${GREEN}🤖 AI & BUSINESS INTELLIGENCE${NC}"
echo "================================================"

# Google Cloud AI
prompt_api_key "GOOGLE_CLOUD_API_KEY" "Google Cloud API Key" "AIzaSyEEEEEEEEEEEEEE..." false
prompt_api_key "GOOGLE_VISION_API_KEY" "Google Vision API Key" "AIzaSyEEEEEEEEEEEEEE..." false

# Twiga Foods (Kenya B2B food distributor)
prompt_api_key "TWIGA_API_KEY" "Twiga Foods API" "twiga_api_key_12345" false

# IBM Weather (Agriculture forecasting)
prompt_api_key "IBM_WEATHER_API_KEY" "IBM Weather API" "your_weather_api_key" false

echo ""
echo -e "${BLUE}📱 COMMUNICATION & ENGAGEMENT${NC}"
echo "================================================"

# Firebase (Push notifications)
prompt_api_key "VITE_FIREBASE_API_KEY" "Firebase API Key" "AIzaSyBBBBBBBBBBBBBB..." false
prompt_api_key "FIREBASE_SERVER_KEY" "Firebase Server Key" "AAAAAAAAAAA:APA91bHHH..." false

# Intercom (Customer support)
prompt_api_key "VITE_INTERCOM_APP_ID" "Intercom App ID" "your_intercom_app_id" false

echo ""
echo -e "${RED}🔒 SECURITY & COMPLIANCE${NC}"
echo "================================================"

# Jumio KYC
prompt_api_key "JUMIO_API_TOKEN" "Jumio KYC API Token" "your_jumio_token" false

# Terragon CDP
prompt_api_key "TERRAGON_API_KEY" "Terragon CDP API Key" "your_terragon_key" false

# Sentry (Error tracking)
prompt_api_key "VITE_SENTRY_DSN" "Sentry DSN" "https://examplePublicKey@o0.ingest.sentry.io/0" false

# Environment-specific configurations
echo ""
print_status "Applying environment-specific configurations..."

if [ "$ENV_TYPE" = "development" ]; then
    # Development specific settings
    sed -i.bak 's|VITE_APP_ENV=.*|VITE_APP_ENV="development"|' "$ENV_FILE"
    sed -i.bak 's|VITE_APP_URL=.*|VITE_APP_URL="http://localhost:8080"|' "$ENV_FILE"
    sed -i.bak 's|ENABLE_DEBUG_MODE=.*|ENABLE_DEBUG_MODE="true"|' "$ENV_FILE"
    sed -i.bak 's|ENABLE_MOCK_PAYMENTS=.*|ENABLE_MOCK_PAYMENTS="true"|' "$ENV_FILE"
    print_success "Applied development configurations"
    
elif [ "$ENV_TYPE" = "production" ]; then
    # Production specific settings
    sed -i.bak 's|VITE_APP_ENV=.*|VITE_APP_ENV="production"|' "$ENV_FILE"
    sed -i.bak 's|ENABLE_DEBUG_MODE=.*|ENABLE_DEBUG_MODE="false"|' "$ENV_FILE"
    sed -i.bak 's|ENABLE_MOCK_PAYMENTS=.*|ENABLE_MOCK_PAYMENTS="false"|' "$ENV_FILE"
    print_success "Applied production configurations"
fi

# Clean up backup files
rm -f "$ENV_FILE.bak"

# Validate critical environment variables
echo ""
print_status "Validating critical environment variables..."

validate_env_var() {
    local var_name=$1
    local env_file=$2
    
    if grep -q "^$var_name=" "$env_file" && grep "^$var_name=" "$env_file" | grep -v "your_.*\|example\|placeholder" > /dev/null; then
        print_success "✅ $var_name is configured"
        return 0
    else
        print_warning "⚠️  $var_name needs configuration"
        return 1
    fi
}

# Critical validations for Kenya operations
critical_vars=(
    "VITE_MPESA_CONSUMER_KEY"
    "VITE_AFRICAS_TALKING_API_KEY"
    "VITE_SUPABASE_URL"
    "VITE_GOOGLE_MAPS_API_KEY"
)

missing_critical=0
for var in "${critical_vars[@]}"; do
    if ! validate_env_var "$var" "$ENV_FILE"; then
        ((missing_critical++))
    fi
done

# Final status and next steps
echo ""
echo -e "${GREEN}🎉 ENVIRONMENT SETUP COMPLETE!${NC}"
echo "================================================"
print_success "Environment file created: $ENV_FILE"

if [ $missing_critical -gt 0 ]; then
    print_warning "$missing_critical critical API key(s) still need configuration"
    echo ""
    echo -e "${YELLOW}⚠️  NEXT STEPS FOR KENYA OPERATIONS:${NC}"
    echo "1. Get M-Pesa API credentials from Safaricom Developer Portal"
    echo "2. Set up Africa's Talking account for USSD functionality"
    echo "3. Create Supabase project for database"
    echo "4. Get Google Maps API key with Kenya geocoding enabled"
    echo ""
    echo "Edit $ENV_FILE and replace placeholder values with real API keys"
else
    print_success "All critical services are configured! 🎉"
fi

echo ""
echo -e "${BLUE}📚 USEFUL RESOURCES:${NC}"
echo "• M-Pesa API: https://developer.safaricom.co.ke/"
echo "• Africa's Talking: https://africastalking.com/"
echo "• Supabase: https://supabase.com/"
echo "• Google Maps Platform: https://developers.google.com/maps"
echo ""

# Security reminder
echo -e "${RED}🔒 SECURITY REMINDER:${NC}"
echo "• Never commit .env.local or .env.production to version control"
echo "• Use environment variable management systems for production"
echo "• Rotate API keys regularly"
echo "• Monitor API usage and set up billing alerts"
echo ""

print_success "Happy coding in the Savanna! 🦁🌍"
