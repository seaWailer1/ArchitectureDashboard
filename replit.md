# AfriPay - Pan-African Fintech SuperApp

## Overview

AfriPay is a comprehensive Pan-African fintech SuperApp designed following TOGAF enterprise architecture principles. The platform features a multi-role wallet system (Consumer/Merchant/Agent), QR code payments, micro-lending, virtual cards, and an extensible mini-app ecosystem. Built to enable lifestyle-based financial inclusion across Africa with support for multiple languages (English, French, Arabic, Swahili) and role evolution capabilities.

Key Features:
- Multi-role wallet with dynamic role switching
- QR payment system for instant transactions  
- Micro-loan application with automated interest calculation
- Virtual card management for secure online payments
- KYC verification system with document management
- Agent network for cash-in/cash-out services
- Merchant dashboard with business analytics
- Mini-app ecosystem foundation for third-party services
- Comprehensive account management with security controls
- User preferences and notification settings
- Device management and security monitoring
- Support ticket system and account recovery
- Advanced wallet functionality with multiple wallet types (Primary, Savings, Crypto, Investment)
- Digital currency support including fiat, cryptocurrencies, stablecoins, and CBDCs
- Investment products with automated interest calculation and portfolio tracking
- Credit facilities including credit lines, overdrafts, and payday advances
- Real-time cryptocurrency price tracking and portfolio management
- Demo data seeding for realistic user experience testing across all roles
- Complete crypto trading platform with buy/sell orders and portfolio tracking
- Investment products marketplace with automated returns calculation
- Administrative dashboard with comprehensive KPI monitoring and system health tracking
- Bill payment system, shopping marketplace, and ride-hailing service integrations
- Advanced multi-currency trading and arbitrage tools with real-time opportunity detection
- AI-powered market analysis and predictive insights for trading optimization
- Complete bill payment system with utilities, telecom, and entertainment services
- Shopping marketplace with African sellers and local product discovery
- Ride-hailing service with multiple vehicle types and safety features
- Advanced e-commerce module with merchant dashboard and customer order management
- Demo data generator integrated into admin portal for streamlined testing

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Component Library**: Shadcn/ui for consistent design system
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express-session with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses

### Data Layer
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Authentication System
- Replit Auth integration for secure user authentication
- Session-based authentication with PostgreSQL session store
- User profile management with role-based access
- Mandatory session and user tables for Replit Auth compatibility

### Multi-Role Wallet System
- Three distinct user roles: Consumer, Merchant, Agent
- Role-based UI and functionality switching
- Wallet management with balance tracking (available and pending)
- Transaction history and management

### Payment Infrastructure
- QR code generation and scanning for payments
- Transaction types: send, receive, topup, withdraw, payment
- Real-time balance updates with optimistic UI updates
- Currency support (USD as default)

### KYC Verification System
- Multi-stage verification process
- Phone verification, document verification, biometric verification
- Status tracking: pending, in_progress, verified, rejected
- Progressive onboarding flow

### Mini-App Ecosystem
- Extensible service platform for third-party integrations
- Categories: Transportation, Shopping, Financial Services
- Placeholder implementations for future service integrations

## Data Flow

### User Authentication Flow
1. User accesses application
2. Replit Auth middleware checks authentication status
3. If unauthenticated, redirects to Replit login
4. Upon successful auth, creates/updates user record
5. Session established and stored in PostgreSQL

### Transaction Flow
1. User initiates transaction (send/receive/topup)
2. Frontend validates input and shows optimistic UI
3. Backend processes transaction and updates wallet balances
4. Transaction record created with appropriate status
5. Real-time UI updates reflect new balances

### QR Payment Flow
1. Merchant generates QR code with payment details
2. Consumer scans QR code using camera
3. Payment confirmation dialog with transaction details
4. Transaction processed between wallets
5. Both parties receive confirmation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **bcryptjs**: Password hashing (for future use)
- **connect-pg-simple**: PostgreSQL session store

