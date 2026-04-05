"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Transaction, FilterState, Role } from "@/types";
import { initialMockTransactions } from "@/data/mockData";
import toast from "react-hot-toast";

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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Basic setup from mock data as fallback
    let initialData = initialMockTransactions;
    
    // Attempt to load from localStorage
    try {
      const stored = localStorage.getItem("finsight_transactions_v2");
      if (stored) {
        initialData = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore
    }
    
    setTransactions(initialData);
    setIsMounted(true);

    // Simulate network delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sync to local storage upon changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("finsight_transactions_v2", JSON.stringify(transactions));
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
    toast.success("Transaction added successfully");
  };

  const editTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updatedTransaction } : tx))
    );
    toast.success("Transaction updated");
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    toast.success("Transaction deleted");
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
        isLoading,
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
