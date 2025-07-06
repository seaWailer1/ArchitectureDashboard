#!/bin/bash

# AfriPay Mobile Responsiveness Audit & Enhancement Script
# Comprehensive analysis and fixes for mobile UI elements

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
echo -e "${PURPLE}║${NC}${BOLD}          AfriPay Mobile Responsiveness Audit                ${NC}${PURPLE}║${NC}"
echo -e "${PURPLE}║${NC}${BOLD}            Comprehensive UI Enhancement                     ${NC}${PURPLE}║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BOLD}🔍 Mobile Responsiveness Analysis${NC}"
echo ""

# Define directories to check
COMPONENT_DIRS=(
  "client/src/components"
  "client/src/pages"
)

# Define mobile responsiveness patterns to check
MOBILE_PATTERNS=(
  "grid-cols-[0-9]"
  "flex flex-col"
  "sm:flex-row"
  "text-xs"
  "text-sm"
  "text-base"
  "text-lg"
  "text-xl"
  "min-h-\[44px\]"
  "touch-aaa"
  "p-[0-9]"
  "sm:p-[0-9]"
  "gap-[0-9]"
  "sm:gap-[0-9]"
)

# Initialize counters
TOTAL_FILES=0
RESPONSIVE_FILES=0
NON_RESPONSIVE_FILES=0

echo -e "${CYAN}📊 Scanning Components and Pages...${NC}"
echo ""

# Function to check file for mobile responsiveness
check_mobile_responsiveness() {
  local file="$1"
  local responsive_score=0
  local total_checks=0

  # Check for responsive breakpoints
  if grep -q "sm:" "$file"; then
    ((responsive_score++))
  fi
  ((total_checks++))

  # Check for mobile-first grid
  if grep -q "grid-cols-[12]" "$file"; then
    ((responsive_score++))
  fi
  ((total_checks++))

  # Check for touch targets
  if grep -q "min-h-\[44px\]" "$file" || grep -q "touch-aaa" "$file"; then
    ((responsive_score++))
  fi
  ((total_checks++))

  # Check for responsive text
  if grep -q "text-sm.*sm:text-base\|text-xs.*sm:text-sm" "$file"; then
    ((responsive_score++))
  fi
  ((total_checks++))

  # Check for responsive spacing
  if grep -q "p-[23].*sm:p-[456]\|space-y-[23].*sm:space-y-[456]" "$file"; then
    ((responsive_score++))
  fi
  ((total_checks++))

  # Calculate percentage
  local percentage=$((responsive_score * 100 / total_checks))
  
  if [ $percentage -ge 80 ]; then
    echo -e "  ${GREEN}✅ $file (${percentage}% responsive)${NC}"
    ((RESPONSIVE_FILES++))
  elif [ $percentage -ge 50 ]; then
    echo -e "  ${YELLOW}⚠️  $file (${percentage}% responsive - needs improvement)${NC}"
  else
    echo -e "  ${RED}❌ $file (${percentage}% responsive - needs major fixes)${NC}"
    ((NON_RESPONSIVE_FILES++))
  fi
}

# Scan all component and page files
for dir in "${COMPONENT_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo -e "${BLUE}📁 Scanning: $dir${NC}"
    
    # Find all TypeScript/React files
    while IFS= read -r -d '' file; do
      if [[ "$file" == *.tsx ]] && [[ ! "$file" == *.test.tsx ]] && [[ ! "$file" == *.stories.tsx ]]; then
        ((TOTAL_FILES++))
        check_mobile_responsiveness "$file"
      fi
    done < <(find "$dir" -type f -print0)
    
    echo ""
  fi
done

# Summary Statistics
echo -e "${BOLD}📈 Mobile Responsiveness Summary:${NC}"
echo ""
echo -e "  📊 Total Files Scanned: ${BOLD}$TOTAL_FILES${NC}"
echo -e "  ✅ Responsive Files: ${GREEN}${BOLD}$RESPONSIVE_FILES${NC}"
echo -e "  ❌ Non-Responsive Files: ${RED}${BOLD}$NON_RESPONSIVE_FILES${NC}"

