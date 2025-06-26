#!/bin/sh
# 🦁 Savanna Marketplace Health Check Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Health check endpoint
HEALTH_ENDPOINT="http://localhost:8080/health"

# Perform health check
response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "$HEALTH_ENDPOINT")

if [ "$response" = "200" ]; then
    echo "${GREEN}🦁 Savanna Marketplace is healthy${NC}"
    exit 0
else
    echo "${RED}❌ Health check failed - HTTP $response${NC}"
    exit 1
fi
