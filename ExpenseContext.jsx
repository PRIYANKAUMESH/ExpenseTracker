import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(null);
const storageKey = (userId) => `pennywise_transactions_${userId}`;
const budgetKey = (userId) => `pennywise_monthly_budget_${userId}`;

function readTransactions(userId) {
  if (!userId) return [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(userId)) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState(() => readTransactions(user?.id));
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    if (!user?.id) return 0;
    const value = Number(localStorage.getItem(budgetKey(user.id)) || 0);
    return Number.isFinite(value) ? value : 0;
  });

  // Load the selected account's data when the signed-in user changes.
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setMonthlyBudget(0);
      return;
    }
    setTransactions(readTransactions(user.id));
    const savedBudget = Number(localStorage.getItem(budgetKey(user.id)) || 0);
    setMonthlyBudget(Number.isFinite(savedBudget) ? savedBudget : 0);
  }, [user?.id]);

  function addTransaction(data) {
    if (!user) return;
    const newTransaction = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setTransactions((current) => {
      const next = [newTransaction, ...current];
      localStorage.setItem(storageKey(user.id), JSON.stringify(next));
      return next;
    });
  }

  function updateTransaction(id, data) {
    if (!user) return;
    setTransactions((current) => {
      const next = current.map((item) => item.id === id ? { ...item, ...data, id: item.id } : item);
      localStorage.setItem(storageKey(user.id), JSON.stringify(next));
      return next;
    });
  }

  function deleteTransaction(id) {
    if (!user) return;
    setTransactions((current) => {
      const next = current.filter((item) => item.id !== id);
      localStorage.setItem(storageKey(user.id), JSON.stringify(next));
      return next;
    });
  }

  function updateMonthlyBudget(value) {
    const amount = Math.max(0, Number(value) || 0);
    setMonthlyBudget(amount);
    if (user) localStorage.setItem(budgetKey(user.id), String(amount));
  }

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return { income, expenses, balance: income - expenses, count: transactions.length };
  }, [transactions]);

  return (
    <ExpenseContext.Provider value={{ transactions, addTransaction, updateTransaction, deleteTransaction, summary, monthlyBudget, updateMonthlyBudget }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const value = useContext(ExpenseContext);
  if (!value) throw new Error("useExpenses must be used inside ExpenseProvider");
  return value;
}
