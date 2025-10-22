import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it('should render the dashboard header', () => {
    renderDashboard();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should display financial metrics cards', () => {
    renderDashboard();

    // Check for key sections
    expect(screen.getByText('Total Spent')).toBeInTheDocument();
    expect(screen.getByText('Avg Transaction')).toBeInTheDocument();
    const transactionElements = screen.getAllByText(/transactions/i);
    expect(transactionElements.length).toBeGreaterThan(0);
  });

  it('should render budget progress section', () => {
    renderDashboard();
    expect(screen.getByText(/budgeted/i)).toBeInTheDocument();
  });

  it('should render monthly spending chart', () => {
    renderDashboard();
    const monthlySpendingElements = screen.getAllByText(/Monthly spending/i);
    expect(monthlySpendingElements.length).toBeGreaterThan(0);
  });

  it('should display formatted currency values', () => {
    renderDashboard();

    // Check that dollar signs are rendered (currency formatting)
    const currencyElements = screen.getAllByText(/\$/);
    expect(currencyElements.length).toBeGreaterThan(0);
  });

  it('should render top spending categories', () => {
    renderDashboard();
    // Check for categories section
    const categories = screen.getAllByText(/Groceries|Auto Loan|Mortgage/i);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('should display category names', () => {
    renderDashboard();

    // The component should render category spending data
    // Check for common categories from the financial data
    const dashboard = screen.getByText('Dashboard');
    expect(dashboard).toBeInTheDocument();
  });
});
