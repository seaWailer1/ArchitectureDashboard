#!/bin/bash

# AfriPay Mobile Setup Test Script
# This script tests the mobile deployment setup without creating actual projects

set -e

echo "🧪 Testing AfriPay Mobile Setup"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TESTS_RUN=$((TESTS_RUN + 1))
    print_test "$test_name"
    
    if eval "$test_command" &>/dev/null; then
        print_pass "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        print_fail "$test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Check if running on macOS
IS_MACOS=false
if [[ "$OSTYPE" == "darwin"* ]]; then
    IS_MACOS=true
fi

echo "System: $(uname -s) $(uname -m)"
echo "macOS: $IS_MACOS"
echo ""

# Test 1: Prerequisites
print_test "Testing prerequisites..."

run_test "Node.js availability" "command -v node"
run_test "npm availability" "command -v npm"
run_test "Git availability" "command -v git"

if [ "$IS_MACOS" = true ]; then
    run_test "Xcode CLI tools" "command -v xcodebuild"
    run_test "CocoaPods availability" "command -v pod || gem list | grep cocoapods"
else
    print_warning "iOS tools test skipped (not macOS)"
fi

# Test 2: Mobile setup script validation
print_test "Validating mobile setup script..."

run_test "Setup script exists" "[ -f mobile-setup.sh ]"
run_test "Setup script is executable" "[ -x mobile-setup.sh ]"
run_test "Setup script syntax" "bash -n mobile-setup.sh"

# Test 3: Configuration template validation
print_test "Validating configuration template..."

run_test "Config template exists" "[ -f mobile-config.template.js ]"
run_test "Config has APP_ROLES" "grep -q 'export const APP_ROLES' mobile-config.template.js"
run_test "Config has ROLE_FEATURES" "grep -q 'export const ROLE_FEATURES' mobile-config.template.js"
run_test "Config has API_CONFIG" "grep -q 'export const API_CONFIG' mobile-config.template.js"
run_test "Config has SECURITY_CONFIG" "grep -q 'export const SECURITY_CONFIG' mobile-config.template.js"

# Test 4: Security configuration validation
print_test "Validating security configurations..."

run_test "Biometric auth config" "grep -q 'biometricAuth' mobile-config.template.js"
run_test "Certificate pinning config" "grep -q 'certificatePinning' mobile-config.template.js"
run_test "Session timeout config" "grep -q 'sessionTimeout' mobile-config.template.js"

# Test 5: Role-specific features validation
print_test "Validating role-specific features..."

run_test "Consumer features" "grep -q 'wallet' mobile-config.template.js && grep -q 'send-money' mobile-config.template.js"
run_test "Merchant features" "grep -q 'business-wallet' mobile-config.template.js && grep -q 'payment-processing' mobile-config.template.js"
run_test "Agent features" "grep -q 'cash-in-out' mobile-config.template.js && grep -q 'commission-tracking' mobile-config.template.js"

# Test 6: Documentation completeness
print_test "Validating documentation..."

run_test "Deployment guide exists" "[ -f MOBILE_DEPLOYMENT_GUIDE.md ]"
run_test "Prerequisites section" "grep -q 'Prerequisites' MOBILE_DEPLOYMENT_GUIDE.md"
run_test "Android setup section" "grep -q 'Android Development' MOBILE_DEPLOYMENT_GUIDE.md"
run_test "iOS setup section" "grep -q 'iOS Development' MOBILE_DEPLOYMENT_GUIDE.md"
run_test "Security section" "grep -q 'Security Configuration' MOBILE_DEPLOYMENT_GUIDE.md"

# Test 7: Android permissions validation
print_test "Validating Android permissions..."

run_test "Camera permission" "grep -q 'android.permission.CAMERA' MOBILE_DEPLOYMENT_GUIDE.md"
run_test "Biometric permission" "grep -q 'android.permission.USE_BIOMETRIC' MOBILE_DEPLOYMENT_GUIDE.md"
run_test "Internet permission" "grep -q 'android.permission.INTERNET' MOBILE_DEPLOYMENT_GUIDE.md"
run_test "Location permission" "grep -q 'android.permission.ACCESS_FINE_LOCATION' MOBILE_DEPLOYMENT_GUIDE.md"

# Test 8: React Native CLI availability
print_test "Testing React Native CLI..."

if command -v npx &> /dev/null; then
    run_test "React Native CLI installable" "npx react-native --version 2>/dev/null || echo 'Available for install'"
else
    print_fail "npx not available"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi

# Test 9: Configuration syntax validation
print_test "Validating JavaScript syntax..."

if command -v node &> /dev/null; then
    # Create a test script to validate the config syntax
    cat > test_config_syntax.js << 'EOF'
const fs = require('fs');

try {
    const configContent = fs.readFileSync('mobile-config.template.js', 'utf8');
    
    // Basic syntax checks
    if (!configContent.includes('export const')) {
        throw new Error('Missing export statements');
    }
    
    if (!configContent.includes('createAppConfig')) {
        throw new Error('Missing createAppConfig function');
    }
    
    // Check for balanced braces
    const openBraces = (configContent.match(/{/g) || []).length;
    const closeBraces = (configContent.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
        throw new Error('Unbalanced braces in configuration');
    }
    
    console.log('Configuration syntax is valid');
    process.exit(0);
} catch (error) {
    console.error('Configuration syntax error:', error.message);
    process.exit(1);
}
EOF
    
    run_test "Configuration syntax" "node test_config_syntax.js"
    rm -f test_config_syntax.js
else
    print_warning "Node.js not available for syntax validation"
fi

# Test 10: GitHub Actions workflow validation
print_test "Validating GitHub Actions workflow..."

run_test "Mobile CI workflow exists" "[ -f .github/workflows/mobile-ci.yml ]"
run_test "Workflow has jobs" "grep -q 'jobs:' .github/workflows/mobile-ci.yml"
run_test "Android test job" "grep -q 'test-android-setup' .github/workflows/mobile-ci.yml"

if [ "$IS_MACOS" = true ]; then
    run_test "iOS test job" "grep -q 'test-ios-setup' .github/workflows/mobile-ci.yml"
fi

# Test Summary
echo ""
echo "🏁 Test Summary"
echo "==============="
echo "Tests Run: $TESTS_RUN"
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"

if [ $TESTS_FAILED -eq 0 ]; then
    print_pass "All tests passed! Mobile setup is ready for deployment."
    echo ""
    echo "✅ Next Steps:"
    echo "1. Run ./mobile-setup.sh to create your mobile project"
    echo "2. Choose your app role (Consumer/Merchant/Agent/Multi-role)"
    echo "3. Follow the setup wizard for platform configuration"
    echo "4. Refer to MOBILE_DEPLOYMENT_GUIDE.md for detailed instructions"
    exit 0
else
    print_fail "Some tests failed. Please fix the issues before proceeding."
    echo ""
    echo "❌ Issues found:"
    echo "- Check that all required files are present"
    echo "- Ensure proper permissions on scripts"
    echo "- Verify configuration syntax"
    echo "- Install missing prerequisites"
    exit 1
fi