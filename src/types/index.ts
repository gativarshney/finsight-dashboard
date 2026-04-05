export type TransactionType = 'income' | 'expense';

export type ExpenseCategory = 
  | 'Food & Dining' 
  | 'Transport' 
  | 'Shopping' 
  | 'Entertainment' 
  | 'Health' 
  | 'Utilities' 
  | 'Rent' 
  | 'Education';

export type IncomeCategory = 
  | 'Salary' 
  | 'Freelance' 
  | 'Investment Returns' 
  | 'Bonus';

export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
  merchant: string;
}

export type Role = 'Viewer' | 'Admin';

export interface FilterState {
  search: string;
  categories: Category[];
  type: 'All' | TransactionType;
  dateRange: 'All' | 'Last 7d' | 'Last 30d' | 'Last 3m' | 'Last 6m';
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}
