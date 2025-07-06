
# AfriPay SuperApp

[![Deploy to Replit](https://github.com/yourusername/afripay-superapp/workflows/Deploy%20to%20Replit/badge.svg)](https://github.com/yourusername/afripay-superapp/actions)
[![Storybook](https://img.shields.io/badge/Storybook-Live-ff69b4)](https://yourusername.github.io/afripay-superapp/storybook)

A comprehensive African fintech super app built with React, TypeScript, and modern web technologies. AfriPay provides a unified platform for digital payments, wallet management, e-commerce, and financial services across Africa.

## 🚀 Live Demo

- **Application**: [https://afripay-superapp.replit.app](https://afripay-superapp.replit.app)
- **Storybook**: [Component Library](https://yourusername.github.io/afripay-superapp/storybook)

## ✨ Features

### Multi-Role Support
- **Consumer**: Personal wallet, bill payments, money transfers
- **Merchant**: Business dashboard, payment processing, inventory
- **Agent**: Cash-in/out services, commission tracking

### Core Capabilities
- 💰 Multi-currency wallet system
- 📱 QR code payments and generation
- 🏪 E-commerce marketplace
- 🚗 Transportation and delivery services
- 💳 Virtual card management
- 📊 Investment and savings products
- 🎮 Entertainment and mini-apps

### Technical Excellence
- ♿ WCAG AAA accessibility compliance
- 🌍 Multi-language support (50+ languages)
- 📱 Mobile-first responsive design
- 🧪 Comprehensive testing suite
- 📚 Interactive Storybook documentation

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **TanStack Query** for state management

### Backend
- **Node.js** with Express
- **PostgreSQL** with Drizzle ORM
- **Replit Auth** for authentication
- **WebSocket** for real-time features

### Testing & Quality
- **Jest** for unit testing
- **Playwright** for E2E testing
- **Artillery** for performance testing
- **Jest-axe** for accessibility testing

## 🚀 Quick Start

### Deploy on Replit (Recommended)

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/afripay-superapp.git
   ```

2. **Import to Replit**
   - Go to [Replit](https://replit.com/new)
   - Select "Import from GitHub"
   - Enter the repository URL
   - Click "Import and Run"

3. **Environment Setup**
   The application will automatically configure database and environment variables in Replit.

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/afripay-superapp.git
cd afripay-superapp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start Storybook (optional)
npm run storybook
```

## 📱 Component Library

Access our comprehensive component library:

```bash
# Start Storybook locally
npm run storybook
# Visit http://localhost:6006

# Or visit the live Storybook
# https://yourusername.github.io/afripay-superapp/storybook
```

### Component CLI

Manage components efficiently with our built-in CLI:

```bash
# Add a new component
bun codex.component.mts add Forms/PaymentInput input

# List all components
bun codex.component.mts list

# Remove a component
bun codex.component.mts remove Forms/PaymentInput
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:accessibility
npm run test:performance
npm run test:coverage

# E2E testing
npx playwright test
```

## 🚀 Deployment

### Automatic Deployment
- **Main branch**: Auto-deploys to production on Replit
- **Develop branch**: Auto-deploys to staging environment
- **Pull requests**: Triggers automated testing

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy Storybook
npm run deploy:storybook
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Submit a pull request

### Code Standards
- TypeScript for all new code
- WCAG AAA accessibility compliance
- Mobile-first responsive design
- Comprehensive test coverage
- Storybook stories for all components

## 📊 Project Statistics

- **Components**: 103+ reusable components
- **Languages**: 50+ supported languages
- **Test Coverage**: 90%+ coverage target
- **Accessibility**: WCAG AAA compliant
- **Performance**: <100ms API response times

## 🌍 Supported Regions

- 🇳🇬 Nigeria
- 🇰🇪 Kenya
- 🇬🇭 Ghana
- 🇿🇦 South Africa
- 🇪🇬 Egypt
- And more across Africa

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](./docs)
- 🐛 [Report Issues](https://github.com/yourusername/afripay-superapp/issues)
- 💬 [Discussions](https://github.com/yourusername/afripay-superapp/discussions)
- 📧 Contact: support@afripay.com

## 🙏 Acknowledgments

- Built with ❤️ for Africa
- Powered by [Replit](https://replit.com)
- UI components by [Radix UI](https://radix-ui.com)
- Icons by [Lucide](https://lucide.dev)

---

**Made with 🌍 for Africa's digital future**
