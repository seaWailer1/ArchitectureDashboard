import { Request, Response } from 'express';
import { z } from 'zod';
import { validateRequest } from './validation';
import { storage } from './storage';

// Partnership application schema
const partnershipApplicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  businessType: z.string().min(1, 'Business type is required'),
  partnershipType: z.string().min(1, 'Partnership type is required'),
  description: z.string().min(10, 'Please provide a detailed description'),
  expectedVolume: z.string().min(1, 'Expected volume is required'),
  integrationNeeds: z.string().optional(),
  timeline: z.string().min(1, 'Timeline is required'),
});

export function registerPartnershipRoutes(app: any) {
  // Submit partnership application
  app.post('/api/partnerships/apply', 
    validateRequest(partnershipApplicationSchema),
    async (req: Request, res: Response) => {
      try {
        const applicationData = req.body;
        
        // In a real implementation, this would save to database
        // For now, we'll simulate the process
        
        // Create application record
        const application = {
          id: Date.now().toString(),
          ...applicationData,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          reviewedAt: null,
          notes: null
        };

        // Simulate email notification to partnership team
        console.log('Partnership application submitted:', {
          id: application.id,
          company: applicationData.companyName,
          type: applicationData.partnershipType,
          email: applicationData.email
        });

        // In production, you would:
        // 1. Save to database
        // 2. Send notification emails
        // 3. Create tasks for review team
        // 4. Generate application tracking number

        res.json({
          success: true,
          applicationId: application.id,
          message: 'Partnership application submitted successfully',
          nextSteps: [
            'Our team will review your application within 3-5 business days',
            'You will receive an email confirmation shortly',
            'We may reach out for additional information if needed',
            'Upon approval, you will receive API credentials and onboarding materials'
          ]
        });

      } catch (error) {
        console.error('Partnership application error:', error);
        res.status(500).json({
          error: 'Failed to submit partnership application',
          message: 'Please try again later'
        });
      }
    }
  );

  // Get partnership types and requirements
  app.get('/api/partnerships/types', async (req: Request, res: Response) => {
    try {
      const partnershipTypes = [
        {
          id: 'fintech',
          title: 'Fintech Integration',
          description: 'Payment processing, lending, investment services',
          requirements: ['Financial license', 'Security compliance', 'KYC procedures'],
          benefits: ['Revenue sharing', 'API access', 'White-label solutions', 'Technical support'],
          commissionRate: '2.5-3.5%',
          setupFee: '$500',
          monthlyFee: '$50'
        },
        {
          id: 'ecommerce',
          title: 'E-commerce Platform',
          description: 'Online marketplaces, retail integration',
          requirements: ['Business registration', 'SSL certificate', 'API integration'],
          benefits: ['Payment gateway', 'Instant settlements', 'Fraud protection', 'Analytics'],
          commissionRate: '2.0-2.8%',
          setupFee: '$200',
          monthlyFee: '$25'
        },
        {
          id: 'merchant',
          title: 'Merchant Services',
          description: 'Point-of-sale, retail solutions',
          requirements: ['Business license', 'Tax compliance', 'Hardware compatibility'],
          benefits: ['POS integration', 'QR payments', 'Inventory sync', 'Sales reports'],
          commissionRate: '1.8-2.5%',
          setupFee: '$100',
          monthlyFee: '$15'
        },
        {
          id: 'mobile',
          title: 'Mobile App Developer',
          description: 'In-app payments, subscription billing',
          requirements: ['App store approval', 'Privacy policy', 'Security audit'],
          benefits: ['SDK access', 'App store billing', 'User analytics', 'Developer tools'],
          commissionRate: '2.2-3.0%',
          setupFee: '$150',
          monthlyFee: '$20'
        },
        {
          id: 'logistics',
          title: 'Logistics & Delivery',
          description: 'Shipping, last-mile delivery services',
          requirements: ['Transport license', 'Insurance coverage', 'Driver verification'],
          benefits: ['Delivery tracking', 'COD payments', 'Route optimization', 'Customer notifications'],
          commissionRate: '1.5-2.2%',
          setupFee: '$300',
          monthlyFee: '$35'
        },
        {
          id: 'enterprise',
          title: 'Enterprise Solutions',
          description: 'B2B payments, payroll, expense management',
          requirements: ['Enterprise agreement', 'Volume commitments', 'Security certification'],
          benefits: ['Bulk payments', 'Multi-currency', 'Reporting suite', 'Dedicated support'],
          commissionRate: '1.0-1.8%',
          setupFee: '$1000',
          monthlyFee: '$100'
        }
      ];

      res.json(partnershipTypes);
    } catch (error) {
      console.error('Error fetching partnership types:', error);
      res.status(500).json({
        error: 'Failed to fetch partnership types'
      });
    }
  });

  // Get application status
  app.get('/api/partnerships/applications/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // In production, fetch from database
      // For now, return mock data
      const application = {
        id,
        status: 'under_review',
        submittedAt: '2025-01-26T10:00:00Z',
        reviewedAt: null,
        estimatedResponseDate: '2025-01-30T00:00:00Z',
        notes: 'Application is currently under technical review.',
        timeline: [
          {
            step: 'Application Submitted',
            status: 'completed',
            date: '2025-01-26T10:00:00Z'
          },
          {
            step: 'Initial Review',
            status: 'completed',
            date: '2025-01-26T14:00:00Z'
          },
          {
            step: 'Technical Review',
            status: 'in_progress',
            date: null
          },
          {
            step: 'Business Review',
            status: 'pending',
            date: null
          },
          {
            step: 'Final Approval',
            status: 'pending',
            date: null
          }
        ]
      };

      res.json(application);
    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({
        error: 'Failed to fetch application status'
      });
    }
  });

  // Get developer resources
  app.get('/api/partnerships/developer-resources', async (req: Request, res: Response) => {
    try {
      const resources = {
        apis: [
          {
            name: 'Payments API',
            description: 'Process payments, refunds, and transfers',
            version: 'v2.1',
            status: 'stable',
            documentation: '/docs/api/payments',
            playground: '/playground/payments'
          },
          {
            name: 'Users API',
            description: 'User management and authentication',
            version: 'v2.0',
            status: 'stable',
            documentation: '/docs/api/users',
            playground: '/playground/users'
          },
          {
            name: 'KYC API',
            description: 'Identity verification and compliance',
            version: 'v1.5',
            status: 'beta',
            documentation: '/docs/api/kyc',
            playground: '/playground/kyc'
          },
          {
            name: 'Analytics API',
            description: 'Transaction reporting and insights',
            version: 'v1.3',
            status: 'stable',
            documentation: '/docs/api/analytics',
            playground: '/playground/analytics'
          }
        ],
        sdks: [
          {
            platform: 'JavaScript/Node.js',
            version: '3.2.1',
            downloadUrl: '/downloads/js-sdk-3.2.1.zip',
            documentation: '/docs/sdk/javascript',
            examples: '/examples/javascript'
          },
          {
            platform: 'Python',
            version: '2.8.0',
            downloadUrl: '/downloads/python-sdk-2.8.0.zip',
            documentation: '/docs/sdk/python',
            examples: '/examples/python'
          },
          {
            platform: 'PHP',
            version: '2.5.3',
            downloadUrl: '/downloads/php-sdk-2.5.3.zip',
            documentation: '/docs/sdk/php',
            examples: '/examples/php'
          },
          {
            platform: 'iOS',
            version: '4.1.2',
            downloadUrl: '/downloads/ios-sdk-4.1.2.zip',
            documentation: '/docs/sdk/ios',
            examples: '/examples/ios'
          },
          {
            platform: 'Android',
            version: '4.0.8',
            downloadUrl: '/downloads/android-sdk-4.0.8.zip',
            documentation: '/docs/sdk/android',
            examples: '/examples/android'
          }
        ],
        tools: [
          {
            name: 'API Explorer',
            description: 'Interactive API testing tool',
            url: '/tools/api-explorer',
            category: 'testing'
          },
          {
            name: 'Webhook Tester',
            description: 'Test and debug webhook integrations',
            url: '/tools/webhook-tester',
            category: 'testing'
          },
          {
            name: 'Payment Simulator',
            description: 'Simulate different payment scenarios',
            url: '/tools/payment-simulator',
            category: 'testing'
          },
          {
            name: 'Code Generator',
            description: 'Generate integration code snippets',
            url: '/tools/code-generator',
            category: 'development'
          }
        ],
        support: {
          documentation: '/docs',
          community: '/community',
          support: '/support',
          status: '/status',
          changelog: '/changelog'
        }
      };

      res.json(resources);
    } catch (error) {
      console.error('Error fetching developer resources:', error);
      res.status(500).json({
        error: 'Failed to fetch developer resources'
      });
    }
  });
}