### UI/UX Dependencies
- **@radix-ui/***: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library
- **wouter**: Lightweight router

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Replit hosting with integrated PostgreSQL
- Hot reload with Vite development server
- Environment variables for database and session configuration
- Port 5000 for development server

### Production Build
- Vite builds client-side assets to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Static file serving from built assets
- Environment-based configuration

### Database Management
- Drizzle migrations for schema evolution
- Connection string via DATABASE_URL environment variable
- Session table required for Replit Auth functionality
- Automatic wallet creation for new users

## Changelog
- June 21, 2025: Initial setup with TOGAF-aligned architecture
- December 23, 2024: Enhanced schema with comprehensive fintech tables (loans, merchants, agents, KYC documents, mini-apps)
- December 23, 2024: Implemented role-specific dashboards for Merchant and Agent personas
- December 23, 2024: Added Micro Loans application system with interest calculation
- December 23, 2024: Integrated Virtual Card management with security features
- December 23, 2024: Enhanced services page with functional loan and virtual card modules
- December 23, 2024: Implemented comprehensive user account mechanics with security settings, preferences management, device tracking, and support system
- December 23, 2024: Developed advanced wallet functionality with multi-currency support, digital assets management, cryptocurrency holdings, investment products, and credit facilities
- December 23, 2024: Created comprehensive demo data seeding system with role-specific sample transactions, holdings, and business scenarios
- December 23, 2024: Completed full app implementation with crypto trading platform, investment products marketplace, and comprehensive admin dashboard for system monitoring and KPI tracking
- December 23, 2024: Implemented advanced multi-currency trading and arbitrage tools with real-time market analysis, automated opportunity detection, and AI-powered trading insights
- December 23, 2024: Developed complete service ecosystem including bill payments (utilities, telecom, entertainment), shopping marketplace with African sellers, and ride-hailing service with safety features and multiple vehicle options
- December 23, 2024: Enhanced e-commerce module with comprehensive merchant dashboard, customer order management, product inventory system, and advanced analytics. Moved demo data generator to admin portal for improved organization and accessibility
- June 23, 2025: Consolidated all demo data functionality into the Admin Module under Demo Data Management tab, removing scattered demo components and centralizing data generation, seeding, and cleanup operations for better organization and reduced module resolution conflicts
- June 23, 2025: Implemented automatic demo data population system - all new users and empty wallets are automatically seeded with realistic sample data including transactions, holdings, investments, and credit facilities to provide immediate functional experience
- June 23, 2025: Created comprehensive Wallets page with total balance calculation, portfolio overview showing net worth breakdown (cash, crypto, investments, credit), and tabbed interface for managing all wallet types with dedicated actions for each category
- June 23, 2025: Removed tabbed section from home page enhanced wallet summary component and reorganized Wallets page with wallet type-specific tabs (Primary, Crypto, Savings, Investment) for better organization and user experience
- June 23, 2025: Moved role-switching functionality from home page to profile page with enhanced UI showing current role, role descriptions, and dropdown selection for role switching. Includes visual role indicators and descriptions for Consumer, Merchant, and Agent roles
- June 23, 2025: Implemented comprehensive role-based dashboard customization with dedicated dashboard components for Consumer, Merchant, and Agent roles. Each role displays tailored content, metrics, and quick actions relevant to their specific use cases and business needs
- June 23, 2025: Enhanced wallet page UI/UX with modern gradient designs, improved visual hierarchy, interactive elements, progress indicators, and role-specific styling for each wallet type (Primary, Crypto, Savings, Investment) with enhanced cards, performance metrics, and engaging animations
- June 23, 2025: Implemented comprehensive onboarding, signin, and KYC journeys with step-by-step flows, phone verification, document upload, biometric verification, role selection, and terms acceptance. Added routing logic to guide users through authentication, onboarding, and verification processes before accessing main application
- June 23, 2025: Created preset user accounts system for testing with 7 pre-configured users across different roles (Consumer, Merchant, Agent) and KYC statuses (verified, pending, in_progress). Added Test Users page for development mode with user switching capability and comprehensive sample data generation
- December 23, 2024: Implemented comprehensive integrated delivery hub with multi-category shopping (food, grocery, pharmacy, electronics), real-time order tracking, driver management system, and merchant store management. Added complete e-commerce schema with stores, products, orders, deliveries, drivers, reviews, and coupons tables. Created seamless integration between shopping, payment, and delivery systems with multiple use cases including food delivery, grocery shopping, pharmacy orders, and electronics retail.
- June 23, 2025: Implemented comprehensive testing suite across entire application covering 10 testing categories: Unit Testing, API Testing, Integration Testing, UI/UX Functional Testing, Security & Compliance Testing, Performance Testing, End-to-End Testing, Regression & Automation Testing, User Acceptance Testing, and Blockchain Testing. Added full Ethereum wallet integration with MetaMask connectivity, DeFi protocols, NFT support, and cross-chain bridging. Established 80% test coverage threshold with automated CI/CD pipeline support and production-ready quality assurance framework.

## User Preferences

Preferred communication style: Simple, everyday language.