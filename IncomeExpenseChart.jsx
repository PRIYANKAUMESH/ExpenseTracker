import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function IncomeExpenseChart({ transactions }) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`, label: date.toLocaleDateString("en-IN", { month: "short" }) });
  }
  const income = months.map((month) => transactions.filter((t) => t.type === "income" && t.date.startsWith(month.key)).reduce((sum, t) => sum + Number(t.amount), 0));
  const expenses = months.map((month) => transactions.filter((t) => t.type === "expense" && t.date.startsWith(month.key)).reduce((sum, t) => sum + Number(t.amount), 0));
  const data = { labels: months.map((m) => m.label), datasets: [{ label: "Income", data: income, backgroundColor: "#20b486", borderRadius: 6 }, { label: "Expenses", data: expenses, backgroundColor: "#f26b7a", borderRadius: 6 }] };
  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { usePointStyle: true } } }, scales: { y: { beginAtZero: true, ticks: { callback: (value) => `₹${Number(value).toLocaleString("en-IN")}` }, grid: { color: "#eef0f5" } }, x: { grid: { display: false } } } }} />;
}