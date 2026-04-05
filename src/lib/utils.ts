import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { Transaction, Category, MonthlySummary } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch (error) {
    return dateString;
  }
}

export function groupByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce((acc, transaction) => {
    if (transaction.type === "expense") {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);
}

export function getMonthlyTotals(transactions: Transaction[]): MonthlySummary[] {
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((t) => {
    try {
      const monthYear = format(parseISO(t.date), "MMM yyyy");
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") {
        monthlyData[monthYear].income += t.amount;
      } else {
        monthlyData[monthYear].expenses += t.amount;
      }
    } catch {
      // Ignore invalid dates
    }
  });

  let runningBalance = 0;
  
  // Sort chronically based on parsed dates
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return sortedMonths.map((month) => {
    const data = monthlyData[month];
    runningBalance += data.income - data.expenses;
    return {
      month,
      income: data.income,
      expenses: data.expenses,
      balance: runningBalance,
    };
  });
}
