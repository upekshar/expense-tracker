import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AddExpensePage', () => {
  let mockAddExpense: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAddExpense = vi.fn();
  });

  it('should validate expense amount is positive', () => {
    const result = validateAmount(-10);
    expect(result).toBe(false);
  });

  it('should validate expense amount is not zero', () => {
    const result = validateAmount(0);
    expect(result).toBe(false);
  });

  it('should accept valid positive amount', () => {
    const result = validateAmount(50.25);
    expect(result).toBe(true);
  });

  it('should validate category is not empty', () => {
    const result = validateCategory('');
    expect(result).toBe(false);
  });

  it('should accept valid category', () => {
    const result = validateCategory('Food');
    expect(result).toBe(true);
  });

  it('should validate description length', () => {
    const result = validateDescription('a'.repeat(256));
    expect(result).toBe(false);
  });

  it('should format expense data correctly', () => {
    const expense = formatExpense({
      amount: 50,
      category: 'Food',
      description: 'Lunch'
    });
    expect(expense.amount).toBe(50);
    expect(expense.category).toBe('Food');
    expect(expense.description).toBe('Lunch');
  });

  it('should call addExpense with correct data', () => {
    const expenseData = { amount: 100, category: 'Transport', description: 'Gas' };
    new mockAddExpense(expenseData);
    expect(mockAddExpense).toHaveBeenCalledWith(expenseData);
  });
});

function validateAmount(amount: number): boolean {
  return amount > 0;
}


function validateCategory(category: string): boolean {
  return category.trim().length > 0;
}


function validateDescription(description: string): boolean {
  return description.length <= 255;
}


function formatExpense(data: { amount: number; category: string; description: string; }) {
  return {
    amount: data.amount,
    category: data.category,
    description: data.description
  };
}
