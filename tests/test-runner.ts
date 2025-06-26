#!/usr/bin/env tsx

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestSuite {
  name: string;
  command: string;
  description: string;
}

const testSuites: TestSuite[] = [
  {
    name: 'Unit Tests',
    command: 'npm run test -- --testPathPattern=unit',
    description: 'Testing individual components and functions'
  },
  {
    name: 'API Tests',
    command: 'npm run test -- --testPathPattern=api',
    description: 'Testing REST API endpoints'
  },
  {
    name: 'Integration Tests',
    command: 'npm run test -- --testPathPattern=integration',
    description: 'Testing component interactions'
  },
  {
    name: 'Security Tests',
    command: 'npm run test -- --testPathPattern=security',
    description: 'Testing security and compliance'
  },
  {
    name: 'Performance Tests',
    command: 'npm run test -- --testPathPattern=performance',
    description: 'Testing response times and load handling'
  },
  {
    name: 'UI/UX Tests',
    command: 'npm run test -- --testPathPattern=ui',
    description: 'Testing accessibility and user experience'
  },
  {
    name: 'Regression Tests',
    command: 'npm run test -- --testPathPattern=regression',
    description: 'Testing critical user paths'
  },
  {
    name: 'User Acceptance Tests',
    command: 'npm run test -- --testPathPattern=uat',
    description: 'Testing user scenarios and workflows'
  },
  {
    name: 'E2E Tests',
    command: 'npx playwright test',
    description: 'End-to-end browser testing'
  },
  {
    name: 'Blockchain Tests',
    command: 'npm run test -- --testPathPattern=blockchain',
    description: 'Testing Ethereum integration'
  }
];

async function runTestSuite(suite: TestSuite): Promise<{ success: boolean; output: string }> {
  console.log(`\n🔄 Running ${suite.name}...`);
  console.log(`📝 ${suite.description}`);
  
  try {
    const { stdout, stderr } = await execAsync(suite.command);
    console.log(`✅ ${suite.name} completed successfully`);
    return { success: true, output: stdout };
  } catch (error: any) {
    console.log(`❌ ${suite.name} failed`);
    return { success: false, output: error.stdout || error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting AfriPay Comprehensive Test Suite');
  console.log('=' .repeat(60));
  
  const results: { suite: string; success: boolean; output: string }[] = [];
  
  for (const suite of testSuites) {
    const result = await runTestSuite(suite);
    results.push({
      suite: suite.name,
      success: result.success,
      output: result.output
    });
  }
  
  // Generate test report
  console.log('\n📊 Test Results Summary');
  console.log('=' .repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.suite}`);
  });
  
  console.log('\n📈 Overall Statistics');
  console.log(`Total Test Suites: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Test Details:');
    results
      .filter(r => !r.success)
      .forEach(result => {
        console.log(`\n--- ${result.suite} ---`);
        console.log(result.output.substring(0, 500) + '...');
      });
  }
  
  console.log('\n🎯 Next Steps:');
  if (failed === 0) {
    console.log('🎉 All tests passed! Ready for deployment.');
  } else {
    console.log('🔧 Address failing tests before deployment.');
    console.log('📋 Review test logs above for specific issues.');
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests, testSuites };