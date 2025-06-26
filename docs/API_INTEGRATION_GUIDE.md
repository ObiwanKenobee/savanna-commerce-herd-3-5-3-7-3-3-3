# 🦁 Savanna Marketplace - API Integration Guide

This comprehensive guide covers all the APIs and platforms integrated into the Savanna Marketplace platform, with a focus on Kenya-specific services and African market optimization.

## 🇰🇪 Kenya-Critical Services (Priority 1)

### 1. M-Pesa API (Safaricom)

**Why Essential**: 80% of Kenyans use M-Pesa for digital transactions

**Setup Steps**:

1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an app for "Lipa Na M-Pesa Online"
3. Get production credentials after sandbox testing

**Environment Variables**:

```bash
VITE_MPESA_CONSUMER_KEY="your_consumer_key"
VITE_MPESA_CONSUMER_SECRET="your_consumer_secret"
VITE_MPESA_SHORTCODE="174379"
VITE_MPESA_PASSKEY="your_passkey"
```

**Features**:

- STK Push for instant payments
- C2B payments from customers
- B2C payouts to suppliers
- Transaction status polling

### 2. Africa's Talking (USSD & SMS)

**Why Essential**: Captures feature phone users (40% of Kenya)

**Setup Steps**:

1. Register at [Africa's Talking](https://africastalking.com/)
2. Purchase a USSD shortcode (e.g., `*384*7#`)
3. Set up SMS sender ID for notifications

**Environment Variables**:

```bash
VITE_AFRICAS_TALKING_API_KEY="your_api_key"
VITE_AFRICAS_TALKING_USERNAME="your_username"
AFRICAS_TALKING_USSD_CODE="*384*7#"
```

**Features**:

- USSD menu for offline ordering
- SMS notifications (95% open rate)
- Bulk SMS for promotions
- Voice calls for critical alerts

### 3. Google Maps API

**Why Essential**: Real-time Nairobi traffic and route optimization

**Setup Steps**:

1. Enable APIs: Maps JavaScript, Places, Directions, Geocoding
2. Restrict API key to your domains
3. Set up billing account

**Environment Variables**:

```bash
VITE_GOOGLE_MAPS_API_KEY="your_api_key"
GOOGLE_PLACES_API_KEY="your_places_key"
GOOGLE_DIRECTIONS_API_KEY="your_directions_key"
```

## 🚚 Logistics & Last-Mile Delivery

### SafeBoda API

**Use Case**: Boda boda delivery for last-mile logistics (10K+ riders)

**Setup**:

1. Contact SafeBoda Business team
2. Get API credentials for delivery integration
3. Set up webhook endpoints

**Environment Variables**:

```bash
SAFEBODA_API_KEY="your_api_key"
SAFEBODA_WEBHOOK_SECRET="your_webhook_secret"
SAFEBODA_ENVIRONMENT="sandbox" # or "production"
```

### Sendy API

**Use Case**: Trucking and warehousing logistics

**Setup**:

1. Register business account with Sendy
2. Get API credentials from developer portal
3. Configure delivery zones

**Environment Variables**:

```bash
SENDY_API_KEY="your_api_key"
SENDY_CLIENT_ID="your_client_id"
SENDY_CLIENT_SECRET="your_client_secret"
```

## 💳 Payment & Financial Services

### Stripe (International Cards)

**Use Case**: Global card payments and fraud detection

**Environment Variables**:

```bash
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_your_key"
STRIPE_SECRET_KEY="sk_live_your_key"
STRIPE_WEBHOOK_SECRET="whsec_your_secret"
```

### Pesapal (Multi-Gateway)

**Use Case**: Fallback for Visa, Mastercard, Airtel Money

**Environment Variables**:

```bash
PESAPAL_CONSUMER_KEY="your_consumer_key"
PESAPAL_CONSUMER_SECRET="your_consumer_secret"
PESAPAL_ENVIRONMENT="live" # or "demo"
```

### Tala/Branch (Credit Scoring)

**Use Case**: BNPL (Buy Now Pay Later) for retailers

**Environment Variables**:

```bash
TALA_API_KEY="your_tala_key"
BRANCH_API_KEY="your_branch_key"
```

## 🤖 AI & Business Intelligence

### Google Cloud AI

**Use Case**: Image recognition for product cataloging

**Features**:

- Auto-tag products from photos
- Extract text from packaging
- Quality assessment

**Environment Variables**:

```bash
GOOGLE_CLOUD_API_KEY="your_api_key"
GOOGLE_VISION_API_KEY="your_vision_key"
```

### Twiga Foods API

**Use Case**: Real-time wholesale price synchronization

**Why Important**: Largest B2B food distributor in Kenya

**Environment Variables**:

```bash
TWIGA_API_KEY="your_api_key"
TWIGA_CLIENT_ID="your_client_id"
TWIGA_CLIENT_SECRET="your_client_secret"
```

### IBM Weather API

**Use Case**: Agricultural demand forecasting

**Features**:

- Drought/flood predictions
- Crop yield forecasting
- Seasonal demand planning

**Environment Variables**:

```bash
IBM_WEATHER_API_KEY="your_api_key"
IBM_WEATHER_URL="https://api.weather.com/v1"
```

## 📱 Communication & Engagement

### Firebase Cloud Messaging

**Use Case**: Push notifications for Android-dominant market

**Environment Variables**:

```bash
FIREBASE_SERVER_KEY="your_server_key"
VITE_FIREBASE_API_KEY="your_api_key"
```

### Twilio (SMS/WhatsApp)

**Use Case**: Multi-channel communication

**Environment Variables**:

```bash
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_WHATSAPP_NUMBER="+14155238886"
```

### Intercom

**Use Case**: Customer support with Swahili language bots

**Environment Variables**:

```bash
VITE_INTERCOM_APP_ID="your_app_id"
INTERCOM_ACCESS_TOKEN="your_access_token"
```

## 📊 Inventory & Warehouse Management

### Zoho Inventory

**Use Case**: Multi-warehouse management (cheaper than SAP)

**Environment Variables**:

```bash
ZOHO_CLIENT_ID="your_client_id"
ZOHO_CLIENT_SECRET="your_client_secret"
ZOHO_REFRESH_TOKEN="your_refresh_token"
```

## 📈 Marketing & Growth

### Facebook Lead Ads

**Use Case**: Shop owner onboarding (15M+ Kenyan Facebook users)

**Environment Variables**:

```bash
FACEBOOK_APP_ID="your_app_id"
FACEBOOK_APP_SECRET="your_app_secret"
FACEBOOK_ACCESS_TOKEN="your_access_token"
```

### Duka Direct API

**Use Case**: Airtime/data reselling for extra retailer revenue

**Environment Variables**:

```bash
DUKA_DIRECT_API_KEY="your_api_key"
DUKA_DIRECT_CLIENT_ID="your_client_id"
```

### Google Ads

**Use Case**: Supplier acquisition targeting "unga wholesale" searches

**Environment Variables**:

```bash
GOOGLE_ADS_CUSTOMER_ID="your_customer_id"
GOOGLE_ADS_DEVELOPER_TOKEN="your_developer_token"
```

## 🔒 Security & Compliance

### Jumio KYC

**Use Case**: Identity verification complying with Kenyan data laws

**Environment Variables**:

```bash
JUMIO_API_TOKEN="your_api_token"
JUMIO_API_SECRET="your_api_secret"
JUMIO_ENVIRONMENT="production"
```

### Terragon CDP

**Use Case**: Customer data platform (GDPR + Kenya Data Protection Act)

**Environment Variables**:

```bash
TERRAGON_API_KEY="your_api_key"
TERRAGON_CLIENT_ID="your_client_id"
```

## 🛠️ Quick Setup Guide

### 1. Development Environment

```bash
# Clone the repository
git clone https://github.com/your-org/savanna-marketplace.git
cd savanna-marketplace

# Run the setup script
./scripts/setup-env.sh development

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Production Deployment

```bash
# Run production setup
./scripts/setup-env.sh production

# Build the application
npm run build

# Deploy to AWS
npm run deploy:production
```

## 🇰🇪 Kenya-Specific Optimizations

### Network Conditions

- **3G Speed Simulation**: 1.6 Mbps download, 768 Kbps upload
- **Mobile-First Design**: 90% of users access via mobile
- **Offline Capabilities**: PWA with service workers

### Language Support

- **English**: Primary business language
- **Swahili**: National language (spoken by 90%)
- **Kikuyu**: Regional language for Central Kenya

### Payment Preferences

1. **M-Pesa**: 80% preference (primary)
2. **Cash on Delivery**: 15% preference
3. **Bank Transfer**: 3% preference
4. **International Cards**: 2% preference

### Delivery Zones

- **Nairobi Metro**: Same-day delivery
- **Major Towns**: 1-2 day delivery
- **Rural Areas**: 3-5 day delivery via matatu networks

## 🚨 Critical Compliance Requirements

### Kenya Data Protection Act (KDPA)

- Data minimization principles
- Explicit consent for data processing
- Right to erasure and portability
- Local data storage requirements

### Kenya Revenue Authority (KRA)

- VAT registration and reporting
- ETR (Electronic Tax Register) integration
- Withholding tax on supplier payments

### Competition Authority of Kenya

- Fair competition practices
- Anti-monopoly compliance
- Consumer protection standards

## 📞 Support Contacts

### Technical Issues

- **Email**: dev-support@savanna-marketplace.com
- **Slack**: #dev-support
- **Phone**: +254-700-SAVANNA

### Business Partnerships

- **Email**: partnerships@savanna-marketplace.com
- **Phone**: +254-700-PARTNERS

### Regulatory Compliance

- **Email**: legal@savanna-marketplace.com
- **Phone**: +254-700-LEGAL

---

_Last Updated: January 2025_
_Version: 1.0.0_

🦁 **Built for Africa, by Africa** 🌍
