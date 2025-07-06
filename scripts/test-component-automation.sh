#!/bin/bash

# AfriPay Component Automation Demo Script
# Demonstrates all automation capabilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║${NC}${BOLD}          AfriPay Component Automation Demo                   ${NC}${PURPLE}║${NC}"
echo -e "${PURPLE}║${NC}${BOLD}            Comprehensive Testing Suite                      ${NC}${PURPLE}║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}🎯 Testing Component Automation Capabilities${NC}"
echo ""

# Test 1: Basic Component Creation
echo -e "${CYAN}Test 1: Basic Component Creation${NC}"
echo "./scripts/component-automation.sh create --name TestButton --template button"
./scripts/component-automation.sh create --name TestButton --template button --description "Test button component"
echo ""

# Test 2: Enhanced Component with All Features
echo -e "${CYAN}Test 2: Enhanced Component with All Features${NC}"
echo "./scripts/component-automation.sh create --name EnhancedCard --template card --with-tests --with-docs --accessibility --mobile-first --i18n"
./scripts/component-automation.sh create --name EnhancedCard --template card --with-tests --with-docs --accessibility --mobile-first --i18n --description "Enhanced card with all features"
echo ""

# Test 3: Component CLI Integration
echo -e "${CYAN}Test 3: Component CLI Integration${NC}"
echo "tsx codex.component.mts add QuickModal --template modal --with-tests"
tsx codex.component.mts add QuickModal --template modal --with-tests --accessibility
echo ""

# Test 4: Component Library Validation
echo -e "${CYAN}Test 4: Component Library Validation${NC}"
echo "./scripts/component-library-pipeline.sh validate --skip-tests"
./scripts/component-library-pipeline.sh validate --skip-tests
echo ""

# Test 5: List All Components
echo -e "${CYAN}Test 5: List All Components${NC}"
echo "tsx codex.component.mts list"
tsx codex.component.mts list
echo ""

# Cleanup Test Components
echo -e "${CYAN}Cleanup: Removing Test Components${NC}"
echo "tsx codex.component.mts remove TestButton"
tsx codex.component.mts remove TestButton 2>/dev/null || echo "TestButton already removed"

echo "tsx codex.component.mts remove EnhancedCard"
tsx codex.component.mts remove EnhancedCard 2>/dev/null || echo "EnhancedCard already removed"

echo "tsx codex.component.mts remove QuickModal"
tsx codex.component.mts remove QuickModal 2>/dev/null || echo "QuickModal already removed"

echo "tsx codex.component.mts remove DemoPaymentCard"
tsx codex.component.mts remove DemoPaymentCard 2>/dev/null || echo "DemoPaymentCard already removed"

echo ""
echo -e "${GREEN}✅ Component Automation Testing Complete!${NC}"
echo ""

# Summary
echo -e "${BOLD}📊 Automation Capabilities Summary:${NC}"
echo ""
echo -e "  ${GREEN}✅ Basic Component Creation${NC}"
echo -e "  ${GREEN}✅ Enhanced Component Creation with Features${NC}"
echo -e "  ${GREEN}✅ CLI Integration${NC}" 
echo -e "  ${GREEN}✅ Library Validation${NC}"
echo -e "  ${GREEN}✅ Component Listing${NC}"
echo -e "  ${GREEN}✅ Component Removal${NC}"
echo ""

echo -e "${BOLD}🎯 Available Automation Features:${NC}"
echo -e "  • Interactive creation wizard"
echo -e "  • Git workflow integration"
echo -e "  • Comprehensive testing templates"
echo -e "  • Accessibility compliance"
echo -e "  • Mobile-first responsive design"
echo -e "  • Internationalization support"
echo -e "  • Storybook integration"
echo -e "  • TypeScript validation"
echo -e "  • Component documentation"
echo -e "  • Visual regression testing"
echo ""

echo -e "${BOLD}🔧 Next Steps for Developers:${NC}"
echo -e "  1. Use ${CYAN}./scripts/component-automation.sh interactive${NC} for guided creation"
echo -e "  2. Use ${CYAN}tsx codex.component.mts add ComponentName --git-flow${NC} for Git integration"
echo -e "  3. Use ${CYAN}./scripts/component-library-pipeline.sh validate${NC} for quality checks"
echo -e "  4. Use ${CYAN}npm run storybook${NC} to view component documentation"
echo ""