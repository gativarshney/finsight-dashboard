import { Transaction } from "@/types";
import { subDays, format } from "date-fns";

const generateMockData = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Generating data spanning 6 months
  const txTemplates = [
    { merchant: 'Whole Foods Market', category: 'Food & Dining' as const, type: 'expense' as const, amountRange: [40, 150] },
    { merchant: 'Uber', category: 'Transport' as const, type: 'expense' as const, amountRange: [15, 45] },
    { merchant: 'TechCorp Salary', category: 'Salary' as const, type: 'income' as const, amountRange: [4500, 4500] },
    { merchant: 'Amazon', category: 'Shopping' as const, type: 'expense' as const, amountRange: [20, 200] },
    { merchant: 'Netflix', category: 'Entertainment' as const, type: 'expense' as const, amountRange: [15.99, 15.99] },
    { merchant: 'CVS Pharmacy', category: 'Health' as const, type: 'expense' as const, amountRange: [10, 60] },
    { merchant: 'ConEdison', category: 'Utilities' as const, type: 'expense' as const, amountRange: [80, 140] },
    { merchant: 'City Apartments', category: 'Rent' as const, type: 'expense' as const, amountRange: [2000, 2000] },
    { merchant: 'Freelance Client', category: 'Freelance' as const, type: 'income' as const, amountRange: [500, 1500] },
    { merchant: 'Vanguard Dividend', category: 'Investment Returns' as const, type: 'income' as const, amountRange: [50, 300] },
    { merchant: 'Starbucks', category: 'Food & Dining' as const, type: 'expense' as const, amountRange: [4, 15] },
    { merchant: 'Spotify', category: 'Entertainment' as const, type: 'expense' as const, amountRange: [10.99, 10.99] },
    { merchant: 'Internet Provider', category: 'Utilities' as const, type: 'expense' as const, amountRange: [65, 65] },
    { merchant: 'Local Gym', category: 'Health' as const, type: 'expense' as const, amountRange: [55, 55] },
    { merchant: 'Apple Store', category: 'Shopping' as const, type: 'expense' as const, amountRange: [99, 1200] },
    { merchant: 'Annual Bonus', category: 'Bonus' as const, type: 'income' as const, amountRange: [5000, 5000] },
    { merchant: 'Online Course', category: 'Education' as const, type: 'expense' as const, amountRange: [40, 150] },
    { merchant: 'Subway Pass', category: 'Transport' as const, type: 'expense' as const, amountRange: [120, 120] },
  ];

  let idCounter = 1;

  // Add 50 diverse transactions
  for (let i = 0; i < 50; i++) {
    const template = txTemplates[Math.floor(Math.random() * txTemplates.length)];
    const daysAgo = Math.floor(Math.random() * 180); // Up to 6 months ago 
    const date = subDays(today, daysAgo);
    
    // special logic for big annual bonus (only put 1)
    if (template.category === 'Bonus' && i > 0) continue; 
    
    const amount = Number((template.amountRange[0] + Math.random() * (template.amountRange[1] - template.amountRange[0])).toFixed(2));
    
    transactions.push({
      id: `tx-${idCounter++}`,
      date: format(date, "yyyy-MM-dd"),
      amount,
      category: template.category,
      type: template.type,
      description: `${template.category} - ${template.merchant}`,
      merchant: template.merchant
    });
  }

  // Ensure systematic recurring transactions like Salary and Rent for last 6 months
  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const d = subDays(today, monthOffset * 30 + 5);
    
    // Add Salary
    transactions.push({
      id: `tx-${idCounter++}`,
      date: format(d, "yyyy-MM-dd"),
      amount: 4500,
      category: 'Salary',
      type: 'income',
      description: 'Monthly Salary',
      merchant: 'TechCorp'
    });

    // Add Rent
    transactions.push({
      id: `tx-${idCounter++}`,
      date: format(subDays(d, 2), "yyyy-MM-dd"),
      amount: 2000,
      category: 'Rent',
      type: 'expense',
      description: 'Monthly Rent',
      merchant: 'City Apartments'
    });
  }

  // Sort by date mostly descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const initialMockTransactions = generateMockData();
