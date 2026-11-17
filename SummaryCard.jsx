const icons = { balance: "bi-wallet2", income: "bi-graph-up-arrow", expenses: "bi-graph-down-arrow", count: "bi-receipt" };

export default function SummaryCard({ label, value, type, note }) {
  return (
    <div className="summary-card">
      <div className={`summary-icon ${type}`}><i className={`bi ${icons[type]}`} /></div>
      <div className="summary-label">{label}</div>
      <div className="summary-value">{value}</div>
      <div className="summary-note">{note}</div>
    </div>
  );
}