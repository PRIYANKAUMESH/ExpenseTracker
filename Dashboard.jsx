import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useExpenses } from "../context/ExpenseContext";
import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";
import ExpenseChart from "../components/ExpenseChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, summary, monthlyBudget, updateMonthlyBudget } = useExpenses();
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget || ""));
  const [budgetMessage, setBudgetMessage] = useState("");
  useEffect(() => { setBudgetInput(String(monthlyBudget || "")); }, [monthlyBudget]);
  const recent = transactions.slice(0, 5);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const previousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().slice(0, 7);
  const monthSummary = useMemo(() => {
    const thisMonth = transactions.filter((item) => item.date?.startsWith(currentMonth));
    const lastMonth = transactions.filter((item) => item.date?.startsWith(previousMonth));
    const total = (items, type) => items.filter((item) => item.type === type).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return {
      income: total(thisMonth, "income"),
      expenses: total(thisMonth, "expense"),
      previousExpenses: total(lastMonth, "expense"),
    };
  }, [transactions, currentMonth, previousMonth]);
  const budgetPercent = monthlyBudget > 0 ? Math.min(100, (monthSummary.expenses / monthlyBudget) * 100) : 0;
  const expenseChange = monthSummary.previousExpenses > 0 ? ((monthSummary.expenses - monthSummary.previousExpenses) / monthSummary.previousExpenses) * 100 : null;
  const budgetExceeded = monthlyBudget > 0 && monthSummary.expenses >= monthlyBudget * 0.8;

  function saveBudget(event) {
    event.preventDefault();
    const value = Number(budgetInput);
    if (!Number.isFinite(value) || value < 0) {
      setBudgetMessage("Enter a valid budget amount.");
      return;
    }
    updateMonthlyBudget(value);
    setBudgetMessage(value > 0 ? "Monthly budget saved." : "Monthly budget removed.");
    window.setTimeout(() => setBudgetMessage(""), 2500);
  }

  return <div>
    <div className="page-heading"><div><div className="eyebrow">OVERVIEW</div><h1>Good to see you, {user?.name?.split(" ")[0]} <span>👋</span></h1><p>Here is what's happening with your money.</p></div><Link to="/transactions?add=1" className="btn btn-primary"><i className="bi bi-plus-lg me-2" />Add Expense / Income</Link></div>
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-xl-3"><SummaryCard type="balance" label="Total balance" value={money(summary.balance)} note="Income minus expenses" /></div>
      <div className="col-12 col-sm-6 col-xl-3"><SummaryCard type="income" label="Total income" value={money(summary.income)} note="All recorded income" /></div>
      <div className="col-12 col-sm-6 col-xl-3"><SummaryCard type="expenses" label="Total expenses" value={money(summary.expenses)} note="All recorded expenses" /></div>
      <div className="col-12 col-sm-6 col-xl-3"><SummaryCard type="count" label="Transactions" value={summary.count} note="All recorded entries" /></div>
    </div>
    <div className="row g-3 mb-4">
      <div className="col-lg-7"><section className="content-card h-100"><div className="card-heading"><div><h2>Income vs expenses</h2><p>Your activity over the last six months</p></div></div><div className="chart-area bar-area"><IncomeExpenseChart transactions={transactions} /></div></section></div>
      <div className="col-lg-5"><section className="content-card h-100"><div className="card-heading"><div><h2>Expense breakdown</h2><p>Where your money goes</p></div></div><div className="chart-area doughnut-area"><ExpenseChart transactions={transactions} /></div></section></div>
    </div>
    <div className="row g-3 mb-4">
      <div className="col-lg-5"><section className="content-card h-100"><div className="card-heading"><div><h2>This month's summary</h2><p>Income and spending for the current month</p></div></div><div className="d-flex justify-content-between py-2 border-bottom"><span className="text-muted">Income</span><strong className="text-success">{money(monthSummary.income)}</strong></div><div className="d-flex justify-content-between py-2 border-bottom"><span className="text-muted">Expenses</span><strong className="text-danger">{money(monthSummary.expenses)}</strong></div><div className="d-flex justify-content-between py-2"><span className="text-muted">Monthly savings</span><strong>{money(monthSummary.income - monthSummary.expenses)}</strong></div>{monthSummary.previousExpenses > 0 && <div className="small text-muted mt-2">Previous month expenses: {money(monthSummary.previousExpenses)} · {expenseChange >= 0 ? "Up" : "Down"} {Math.abs(expenseChange).toFixed(1)}% compared with last month</div>}</section></div>
      <div className="col-lg-7"><section className="content-card h-100"><div className="card-heading"><div><h2>Monthly spending budget</h2><p>Set a limit and keep an eye on your expenses.</p></div></div><form className="d-flex gap-2 mb-3" onSubmit={saveBudget}><div className="flex-grow-1"><label className="form-label small" htmlFor="monthly-budget">Budget amount (₹)</label><input id="monthly-budget" className="form-control" type="number" min="0" step="0.01" placeholder="e.g. 20000" value={budgetInput} onChange={(event) => setBudgetInput(event.target.value)} /></div><button className="btn btn-primary align-self-end" type="submit">Save budget</button></form>{monthlyBudget > 0 ? <><div className="d-flex justify-content-between small mb-2"><span>{money(monthSummary.expenses)} spent</span><span>{money(Math.max(0, monthlyBudget - monthSummary.expenses))} remaining</span></div><div className="progress" role="progressbar" aria-label="Monthly budget used" aria-valuenow={Math.round(budgetPercent)} aria-valuemin="0" aria-valuemax="100" style={{ height: 10 }}><div className={`progress-bar ${budgetPercent >= 100 ? "bg-danger" : budgetPercent >= 80 ? "bg-warning" : "bg-success"}`} style={{ width: `${budgetPercent}%` }} /></div><div className="small mt-2 text-muted">{budgetPercent.toFixed(0)}% of your monthly budget used</div>{budgetExceeded && <div className="alert alert-warning py-2 mt-3 mb-0">You have used at least 80% of this month's budget. Review your spending.</div>}</> : <p className="text-muted small mb-0">No budget set yet. Add a monthly limit to track your spending.</p>}{budgetMessage && <div className="small text-success mt-2" role="status">{budgetMessage}</div>}</section></div>
    </div>
    <section className="content-card"><div className="card-heading"><div><h2>Recent transactions</h2><p>Your latest financial activity</p></div><Link to="/transactions" className="text-link">View all <i className="bi bi-arrow-right" /></Link></div><TransactionList transactions={recent} compact /></section>
  </div>;
}
