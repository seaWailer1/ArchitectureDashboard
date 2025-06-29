import React from 'react';

export function ComponentLibrary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary">AfriPay Component Library</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of reusable React components built with 
            TypeScript, TailwindCSS, and WCAG AAA accessibility standards.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mt-12">
            <a
              href="/storybook"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border"
            >
              <div className="text-2xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Interactive Storybook</h3>
              <p className="text-muted-foreground">
                Browse and interact with all components in an isolated environment
              </p>
            </a>
            
            <a
              href="https://github.com/your-repo/tree/main/client/src/components"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border"
            >
              <div className="text-2xl mb-4">💻</div>
              <h3 className="text-xl font-semibold mb-2">Source Code</h3>
              <p className="text-muted-foreground">
                View the complete source code and documentation on GitHub
              </p>
            </a>
            
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border">
              <div className="text-2xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Design System</h3>
              <p className="text-muted-foreground">
                Built with consistent theming, accessibility, and mobile-first design
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <div className="bg-neutral-900 dark:bg-neutral-800 text-neutral-100 p-4 rounded text-sm font-mono">
                # Add a new component<br/>
                bun codex.component.mts add Forms/Input input<br/><br/>
                # Remove a component<br/>
                bun codex.component.mts remove Forms/Input<br/><br/>
                # List all components<br/>
                bun codex.component.mts list
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}