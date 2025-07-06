import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { {{NAME}} } from './{{NAME}}';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('{{NAME}}', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<{{NAME}}>Test Content</{{NAME}}>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<{{NAME}} className="custom-class">Test</{{NAME}}>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('renders all variant styles correctly', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
      
      variants.forEach((variant) => {
        const { unmount } = render(<{{NAME}} variant={variant as any}>Test</{{NAME}}>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });

    it('renders all size variants correctly', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'];
      
      sizes.forEach((size) => {
        const { unmount } = render(<{{NAME}} size={size as any}>Test</{{NAME}}>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick}>Click me</{{NAME}}>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick} disabled>Click me</{{NAME}}>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not trigger click when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick} loading>Click me</{{NAME}}>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick}>Press Enter</{{NAME}}>);
      
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  // State tests
  describe('States', () => {
    it('shows loading state correctly', () => {
      render(<{{NAME}} loading>Loading</{{NAME}}>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('shows disabled state correctly', () => {
      render(<{{NAME}} disabled>Disabled</{{NAME}}>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('disabled');
    });

    it('displays icon when provided', () => {
      render(
        <{{NAME}} icon={<span data-testid="icon">💰</span>}>
          With Icon
        </{{NAME}}>
      );
      
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should not have accessibility violations', async () => {
      const { container } = render(<{{NAME}}>Accessible Button</{{NAME}}>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports ARIA attributes', () => {
      render(
        <{{NAME}} 
          aria-label="Send money"
          aria-describedby="button-desc"
        >
          Send
        </{{NAME}}>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Send money');
      expect(button).toHaveAttribute('aria-describedby', 'button-desc');
    });

    it('has proper focus management', () => {
      render(<{{NAME}}>Focus Test</{{NAME}}>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('supports screen reader announcements', () => {
      render(<{{NAME}} loading>Processing</{{NAME}}>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('renders efficiently with many instances', () => {
      const startTime = performance.now();
      
      render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <{{NAME}} key={i}>Button {i}</{{NAME}}>
          ))}
        </div>
      );
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should render in under 100ms
    });

    it('handles rapid click events', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<{{NAME}} onClick={handleClick}>Rapid Click</{{NAME}}>);
      
      const button = screen.getByRole('button');
      
      // Simulate rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('handles undefined children gracefully', () => {
      render(<{{NAME}}>{undefined}</{{NAME}}>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles empty string children', () => {
      render(<{{NAME}}>""</{{NAME}}>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('works with asChild prop', () => {
      render(
        <{{NAME}} asChild>
          <a href="#test">Link Button</a>
        </{{NAME}}>
      );
      
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByText('Link Button')).toBeInTheDocument();
    });
  });

  // Integration tests
  describe('Integration', () => {
    it('works within forms', () => {
      const handleSubmit = jest.fn();
      
      render(
        <form onSubmit={handleSubmit}>
          <{{NAME}} type="submit">Submit Form</{{NAME}}>
        </form>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleSubmit).toHaveBeenCalled();
    });

    it('works with React.forwardRef', () => {
      const ref = jest.fn();
      
      render(<{{NAME}} ref={ref}>Ref Test</{{NAME}}>);
      expect(ref).toHaveBeenCalled();
    });
  });
});

// Snapshot tests
describe('{{NAME}} Snapshots', () => {
  it('matches snapshot for default variant', () => {
    const { container } = render(<{{NAME}}>Default</{{NAME}}>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for all variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
    
    variants.forEach((variant) => {
      const { container } = render(<{{NAME}} variant={variant as any}>Test</{{NAME}}>);
      expect(container.firstChild).toMatchSnapshot(`{{NAME}}-${variant}`);
    });
  });
});
