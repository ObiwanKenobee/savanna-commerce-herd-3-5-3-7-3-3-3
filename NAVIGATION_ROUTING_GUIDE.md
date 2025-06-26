# Navigation & Routing Structure Guide

## Navigation Component Usage by Route Type

### 1. Wildlife/Savanna Theme Routes

**Navigation:** `SavannahNavigation`
**Footer:** `EnterpriseFooter` (when needed)
**Routes:**

- `/` - Index/Homepage
- `/marketplace` - Digital Savanna Marketplace
- `/innovation-hub` - Innovation Hub (if exists)

### 2. Enterprise Business Routes

**Navigation:** `EnterpriseNavigation`
**Footer:** `EnterpriseFooter`
**Routes:**

- `/enterprise/watering-holes` - Trading Hubs Management
- `/enterprise/herd-directory` - Business Directory
- `/enterprise/swift-retailers` - Retailer Network
- `/enterprise/pack-stories` - Case Studies & Stories
- `/profile` - User Profile Management
- `/cart` - Shopping Cart
- `/orders` - Order Management
- `/credit` - Credit Services
- `/group-buying` - Group Buying Pools
- `/inventory` - Inventory Management
- `/analytics` - Business Analytics
- `/settings` - System Settings
- `/partners` - Partner Management
- `/training` - Training Programs
- `/track` - Shipment Tracking
- `/supply` - Supply Chain
- `/innovation` - Innovation Portal
- `/help/ussd` - USSD Guide

### 3. Enhanced Dashboard Routes

**Navigation:** `EnhancedNavigation`
**Footer:** None (dashboard layout)
**Routes:**

- `/dashboard` - Main Dashboard
- `/dashboard/retailer` - Enhanced Retailer Dashboard
- `/dashboard/supplier` - Enhanced Supplier Dashboard
- `/dashboard/logistics` - Logistics Dashboard

### 4. Admin Routes

**Navigation:** `AdminNavigation`
**Footer:** None (admin layout)
**Routes:**

- `/admin/*` - Admin Dashboard Hub
- `/admin/command-center` - Savanna Command Center
- `/admin/infrastructure` - Infrastructure Management
- `/admin/users` - User Management
- `/admin/security` - Security & Compliance
- `/admin/growth` - Growth Toolkit
- `/admin/governance` - Marketplace Governance
- `/admin/devops` - DevOps Dashboard
- `/admin/logistics` - Logistics Orchestration
- `/admin/monitoring` - Performance Monitoring

### 5. Public/Auth Routes

**Navigation:** None or minimal
**Footer:** Varies
**Routes:**

- `/auth` - Authentication
- `/billing` - Billing Management (has its own layout)

## Key Principles:

1. **Route Segregation**: Each route type has its dedicated navigation component
2. **No Global Navigation**: App.tsx doesn't include global navigation to prevent conflicts
3. **Consistent Theming**: Enterprise routes use enterprise theming, wildlife routes use savanna theming
4. **Footer Strategy**: Enterprise pages get EnterpriseFooter, dashboards and admin don't need footers
5. **Mobile Responsiveness**: All navigation components handle mobile layouts

## Recent Fixes Applied:

✅ Fixed enterprise pages to use `EnterpriseNavigation` instead of `SavannahNavigation`
✅ Added `EnterpriseFooter` to all enterprise pages
✅ Ensured admin pages use `AdminNavigation`
✅ Maintained `SavannahNavigation` for wildlife-themed pages
✅ Dashboard pages keep `EnhancedNavigation`

## Navigation Conflicts Resolution:

The previous navigation conflicts where multiple headers/footers were rendering simultaneously have been resolved by:

1. Removing global navigation from App.tsx
2. Each page handles its own navigation component
3. Clear route-to-navigation mapping as outlined above
