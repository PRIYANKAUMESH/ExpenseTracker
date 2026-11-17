import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

const PAGE_SIZE = 8;

function downloadCsv(transactions) {
  const columns = ["Title", "Type", "Amount", "Category", "Date", "Description"];
  const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const rows = transactions.map((item) => [item.title, item.type, item.amount, item.category, item.date, item.description]);
  const csv = [columns, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `expense-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useExpenses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(searchParams.get("add") === "1");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setShowForm(true);
      setEditing(null);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filtered = useMemo(() => {
    const result = transactions.filter((item) => {
      const matchesSearch = String(item.title || "").toLowerCase().includes(search.toLowerCase());
      const matchesType = type === "all" || item.type === type;
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesType && matchesCategory && (!from || item.date >= from) && (!to || item.date <= to);
    });
    return result.sort((a, b) => {
      if (sort === "oldest") return a.date.localeCompare(b.date);
      if (sort === "highest") return Number(b.amount) - Number(a.amount);
      if (sort === "lowest") return Number(a.amount) - Number(b.amount);
      return b.date.localeCompare(a.date) || String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  }, [transactions, search, type, category, from, to, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleTransactions = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, type, category, from, to, sort]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  function save(data) {
    if (editing) {
      updateTransaction(editing.id, data);
      setNotice("Transaction updated successfully.");
    } else {
      addTransaction(data);
      setNotice("Transaction added successfully.");
    }
    setEditing(null);
    setShowForm(false);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function edit(item) {
    setEditing({ ...item });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function remove(id) {
    if (window.confirm("Delete this transaction? This action cannot be undone.")) {
      deleteTransaction(id);
      setNotice("Transaction deleted successfully.");
      window.setTimeout(() => setNotice(""), 3000);
    }
  }

  function clearFilters() {
    setSearch(""); setType("all"); setCategory("all"); setFrom(""); setTo(""); setSort("newest");
  }

  return <div>
    <div className="page-heading">
      <div><div className="eyebrow">YOUR MONEY</div><h1>Transactions</h1><p>Add, review, and manage your income and expenses.</p></div>
      <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm((value) => !value); }}><i className="bi bi-plus-lg me-2" />{showForm && !editing ? "Close form" : "Add Expense / Income"}</button>
    </div>
    {notice && <div className="alert alert-success py-2" role="status">{notice}</div>}
    {showForm && <section className="content-card mb-4"><div className="card-heading"><div><h2>{editing ? "Edit transaction" : "New transaction"}</h2><p>{editing ? "Change the existing details and update this record." : "Enter the details below to record a transaction."}</p></div></div><TransactionForm key={editing?.id || "new-transaction"} initialData={editing} onSave={save} onCancel={() => { setEditing(null); setShowForm(false); }} /></section>}
    <section className="content-card">
      <div className="card-heading"><div><h2>All transactions</h2><p>{filtered.length} result(s)</p></div><button className="btn btn-outline-secondary btn-sm" onClick={() => downloadCsv(filtered)} disabled={!filtered.length}><i className="bi bi-download me-2" />Export CSV</button></div>
      <div className="filter-grid mb-3">
        <input className="form-control" placeholder="Search title..." aria-label="Search title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expense</option></select>
        <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{["Food","Shopping","Transportation","Education","Healthcare","Entertainment","Salary","Freelancing","Other"].map((c) => <option key={c}>{c}</option>)}</select>
        <input aria-label="From date" className="form-control" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input aria-label="To date" className="form-control" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort transactions"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest amount</option><option value="lowest">Lowest amount</option></select>
        <button className="btn btn-light" onClick={clearFilters}>Clear filters</button>
      </div>
      <TransactionList transactions={visibleTransactions} onEdit={edit} onDelete={remove} />
      {filtered.length > PAGE_SIZE && <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3"><small className="text-muted">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</small><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span className="small align-self-center">Page {page} of {pageCount}</span><button className="btn btn-sm btn-outline-secondary" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)}>Next</button></div></div>}
    </section>
  </div>;
}