if [ $TOTAL_FILES -gt 0 ]; then
  RESPONSIVE_PERCENTAGE=$((RESPONSIVE_FILES * 100 / TOTAL_FILES))
  echo -e "  📱 Overall Responsiveness: ${BOLD}${RESPONSIVE_PERCENTAGE}%${NC}"
  echo ""
  
  if [ $RESPONSIVE_PERCENTAGE -ge 80 ]; then
    echo -e "${GREEN}🎉 Excellent mobile responsiveness! Most components are optimized.${NC}"
  elif [ $RESPONSIVE_PERCENTAGE -ge 60 ]; then
    echo -e "${YELLOW}⚠️  Good progress, but some components need mobile optimization.${NC}"
  else
    echo -e "${RED}🚨 Significant mobile responsiveness improvements needed.${NC}"
  fi
fi

echo ""
echo -e "${BOLD}🔧 Mobile Responsiveness Guidelines:${NC}"
echo ""
echo -e "  ${CYAN}Breakpoints:${NC}"
echo -e "    • Use 'sm:' prefix for tablet+ (640px+)"
echo -e "    • Use 'lg:' prefix for desktop+ (1024px+)"
echo -e "    • Use 'xl:' prefix for large screens (1280px+)"
echo ""
echo -e "  ${CYAN}Grid Systems:${NC}"
echo -e "    • Mobile: grid-cols-1 or grid-cols-2"
echo -e "    • Tablet: sm:grid-cols-2 or sm:grid-cols-3"
echo -e "    • Desktop: lg:grid-cols-3 or lg:grid-cols-4"
echo ""
echo -e "  ${CYAN}Typography:${NC}"
echo -e "    • Mobile: text-sm, text-base"
echo -e "    • Tablet+: sm:text-base, sm:text-lg"
echo -e "    • Large screens: lg:text-lg, lg:text-xl"
echo ""
echo -e "  ${CYAN}Touch Targets:${NC}"
echo -e "    • Minimum 44px height: min-h-[44px]"
echo -e "    • Use touch-aaa class for accessibility"
echo -e "    • Adequate spacing between interactive elements"
echo ""
echo -e "  ${CYAN}Spacing:${NC}"
echo -e "    • Mobile: p-3, p-4, space-y-3"
echo -e "    • Tablet+: sm:p-4, sm:p-6, sm:space-y-4"
echo -e "    • Desktop: lg:p-6, lg:p-8, lg:space-y-6"
echo ""
echo -e "  ${CYAN}Layout Patterns:${NC}"
echo -e "    • Stack on mobile: flex flex-col"
echo -e "    • Row on larger screens: sm:flex-row"
echo -e "    • Hide/show elements: hidden sm:block"
echo ""

echo -e "${BOLD}🛠️  Quick Fixes for Common Issues:${NC}"
echo ""
echo -e "  ${YELLOW}1. Non-responsive grids:${NC}"
echo -e "     Replace: grid-cols-3"
echo -e "     With: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
echo ""
echo -e "  ${YELLOW}2. Fixed text sizes:${NC}"
echo -e "     Replace: text-lg"
echo -e "     With: text-base sm:text-lg"
echo ""
echo -e "  ${YELLOW}3. Small touch targets:${NC}"
echo -e "     Add: min-h-[44px] touch-aaa"
echo ""
echo -e "  ${YELLOW}4. Fixed padding:${NC}"
echo -e "     Replace: p-6"
echo -e "     With: p-4 sm:p-6"
echo ""
echo -e "  ${YELLOW}5. Non-responsive flex layouts:${NC}"
echo -e "     Replace: flex space-x-4"
echo -e "     With: flex flex-col sm:flex-row gap-3 sm:gap-4"
echo ""

echo -e "${BOLD}🎯 Recommended Mobile-First Classes:${NC}"
echo ""
echo -e "  ${GREEN}Use these utility classes for better mobile experience:${NC}"
echo -e "    • mobile-grid-1: responsive 1-2-3 column grid"
echo -e "    • mobile-grid-2: responsive 2-3-4 column grid"
echo -e "    • mobile-flex-col: stack on mobile, row on larger screens"
echo -e "    • mobile-text-responsive: responsive text sizing"
echo -e "    • mobile-heading-responsive: responsive heading sizes"
echo -e "    • mobile-padding-responsive: responsive padding"
echo -e "    • mobile-spacing-responsive: responsive spacing"
echo ""

echo -e "${BOLD}📱 Testing Recommendations:${NC}"
echo ""
echo -e "  1. Test on actual mobile devices"
echo -e "  2. Use browser dev tools with device emulation"
echo -e "  3. Check touch interactions and scroll behavior"
echo -e "  4. Verify text readability at different sizes"
echo -e "  5. Test horizontal and vertical orientations"
echo ""

echo -e "${GREEN}✨ Mobile responsiveness audit complete!${NC}"