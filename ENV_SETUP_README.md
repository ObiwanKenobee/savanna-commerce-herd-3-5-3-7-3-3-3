# 🦁 Savanna Marketplace - Environment Setup Guide

Welcome to the African tech ecosystem! This guide will help you set up all the necessary API keys and environment variables for the Savanna Marketplace platform.

## 🚀 Quick Start

### 1. Automatic Setup (Recommended)

```bash
# Make the setup script executable (if on Unix/Linux/Mac)
chmod +x scripts/setup-env.sh

# Run the interactive setup wizard
./scripts/setup-env.sh development
```

### 2. Manual Setup

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the file with your API keys
nano .env.local
```

## 🇰🇪 Kenya-Critical APIs (Must Have)

These APIs are essential for operating in the Kenyan market:

### 1. M-Pesa (Safaricom) 🏦

**Why**: 80% of Kenyans use M-Pesa

- **Get it**: [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
- **Cost**: Free sandbox, production fees apply
- **Setup Time**: 2-3 business days for production

```bash
VITE_MPESA_CONSUMER_KEY="your_key_here"
VITE_MPESA_CONSUMER_SECRET="your_secret_here"
VITE_MPESA_SHORTCODE="174379"
VITE_MPESA_PASSKEY="your_passkey_here"
```

### 2. Africa's Talking (USSD/SMS) 📱

**Why**: Reaches feature phone users (40% of market)

- **Get it**: [Africa's Talking](https://africastalking.com/)
- **Cost**: Pay-per-use ($0.005 per SMS)
- **Setup Time**: Instant

```bash
VITE_AFRICAS_TALKING_API_KEY="your_key_here"
VITE_AFRICAS_TALKING_USERNAME="your_username"
```

### 3. Google Maps 🗺️

**Why**: Essential for delivery and location services

- **Get it**: [Google Cloud Console](https://console.cloud.google.com/)
- **Cost**: Free tier available, then pay-per-use
- **Setup Time**: Instant

```bash
VITE_GOOGLE_MAPS_API_KEY="your_key_here"
```

### 4. Supabase (Database) 🗄️

**Why**: Affordable PostgreSQL + Auth

- **Get it**: [Supabase](https://supabase.com/)
- **Cost**: Free tier up to 2 projects
- **Setup Time**: 5 minutes

```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your_anon_key_here"
```

## 🌍 Additional Services (Recommended)

### Payment Gateways

- **Stripe**: International cards (`STRIPE_SECRET_KEY`)
- **Pesapal**: Visa/Mastercard/Airtel (`PESAPAL_CONSUMER_KEY`)
- **PayPal**: International suppliers (`VITE_PAYPAL_CLIENT_ID`)

### Logistics & Delivery

- **SafeBoda**: Boda boda delivery (`SAFEBODA_API_KEY`)
- **Sendy**: Trucking logistics (`SENDY_API_KEY`)
- **Twilio**: SMS/WhatsApp notifications (`TWILIO_ACCOUNT_SID`)

### AI & Intelligence

- **Google Vision**: Product image recognition (`GOOGLE_VISION_API_KEY`)
- **Twiga Foods**: Wholesale price sync (`TWIGA_API_KEY`)
- **IBM Weather**: Agricultural forecasting (`IBM_WEATHER_API_KEY`)

## 📁 Environment Files

### Development (`.env.local`)

- Used for local development
- Contains sandbox/test API keys
- Safe to use dummy values for testing

### Production (`.env.production`)

- Used for live deployment
- **NEVER commit to version control**
- Contains real API keys and secrets

### Template (`.env.example`)

- Template with placeholder values
- Safe to commit to version control
- Used as reference for required variables

## 🔒 Security Best Practices

### ✅ DO:

- Use environment-specific API keys (sandbox vs production)
- Rotate API keys regularly (quarterly)
- Monitor API usage and set billing alerts
- Use strong, unique passwords for all accounts
- Enable 2FA on all service accounts

### ❌ DON'T:

- Commit `.env.local` or `.env.production` to git
- Share API keys via email or chat
- Use production keys in development
- Hard-code API keys in source code
- Leave default passwords unchanged

## 🇰🇪 Kenya-Specific Configuration

### Currency & Locale

```bash
CURRENCY="KES"
COUNTRY_CODE="KE"
DEFAULT_TIMEZONE="Africa/Nairobi"
DEFAULT_LANGUAGE="en"
SUPPORTED_LANGUAGES="en,sw,ki"
```

### Payment Preferences (by market share)

1. **M-Pesa**: 80% (primary payment method)
2. **Cash on Delivery**: 15%
3. **Bank Transfer**: 3%
4. **International Cards**: 2%

### Network Optimization

```bash
# Optimized for Kenya's network conditions
ENABLE_OFFLINE_MODE="true"
ENABLE_3G_OPTIMIZATION="true"
COMPRESS_IMAGES="true"
LAZY_LOAD_IMAGES="true"
```

## 🛠️ Development Workflow

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/savanna-marketplace.git
cd savanna-marketplace

# Install dependencies
npm install

# Set up environment
./scripts/setup-env.sh development

# Start development server
npm run dev
```

### 2. Adding New APIs

1. Add the new environment variables to `.env.example`
2. Update the setup script (`scripts/setup-env.sh`)
3. Document the API in `docs/API_INTEGRATION_GUIDE.md`
4. Add validation in the application code

### 3. Production Deployment

```bash
# Set up production environment
./scripts/setup-env.sh production

# Build the application
npm run build

# Deploy to AWS
npm run deploy:production
```

## 🚨 Troubleshooting

### Common Issues

#### M-Pesa Integration Errors

```bash
# Check if shortcode is correct
echo $VITE_MPESA_SHORTCODE

# Verify environment (sandbox vs production)
echo $VITE_MPESA_ENVIRONMENT
```

#### Database Connection Issues

```bash
# Test Supabase connection
curl "$VITE_SUPABASE_URL/rest/v1/" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY"
```

#### Missing Environment Variables

```bash
# Check if all critical variables are set
npm run validate:env
```

### Getting Help

#### Technical Support

- **Email**: dev-support@savanna-marketplace.com
- **Slack**: #dev-support
- **Documentation**: [API Integration Guide](docs/API_INTEGRATION_GUIDE.md)

#### Community

- **Discord**: [Savanna Developers](https://discord.gg/savanna-dev)
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/your-org/savanna-marketplace/issues)

## 📚 Additional Resources

### Official Documentation

- [M-Pesa API Docs](https://developer.safaricom.co.ke/docs)
- [Africa's Talking Docs](https://africastalking.com/docs)
- [Google Maps Platform](https://developers.google.com/maps/documentation)
- [Supabase Docs](https://supabase.com/docs)

### Kenyan Market Insights

- [Digital Economy Blueprint](https://www.ict.go.ke/digital-economy-blueprint/)
- [Kenya Fintech Report](https://www.centralbank.go.ke/fintech/)
- [USSD Usage Statistics](https://ca.go.ke/statistics/)

### Development Tools

- [Postman Collection](https://documenter.getpostman.com/view/savanna-marketplace)
- [Swagger API Docs](https://api.savanna-marketplace.com/docs)
- [Status Page](https://status.savanna-marketplace.com)

---

## 🦁 Welcome to the Pride!

You're now part of the Savanna Marketplace ecosystem - a platform built by Africans, for Africa. Our mission is to democratize trade across the continent by making B2B commerce as simple as sending an M-Pesa.

**Happy coding!** 🌍

---

_Last Updated: January 2025_
_Need help? Contact us at dev-support@savanna-marketplace.com_
