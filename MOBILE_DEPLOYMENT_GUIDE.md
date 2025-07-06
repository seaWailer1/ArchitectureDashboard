# AfriPay Mobile Deployment Guide - 2025

## Overview

This guide provides comprehensive instructions for deploying the AfriPay fintech application to mobile platforms using Android CLI and Xcode CLI tools. The deployment supports Consumer, Merchant, and Agent roles without the admin panel.

## Prerequisites

### System Requirements

#### For Android Development
- **Node.js 18+** (LTS recommended)
- **Java Development Kit (JDK) 17** 
- **Android Studio** with SDK Manager
- **Android 15 (API Level 35)** - Latest for 2025
- **Android SDK Build-Tools**
- **Android Emulator**

#### For iOS Development (macOS only)
- **macOS 13+** (required for Xcode 16)
- **Xcode 16+** (mandatory for App Store submissions starting April 24, 2025)
- **iOS 18 SDK** (included with Xcode 16)
- **CocoaPods** for dependency management
- **Watchman** for file watching

## Installation Steps

### 1. Environment Setup

#### Android Environment Setup
```bash
# Install Android Studio from developer.android.com
# Configure Android SDK through SDK Manager

# Set environment variables (macOS/Linux)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# For Windows
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\emulator
set PATH=%PATH%;%ANDROID_HOME%\platform-tools
```

#### iOS Environment Setup (macOS only)
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Install Node.js and Watchman
brew install node watchman

# Verify installations
pod --version
node --version
watchman --version
```

### 2. Project Initialization

#### Method 1: React Native CLI (Recommended for Custom Features)
```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new project
npx react-native init AfriPayMobile

# Navigate to project
cd AfriPayMobile

# Install dependencies
npm install

# iOS-specific setup
cd ios
pod install
cd ..
```

#### Method 2: Expo CLI (For Rapid Development)
```bash
# Install Expo CLI
npm install -g @expo/cli

# Create new project
npx create-expo-app@latest AfriPayMobile --template blank-typescript

# Navigate to project
cd AfriPayMobile

# Install dependencies
npm install
```

### 3. AfriPay-Specific Configuration

#### Install Fintech-Specific Dependencies
```bash
# Security and Authentication
npm install react-native-keychain
npm install react-native-biometrics
npm install @react-native-async-storage/async-storage

# Navigation
npm install @react-navigation/native
npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens
npm install react-native-safe-area-context

# UI Components
npm install react-native-vector-icons
npm install react-native-svg
npm install react-native-linear-gradient

# Financial APIs
npm install react-native-plaid-link-sdk
npm install stripe-react-native

# QR Code functionality
npm install react-native-qrcode-scanner
npm install react-native-qrcode-svg

# Camera and Document Scanning
npm install react-native-camera
npm install react-native-document-scanner-plugin

# Push Notifications
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging

# State Management
npm install @reduxjs/toolkit
npm install react-redux
```

#### Configure Platform-Specific Settings

##### Android Configuration (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
```

##### iOS Configuration (ios/AfriPayMobile/Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>AfriPay needs camera access for QR code scanning and document verification</string>
<key>NSFaceIDUsageDescription</key>
<string>AfriPay uses Face ID for secure authentication</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>AfriPay needs location access for agent services and fraud prevention</string>
```

## Development Commands

### Running the Application

#### Android Development
```bash
# Start Metro bundler
npm start

# Run on Android emulator
npx react-native run-android

# Run on connected Android device
npx react-native run-android --device

# Run in release mode
npx react-native run-android --variant=release

# Clear cache and rebuild
npx react-native run-android --reset-cache
```

#### iOS Development
```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npx react-native run-ios

# Run on specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"

# Run on connected iOS device
npx react-native run-ios --device

# Clear cache and rebuild
npx react-native run-ios --reset-cache
```

### Testing and Debugging

#### Device Management
```bash
# List Android devices
adb devices

# List iOS simulators
xcrun simctl list devices

# Start Android emulator
emulator -avd <emulator_name>

# Start iOS simulator
open -a Simulator
```

#### Debugging Commands
```bash
# Open developer menu (Android)
adb shell input keyevent 82

# Remote debugging
npx react-native start --reset-cache

# Log output
npx react-native log-android
npx react-native log-ios
```

## Production Build and Deployment

### Android Production Build

#### 1. Generate Release Keystore
```bash
cd android/app
keytool -genkeypair -v -keystore afripay-release-key.keystore -alias afripay-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Configure Signing (android/app/build.gradle)
```gradle
android {
    signingConfigs {
        release {
            storeFile file('afripay-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'afripay-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### 3. Build Release APK/AAB
```bash
cd android

# Build APK
./gradlew assembleRelease

# Build AAB for Play Store
./gradlew bundleRelease

# Output files:
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Production Build

