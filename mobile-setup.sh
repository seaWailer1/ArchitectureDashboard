#!/bin/bash

# AfriPay Mobile Setup Script
# This script initializes the AfriPay mobile application for Android and iOS deployment

set -e

echo "🚀 AfriPay Mobile Setup Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check if running on macOS
IS_MACOS=false
if [[ "$OSTYPE" == "darwin"* ]]; then
    IS_MACOS=true
fi

print_header "System Requirements Check"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm found: $NPM_VERSION"
else
    print_error "npm not found. Please install npm"
    exit 1
fi

# Check Java (for Android)
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n1 | cut -d'"' -f2)
    print_status "Java found: $JAVA_VERSION"
else
    print_warning "Java not found. Required for Android development"
fi

# Check Android SDK
if [ -n "$ANDROID_HOME" ]; then
    print_status "Android SDK found at: $ANDROID_HOME"
else
    print_warning "ANDROID_HOME not set. Required for Android development"
fi

# Check iOS tools (macOS only)
if [ "$IS_MACOS" = true ]; then
    if command -v xcodebuild &> /dev/null; then
        XCODE_VERSION=$(xcodebuild -version | head -n1)
        print_status "Xcode found: $XCODE_VERSION"
    else
        print_warning "Xcode not found. Required for iOS development"
    fi
    
    if command -v pod &> /dev/null; then
        POD_VERSION=$(pod --version)
        print_status "CocoaPods found: $POD_VERSION"
    else
        print_warning "CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi
else
    print_warning "iOS development not available on this platform (macOS required)"
fi

print_header "Project Setup"

# Prompt for project setup method
echo "Choose setup method:"
echo "1. React Native CLI (Full control, custom native code)"
echo "2. Expo CLI (Rapid development, managed workflow)"
read -p "Enter your choice (1 or 2): " SETUP_METHOD

# Prompt for app role
echo ""
echo "Choose app role:"
echo "1. Consumer App (Wallet, payments, savings)"
echo "2. Merchant App (Business dashboard, payment processing)"
echo "3. Agent App (Cash-in/out, commission tracking)"
echo "4. Multi-role App (All roles in one app)"
read -p "Enter your choice (1-4): " APP_ROLE

# Set app name based on role
case $APP_ROLE in
    1) APP_NAME="AfriPayConsumer" ;;
    2) APP_NAME="AfriPayMerchant" ;;
    3) APP_NAME="AfriPayAgent" ;;
    4) APP_NAME="AfriPayMobile" ;;
    *) APP_NAME="AfriPayMobile" ;;
esac

print_status "Setting up $APP_NAME"

# Create project directory
mkdir -p "$APP_NAME"
cd "$APP_NAME"

if [ "$SETUP_METHOD" == "1" ]; then
    print_header "React Native CLI Setup"
    
    # Install React Native CLI
    print_status "Installing React Native CLI..."
    npm install -g @react-native-community/cli
    
    # Create React Native project
    print_status "Creating React Native project..."
    npx react-native init "$APP_NAME" --template react-native-template-typescript
    
    cd "$APP_NAME"
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # iOS setup
    if [ "$IS_MACOS" = true ]; then
        print_status "Setting up iOS dependencies..."
        cd ios
        pod install
        cd ..
    fi
    
elif [ "$SETUP_METHOD" == "2" ]; then
    print_header "Expo CLI Setup"
    
    # Install Expo CLI
    print_status "Installing Expo CLI..."
    npm install -g @expo/cli
    
    # Create Expo project
    print_status "Creating Expo project..."
    npx create-expo-app@latest "$APP_NAME" --template blank-typescript
    
    cd "$APP_NAME"
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
fi

print_header "Installing AfriPay Dependencies"

# Install fintech-specific dependencies
print_status "Installing security and authentication packages..."
npm install react-native-keychain react-native-biometrics @react-native-async-storage/async-storage

print_status "Installing navigation packages..."
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

print_status "Installing UI components..."
npm install react-native-vector-icons react-native-svg react-native-linear-gradient

print_status "Installing financial packages..."
npm install react-native-plaid-link-sdk stripe-react-native

print_status "Installing QR code packages..."
npm install react-native-qrcode-scanner react-native-qrcode-svg

print_status "Installing camera and document scanning..."
npm install react-native-camera react-native-document-scanner-plugin

print_status "Installing push notifications..."
npm install @react-native-firebase/app @react-native-firebase/messaging

print_status "Installing state management..."
npm install @reduxjs/toolkit react-redux

print_header "Configuration Files"

# Create app configuration based on role
print_status "Creating app configuration..."

cat > src/config/appConfig.js << EOF
// AfriPay App Configuration
const appConfig = {
  role: '$(case $APP_ROLE in 1) echo "consumer" ;; 2) echo "merchant" ;; 3) echo "agent" ;; 4) echo "multi-role" ;; esac)',
  features: $(case $APP_ROLE in
    1) echo "['wallet', 'send-money', 'receive-money', 'qr-payments', 'savings-challenges', 'micro-loans', 'virtual-cards', 'bill-payments', 'shopping']" ;;
    2) echo "['business-wallet', 'payment-processing', 'qr-generation', 'sales-analytics', 'inventory-management', 'customer-management', 'bulk-payments']" ;;
    3) echo "['cash-in-out', 'commission-tracking', 'customer-onboarding', 'service-locations', 'agent-network', 'kyc-assistance', 'transaction-support']" ;;
    4) echo "['all-features']" ;;
  esac),
  adminPanel: false,
  apiBaseUrl: __DEV__ ? 'http://localhost:5000' : 'https://api.afripay.com',
  environment: __DEV__ ? 'development' : 'production'
};

