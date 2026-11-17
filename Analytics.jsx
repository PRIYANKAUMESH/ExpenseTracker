import { useMemo } from "react";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseChart from "../components/ExpenseChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

export default function Analytics() {
  const { transactions } = useExpenses();
  const months = useMemo(() => {
    const grouped = {};
    transactions.forEach((item) => {
      const key = item.date.slice(0, 7);
      if (!grouped[key]) grouped[key] = { income: 0, expenses: 0 };
      grouped[key][item.type === "income" ? "income" : "expenses"] += Number(item.amount);
    });
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([key, values]) => ({
      key, ...values, savings: values.income - values.expenses,
      label: new Date(`${key}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    }));
  }, [transactions]);

  return <div>
    <div className="page-heading"><div><div className="eyebrow">INSIGHTS</div><h1>Analytics</h1><p>Understand your spending patterns and monthly savings.</p></div></div>
    <div className="row g-3 mb-4">
      <div className="col-lg-7"><section className="content-card h-100"><div className="card-heading"><div><h2>Monthly comparison</h2><p>Income and expenses for the last six months</p></div></div><div className="chart-area bar-area"><IncomeExpenseChart transactions={transactions} /></div></section></div>
      <div className="col-lg-5"><section className="content-card h-100"><div className="card-heading"><div><h2>Spending by category</h2><p>Expense distribution</p></div></div><div className="chart-area doughnut-area"><ExpenseChart transactions={transactions} /></div></section></div>
    </div>
    <section className="content-card"><div className="card-heading"><div><h2>Monthly analytics</h2><p>Income, expenses, and savings by month</p></div></div>
      {!months.length ? <div className="chart-empty">Your monthly summary will appear after you add transactions.</div> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Month</th><th className="text-end">Income</th><th className="text-end">Expenses</th><th className="text-end">Savings</th></tr></thead><tbody>{months.map((m) => <tr key={m.key}><td className="fw-semibold">{m.label}</td><td className="text-end text-success">{money(m.income)}</td><td className="text-end text-danger">{money(m.expenses)}</td><td className={`text-end fw-semibold ${m.savings >= 0 ? "text-success" : "text-danger"}`}>{money(m.savings)}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}