#### 1. Open in Xcode
```bash
cd ios
open AfriPayMobile.xcworkspace
```

#### 2. Configure Signing
- Select your project in Xcode
- Go to Signing & Capabilities
- Enable "Automatically manage signing"
- Select your development team

#### 3. Archive and Distribute
- In Xcode, select "Any iOS Device (arm64)"
- Product → Archive
- When archiving completes, select "Distribute App"
- Choose "App Store Connect" for App Store deployment
- Follow the upload process

## Security Configuration for Fintech

### Essential Security Measures

#### 1. Code Obfuscation
```bash
# Android (already configured in build.gradle)
minifyEnabled true
proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"

# iOS (enable Bitcode in Xcode)
# Build Settings → Build Options → Enable Bitcode: Yes
```

#### 2. Certificate Pinning
```javascript
// Add to your network layer
import {NetworkingModule} from 'react-native';

const pinnedCertificates = [
  'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
  'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=',
];
```

#### 3. Root/Jailbreak Detection
```bash
npm install react-native-root-detection
npm install react-native-jailbreak-detection
```

### App Store Deployment

#### Google Play Store
1. Create Google Play Console account
2. Create new application
3. Upload signed AAB file
4. Configure store listing
5. Set up release tracks (Internal → Alpha → Beta → Production)
6. Submit for review

#### Apple App Store
1. Create App Store Connect account
2. Create new app record
3. Upload build via Xcode or Application Loader
4. Configure app metadata
5. Submit for review

## Role-Specific Configurations

### Consumer App Configuration
```javascript
// App.js - Consumer role
const appConfig = {
  role: 'consumer',
  features: [
    'wallet',
    'send-money',
    'receive-money',
    'qr-payments',
    'savings-challenges',
    'micro-loans',
    'virtual-cards',
    'bill-payments',
    'shopping'
  ],
  adminPanel: false
};
```

### Merchant App Configuration
```javascript
// App.js - Merchant role
const appConfig = {
  role: 'merchant',
  features: [
    'business-wallet',
    'payment-processing',
    'qr-generation',
    'sales-analytics',
    'inventory-management',
    'customer-management',
    'bulk-payments'
  ],
  adminPanel: false
};
```

### Agent App Configuration
```javascript
// App.js - Agent role
const appConfig = {
  role: 'agent',
  features: [
    'cash-in-out',
    'commission-tracking',
    'customer-onboarding',
    'service-locations',
    'agent-network',
    'kyc-assistance',
    'transaction-support'
  ],
  adminPanel: false
};
```

## Environment Variables

### Create Environment Configuration
```bash
# .env.development
API_BASE_URL=http://localhost:5000
ENVIRONMENT=development
LOG_LEVEL=debug

# .env.production
API_BASE_URL=https://api.afripay.com
ENVIRONMENT=production
LOG_LEVEL=error
```

## CI/CD Pipeline

### GitHub Actions Configuration
```yaml
# .github/workflows/mobile-build.yml
name: Mobile Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  android-build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build Android
      run: |
        cd android
        ./gradlew assembleRelease
        ./gradlew bundleRelease

  ios-build:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Install CocoaPods
      run: |
        cd ios
        pod install
    - name: Build iOS
      run: npx react-native run-ios --configuration Release
```

## Performance Optimization

### Bundle Size Optimization
```bash
# Enable Hermes (Android)
# android/app/build.gradle
project.ext.react = [
    enableHermes: true
]

# Enable Hermes (iOS)
# ios/Podfile
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => true
)
```

### Memory Management
```javascript
// Use lazy loading for heavy components
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Implement proper cleanup
useEffect(() => {
  const subscription = someAPI.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

## Troubleshooting Common Issues

### Android Issues
```bash
# Clean build
cd android && ./gradlew clean

# Reset Metro cache
npx react-native start --reset-cache

# Clear Android build cache
cd android && ./gradlew clean && ./gradlew build
```

### iOS Issues
```bash
# Clean build
cd ios && xcodebuild clean

# Reset pods
cd ios && pod deintegrate && pod install

# Reset simulator
xcrun simctl erase all
```

## Support and Resources

### Official Documentation
- [React Native Documentation](https://reactnative.dev/)
- [Android Developer Guide](https://developer.android.com/)
- [iOS Developer Guide](https://developer.apple.com/ios/)

### Community Resources
- [React Native Community](https://github.com/react-native-community)
- [Expo Documentation](https://docs.expo.dev/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

### AfriPay-Specific Resources
- AfriPay Developer Portal: [Coming Soon]
- AfriPay API Documentation: [Coming Soon]
- AfriPay SDK Documentation: [Coming Soon]

---

This comprehensive guide provides everything needed to deploy the AfriPay fintech application to mobile platforms using modern CLI tools and best practices for 2025.