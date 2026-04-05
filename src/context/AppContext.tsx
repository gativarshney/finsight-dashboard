"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Transaction, FilterState, Role } from "@/types";
import { initialMockTransactions } from "@/data/mockData";

interface AppContextProps {
  transactions: Transaction[];
  filters: FilterState;
  role: Role;
  setFilters: (filters: Partial<FilterState>) => void;
  setRole: (role: Role) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  search: "",
  categories: [],
  type: "All",
  dateRange: "All",
};

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [role, setRole] = useState<Role>("Viewer");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Basic setup from mock data as fallback
    let initialData = initialMockTransactions;
    
    // Attempt to load from localStorage (requested in step 14, setting up groundwork now perfectly safely)
    try {
      const stored = localStorage.getItem("finsight_transactions");
      if (stored) {
        initialData = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore
    }
    
    setTransactions(initialData);
    setIsMounted(true);
  }, []);

  // Sync to local storage upon changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("finsight_transactions", JSON.stringify(transactions));
    }
  }, [transactions, isMounted]);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    setTransactions((prev) => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const editTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updatedTransaction } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  if (!isMounted) {
    return null; // Await hydration
  }

  return (
    <AppContext.Provider
      value={{
        transactions,
        filters,
        role,
        setFilters,
        setRole,
        addTransaction,
        editTransaction,
        deleteTransaction,
        resetFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
