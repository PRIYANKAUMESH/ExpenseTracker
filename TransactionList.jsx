const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(value);

export default function TransactionList({ transactions, onEdit, onDelete, compact = false }) {
  if (!transactions.length) return <div className="empty-state"><i className="bi bi-inbox" /><strong>No transactions found</strong><span>Add a transaction or adjust your filters.</span></div>;
  return (
    <div className="table-responsive">
      <table className="table align-middle transaction-table mb-0">
        <thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Type</th><th className="text-end">Amount</th>{!compact && <th className="text-end">Actions</th>}</tr></thead>
        <tbody>{transactions.map((item) => (
          <tr key={item.id}>
            <td><div className="transaction-title">{item.title}</div>{item.description && <small className="text-muted">{item.description}</small>}</td>
            <td>{item.category}</td><td>{new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
            <td><span className={`type-pill ${item.type}`}>{item.type}</span></td>
            <td className={`text-end fw-semibold ${item.type === "income" ? "text-success" : "text-danger"}`}>{item.type === "income" ? "+" : "−"}{money(Number(item.amount))}</td>
            {!compact && <td className="text-end text-nowrap"><button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => onEdit(item)}><i className="bi bi-pencil me-1" />Edit</button><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onDelete(item.id)}><i className="bi bi-trash me-1" />Delete</button></td>}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}