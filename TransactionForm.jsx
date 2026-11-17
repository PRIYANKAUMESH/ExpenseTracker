import { useEffect, useState } from "react";

const categories = ["Food", "Shopping", "Transportation", "Education", "Healthcare", "Entertainment", "Salary", "Freelancing", "Other"];
const emptyForm = { title: "", type: "expense", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10), description: "" };

export default function TransactionForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || emptyForm);
  const [error, setError] = useState("");

  useEffect(() => { setForm(initialData || emptyForm); setError(""); }, [initialData]);

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.amount || !form.date || !form.category) {
      setError("Please complete all required fields."); return;
    }
    if (Number(form.amount) <= 0 || !Number.isFinite(Number(form.amount))) {
      setError("Amount must be a number greater than zero."); return;
    }
    onSave({ ...form, title: form.title.trim(), amount: Number(form.amount) });
    setForm(emptyForm);
  }

  return (
    <form onSubmit={submit} className="form-panel">
      <div className="row g-3">
        <div className="col-md-6"><label className="form-label">Transaction title *</label><input className="form-control" name="title" value={form.title} onChange={change} placeholder="e.g. Monthly salary" /></div>
        <div className="col-md-6"><label className="form-label">Type *</label><select className="form-select" name="type" value={form.type} onChange={change}><option value="expense">Expense</option><option value="income">Income</option></select></div>
        <div className="col-md-6"><label className="form-label">Amount (₹) *</label><input className="form-control" name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={change} placeholder="0.00" /></div>
        <div className="col-md-6"><label className="form-label">Category *</label><select className="form-select" name="category" value={form.category} onChange={change}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
        <div className="col-md-6"><label className="form-label">Date *</label><input className="form-control" name="date" type="date" value={form.date} onChange={change} /></div>
        <div className="col-md-6"><label className="form-label">Description</label><input className="form-control" name="description" value={form.description} onChange={change} placeholder="Optional note" /></div>
      </div>
      {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}
      <div className="d-flex gap-2 mt-4"><button className="btn btn-primary" type="submit"><i className="bi bi-check2 me-1" />{initialData ? "Update transaction" : "Add transaction"}</button>{onCancel && <button type="button" className="btn btn-light" onClick={onCancel}>Cancel</button>}</div>
    </form>
  );
}