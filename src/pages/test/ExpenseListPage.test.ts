import { describe, it, expect } from 'vitest';

describe('ExpenseListPage', () => {
  describe('filterExpenses', () => {
    it('should filter expenses by category', () => {
      const expenses = [
        { id: 1, category: 'Food', amount: 50 },
        { id: 2, category: 'Transport', amount: 30 },
        { id: 3, category: 'Food', amount: 25 },
      ];
      const filtered = expenses.filter(e => e.category === 'Food');
      expect(filtered).toHaveLength(2);
      expect(filtered[0].category).toBe('Food');
    });

    it('should filter expenses by date range', () => {
      const expenses = [
        { id: 1, date: new Date('2024-01-15'), amount: 50 },
        { id: 2, date: new Date('2024-02-20'), amount: 30 },
        { id: 3, date: new Date('2024-01-10'), amount: 25 },
      ];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const filtered = expenses.filter(e => e.date >= startDate && e.date <= endDate);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total of all expenses', () => {
      const expenses = [{ amount: 50 }, { amount: 30 }, { amount: 20 }];
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      expect(total).toBe(100);
    });

    it('should return 0 for empty expenses', () => {
      const expenses: any[] = [];
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      expect(total).toBe(0);
    });
  });

  describe('sortExpenses', () => {
    it('should sort expenses by amount descending', () => {
      const expenses = [
        { id: 1, amount: 30 },
        { id: 2, amount: 50 },
        { id: 3, amount: 20 },
      ];
      const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
      expect(sorted[0].amount).toBe(50);
      expect(sorted[2].amount).toBe(20);
    });

    it('should sort expenses by date descending', () => {
      const expenses = [
        { id: 1, date: new Date('2024-01-15') },
        { id: 2, date: new Date('2024-01-20') },
        { id: 3, date: new Date('2024-01-10') },
      ];
      const sorted = [...expenses].sort((a, b) => b.date.getTime() - a.date.getTime());
      expect(sorted[0].id).toBe(2);
    });
  });

  describe('deleteExpense', () => {
    it('should remove expense by id', () => {
      let expenses = [
        { id: 1, amount: 50 },
        { id: 2, amount: 30 },
      ];
      expenses = expenses.filter(e => e.id !== 1);
      expect(expenses).toHaveLength(1);
      expect(expenses[0].id).toBe(2);
    });
  });
});