export default appConfig;
EOF

# Create environment configuration
print_status "Creating environment configuration..."

cat > .env.development << EOF
API_BASE_URL=http://localhost:5000
ENVIRONMENT=development
LOG_LEVEL=debug
ENABLE_FLIPPER=true
EOF

cat > .env.production << EOF
API_BASE_URL=https://api.afripay.com
ENVIRONMENT=production
LOG_LEVEL=error
ENABLE_FLIPPER=false
EOF

print_header "Platform-Specific Configuration"

# Android configuration
if [ -d "android" ]; then
    print_status "Configuring Android permissions..."
    
    # Update AndroidManifest.xml with required permissions
    cat > android/app/src/main/AndroidManifest.xml << EOF
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.afripay.mobile">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.USE_FINGERPRINT" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF
fi

# iOS configuration
if [ -d "ios" ] && [ "$IS_MACOS" = true ]; then
    print_status "Configuring iOS permissions..."
    
    # Note: Info.plist configuration would be done through Xcode
    # Create a script to update Info.plist
    cat > ios/update_info_plist.sh << 'EOF'
#!/bin/bash
# Script to update Info.plist with required permissions
/usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string 'AfriPay needs camera access for QR code scanning and document verification'" ios/AfriPay/Info.plist
/usr/libexec/PlistBuddy -c "Add :NSFaceIDUsageDescription string 'AfriPay uses Face ID for secure authentication'" ios/AfriPay/Info.plist
/usr/libexec/PlistBuddy -c "Add :NSLocationWhenInUseUsageDescription string 'AfriPay needs location access for agent services and fraud prevention'" ios/AfriPay/Info.plist
EOF
    chmod +x ios/update_info_plist.sh
fi

print_header "Development Scripts"

# Create package.json scripts
print_status "Adding development scripts..."

# Read current package.json and add scripts
if [ -f "package.json" ]; then
    # Create a temporary file with additional scripts
    cat > temp_scripts.json << EOF
{
  "android": "npx react-native run-android",
  "ios": "npx react-native run-ios",
  "android:release": "npx react-native run-android --variant=release",
  "ios:release": "npx react-native run-ios --configuration Release",
  "android:build": "cd android && ./gradlew assembleRelease",
  "android:bundle": "cd android && ./gradlew bundleRelease",
  "ios:build": "cd ios && xcodebuild -workspace AfriPay.xcworkspace -scheme AfriPay -configuration Release -derivedDataPath build",
  "clean": "npx react-native clean",
  "clean:android": "cd android && ./gradlew clean",
  "clean:ios": "cd ios && xcodebuild clean",
  "reset": "npx react-native start --reset-cache",
  "log:android": "npx react-native log-android",
  "log:ios": "npx react-native log-ios"
}
EOF
    
    # Merge scripts using node
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const newScripts = JSON.parse(fs.readFileSync('temp_scripts.json', 'utf8'));
    pkg.scripts = { ...pkg.scripts, ...newScripts };
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    
    rm temp_scripts.json
fi

print_header "Build and Deployment Scripts"

# Create build script
print_status "Creating build scripts..."

cat > build-android.sh << 'EOF'
#!/bin/bash
# Android Build Script for AfriPay

set -e

echo "🤖 Building Android App"
echo "======================"

# Clean previous builds
echo "Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Install dependencies
echo "Installing dependencies..."
npm install

# Build release APK
echo "Building release APK..."
cd android
./gradlew assembleRelease

# Build release AAB
echo "Building release AAB..."
./gradlew bundleRelease

echo "✅ Android build completed!"
echo "APK: android/app/build/outputs/apk/release/app-release.apk"
echo "AAB: android/app/build/outputs/bundle/release/app-release.aab"
EOF

chmod +x build-android.sh

if [ "$IS_MACOS" = true ]; then
    cat > build-ios.sh << 'EOF'
#!/bin/bash
# iOS Build Script for AfriPay

set -e

echo "🍎 Building iOS App"
echo "=================="

# Clean previous builds
echo "Cleaning previous builds..."
cd ios
xcodebuild clean -workspace AfriPay.xcworkspace -scheme AfriPay
cd ..

# Install dependencies
echo "Installing dependencies..."
npm install

# Install CocoaPods
echo "Installing iOS dependencies..."
cd ios
pod install
cd ..

echo "✅ iOS build setup completed!"
echo "Open ios/AfriPay.xcworkspace in Xcode to build and archive"
EOF

    chmod +x build-ios.sh
fi

print_header "Setup Complete"

print_status "AfriPay Mobile setup completed successfully!"
echo ""
echo "📱 Next Steps:"
echo "1. Navigate to the project directory: cd $APP_NAME"
echo "2. Start the development server: npm start"
echo "3. Run on Android: npm run android"
if [ "$IS_MACOS" = true ]; then
    echo "4. Run on iOS: npm run ios"
fi
echo ""
echo "🔧 Development Commands:"
echo "  npm run android         # Run on Android"
echo "  npm run ios            # Run on iOS (macOS only)"
echo "  npm run clean          # Clean build cache"
echo "  npm run reset          # Reset Metro cache"
echo ""
echo "🚀 Build Commands:"
echo "  ./build-android.sh     # Build Android release"
if [ "$IS_MACOS" = true ]; then
    echo "  ./build-ios.sh         # Setup iOS build"
fi
echo ""
echo "📚 Documentation:"
echo "  See MOBILE_DEPLOYMENT_GUIDE.md for complete documentation"
echo ""
print_status "Happy coding! 🎉"