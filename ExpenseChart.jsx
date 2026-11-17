import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart({ transactions }) {
  const expenses = transactions.filter((item) => item.type === "expense");
  const totals = expenses.reduce((acc, item) => { acc[item.category] = (acc[item.category] || 0) + Number(item.amount); return acc; }, {});
  const labels = Object.keys(totals);
  const data = { labels, datasets: [{ data: labels.map((label) => totals[label]), backgroundColor: ["#6c63ff", "#20b486", "#ffb547", "#f26b7a", "#49a6e9", "#a78bfa", "#f59e0b", "#64748b", "#14b8a6"], borderWidth: 0, hoverOffset: 7 }] };
  return labels.length ? <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 18 } } }, cutout: "68%" }} /> : <div className="chart-empty">Add expense transactions to see your category breakdown.</div>;
}