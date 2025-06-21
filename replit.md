# AfriPay - Pan-African Fintech SuperApp

## Overview

AfriPay is a comprehensive fintech platform designed for the African market, featuring a multi-role wallet system, QR code payments, and an ecosystem of integrated services. The application supports three distinct user roles (Consumer, Merchant, Agent) and provides KYC verification, transaction management, and extensible mini-app functionality.

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
- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.