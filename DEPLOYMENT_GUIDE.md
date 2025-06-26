# 🚀 Savanna Marketplace - Deployment Guide

## Overview

This guide provides deployment configurations optimized for **hobby/free tier accounts** with clear upgrade paths to production-grade infrastructure.

## 🎯 Quick Deploy Options

### 1. Vercel Deployment (Recommended for MVP)

**Free Tier Features:**

- ✅ Static site hosting
- ✅ Serverless functions
- ✅ Daily cron jobs (hobby account limitation)
- ✅ Custom domain
- ✅ SSL certificate

**Deploy Steps:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy to Vercel
vercel

# 3. Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
# ... add other env vars

# 4. Deploy production
vercel --prod
```

**Hobby Account Limitations:**

- Cron jobs limited to daily frequency
- 100GB bandwidth/month
- 1000 serverless function invocations/day

**Upgrade to Pro ($20/month):**

- Unlimited cron job frequency
- 1TB bandwidth/month
- 1,000,000 function invocations/month
- Team collaboration features

### 2. Render Deployment (Great for Full-Stack)

**Free Tier Features:**

- ✅ 750 hours/month compute
- ✅ Custom domain
- ✅ SSL certificate
- ✅ Daily cron jobs
- ✅ PostgreSQL database (90 days retention)

**Deploy Steps:**

```bash
# 1. Connect GitHub repository to Render
# 2. Use render.yaml configuration (already provided)
# 3. Set environment variables in Render dashboard
# 4. Deploy automatically on git push
```

**Free Tier Limitations:**

- Sleeps after 15 minutes of inactivity
- 512MB RAM
- Shared CPU

**Upgrade to Starter ($7/month):**

- Always-on service
- 1GB RAM
- Dedicated CPU

### 3. AWS Deployment (Production-Ready)

**Free Tier Features (12 months):**

- ✅ 750 hours EC2 t2.micro
- ✅ 5GB S3 storage
- ✅ 1TB CloudFront data transfer
- ✅ 1M Lambda requests/month

**Deploy Steps:**

```bash
# 1. Install AWS CLI
aws configure

# 2. Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name savanna-marketplace \
  --template-body file://aws-deploy.yml \
  --parameters ParameterKey=Environment,ParameterValue=staging

# 3. Upload application to S3
aws s3 sync dist/ s3://savanna-marketplace-assets-staging/

# 4. Create application version in Elastic Beanstalk
```

## 🔧 Configuration Management

### Environment Variables Setup

```bash
# Copy environment template
cp .env.example .env.local

# Fill in required variables:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_STRIPE_PUBLISHABLE_KEY (if using payments)
# - VITE_MPESA_CONSUMER_KEY (for Kenya payments)
```

### Cron Jobs Configuration

**Hobby Account Compatible (Daily):**

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-analytics",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/daily-reports",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/daily-cleanup",
      "schedule": "0 23 * * *"
    }
  ]
}
```

**Pro Account Upgrade (High Frequency):**

```json
{
  "crons": [
    {
      "path": "/api/cron/real-time-sync",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/inventory-check",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/price-updates",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

## 🎚️ Scaling & Upgrade Path

### Phase 1: MVP (Free Tier)

- **Platform**: Vercel/Render Free
- **Database**: Supabase Free (500MB)
- **CDN**: CloudFront Free Tier
- **Monitoring**: Basic logs
- **Expected Load**: 100-1000 users

### Phase 2: Growth ($50-100/month)

- **Platform**: Vercel Pro + Render Starter
- **Database**: Supabase Pro ($25/month)
- **CDN**: CloudFront Pay-as-you-go
- **Monitoring**: Sentry + Datadog
- **Expected Load**: 1000-10000 users

### Phase 3: Scale ($500-1000/month)

- **Platform**: AWS Elastic Beanstalk + RDS
- **Database**: RDS PostgreSQL Multi-AZ
- **CDN**: CloudFront + S3
- **Monitoring**: Full AWS CloudWatch
- **Expected Load**: 10000-100000 users

## 🚨 Troubleshooting Common Issues

### 1. Vercel Cron Job Error

**Error**: "Hobby accounts are limited to daily cron jobs"
**Solution**: Use daily schedules or upgrade to Pro

### 2. Dependency Installation Failures

**Error**: "@radix-ui/react-sheet not found"
**Solution**: Already fixed in package.json - ensure using latest version

### 3. Build Size Warnings

**Warning**: "Chunks larger than 500KB"
**Solution**:

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
});
```

### 4. Environment Variable Issues

**Error**: "VITE* prefix missing"
**Solution**: Ensure client-side vars use VITE* prefix

```bash
# ✅ Correct
VITE_SUPABASE_URL=https://xxx.supabase.co

# ❌ Wrong
SUPABASE_URL=https://xxx.supabase.co
```

## 📊 Performance Optimization

### 1. Code Splitting

```javascript
// Lazy load heavy components
const Dashboard = lazy(() => import("./components/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
```

### 2. Image Optimization

```javascript
// Use optimized image formats
<img
  src="/images/hero.webp"
  alt="Savanna Marketplace"
  loading="lazy"
  width="800"
  height="400"
/>
```

### 3. Bundle Analysis

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/assets
```

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit .env files
- Use different keys for staging/production
- Rotate keys regularly

### 2. CORS Configuration

```javascript
// Restrict CORS origins
const corsOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://savanna-marketplace.com"]
    : ["http://localhost:3000", "http://localhost:5173"];
```

### 3. Content Security Policy

```javascript
// Add CSP headers
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

## 📈 Monitoring & Analytics

### Free Tier Monitoring

- **Vercel Analytics**: Built-in performance metrics
- **Render Logs**: Application logs and errors
- **Supabase Dashboard**: Database performance

### Paid Monitoring Upgrade

- **Sentry**: Error tracking and performance
- **DataDog**: Full application monitoring
- **LogRocket**: Session replay and debugging

## 🎯 Next Steps

1. **Choose deployment platform** based on your needs
2. **Set up environment variables** from .env.example
3. **Deploy to staging** environment first
4. **Test all functionality** including payments and cron jobs
5. **Set up monitoring** and alerts
6. **Plan upgrade path** based on usage growth

---

## 🆘 Support

If you encounter deployment issues:

1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Join our Digital Savannah community for support
4. Open an issue in the GitHub repository

**Happy Deploying! 🦁**
