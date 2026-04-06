import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Search,
  Plus,
  Moon,
  Sun,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  Receipt,
  ShieldCheck,
  Trash2,
  Pencil,
} from "lucide-react";

const initialTransactions = [
  { id: 1, date: "2026-03-02", description: "Salary Deposit", amount: 4200, category: "Salary", type: "income" },
  { id: 2, date: "2026-03-04", description: "Rent Payment", amount: 1200, category: "Housing", type: "expense" },
  { id: 3, date: "2026-03-05", description: "Groceries", amount: 146, category: "Food", type: "expense" },
  { id: 4, date: "2026-03-07", description: "Netflix", amount: 18, category: "Entertainment", type: "expense" },
  { id: 5, date: "2026-03-09", description: "Freelance Project", amount: 850, category: "Freelance", type: "income" },
  { id: 6, date: "2026-03-11", description: "Uber", amount: 32, category: "Transport", type: "expense" },
  { id: 7, date: "2026-03-14", description: "Electricity Bill", amount: 92, category: "Utilities", type: "expense" },
  { id: 8, date: "2026-03-17", description: "Coffee Shop", amount: 14, category: "Food", type: "expense" },
  { id: 9, date: "2026-03-19", description: "Gym Membership", amount: 45, category: "Health", type: "expense" },
  { id: 10, date: "2026-03-21", description: "Stock Dividend", amount: 125, category: "Investments", type: "income" },
  { id: 11, date: "2026-03-24", description: "Flight Tickets", amount: 280, category: "Travel", type: "expense" },
  { id: 12, date: "2026-03-27", description: "Bonus", amount: 600, category: "Salary", type: "income" },
  { id: 13, date: "2026-04-01", description: "Dinner", amount: 64, category: "Food", type: "expense" },
  { id: 14, date: "2026-04-02", description: "Mobile Bill", amount: 39, category: "Utilities", type: "expense" },
  { id: 15, date: "2026-04-03", description: "Book Purchase", amount: 27, category: "Education", type: "expense" },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316"];

function cls(...items) {
  return items.filter(Boolean).join(" ");
}

function StatCard({ label, value, icon: Icon, trend, subtle }) {
  const positive = trend >= 0;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</h3>

          {typeof trend === "number" && (
            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(trend)}% vs last month
            </div>
          )}

          {subtle && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtle}</p>}
        </div>

        <div className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
          <Icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center dark:border-slate-700 dark:bg-slate-900/60">
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem("finance-dashboard-transactions-v2")
        : null;

    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [role, setRole] = useState("admin");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [darkMode, setDarkMode] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    date: "2026-04-04",
    description: "",
    amount: "",
    category: "Food",
    type: "expense",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "finance-dashboard-transactions-v2",
        JSON.stringify(transactions)
      );
    }
  }, [transactions]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(transactions.map((t) => t.category)))];
  }, [transactions]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const monthlyTrend = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningBalance = 0;

    return sorted.map((t) => {
      runningBalance += t.type === "income" ? Number(t.amount) : -Number(t.amount);

      return {
        date: new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        balance: runningBalance,
      };
    });
  }, [transactions]);

  const expenseBreakdown = useMemo(() => {
    const grouped = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
        return acc;
      }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthComparison = useMemo(() => {
    const grouped = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString("en-US", { month: "short" });

      if (!acc[month]) {
        acc[month] = { month, income: 0, expense: 0 };
      }

      acc[month][t.type] += Number(t.amount);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();

    let data = transactions.filter((t) => {
      const matchesSearch =
        !q || [t.description, t.category, t.type, t.date].join(" ").toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });

    data.sort((a, b) => {
      switch (sortBy) {
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "date-desc":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return data;
  }, [transactions, search, typeFilter, categoryFilter, sortBy]);

  const insights = useMemo(() => {
    const topCategory = expenseBreakdown[0]?.name || "N/A";
    const topCategoryAmount = expenseBreakdown[0]?.value || 0;
    const comparison = monthComparison.slice(-2);
    const latest = comparison[comparison.length - 1];
    const previous = comparison[comparison.length - 2];
    const delta = latest && previous ? latest.expense - previous.expense : 0;

    return [
      {
        title: "Highest spending category",
        value: topCategory,
        note:
          topCategory !== "N/A"
            ? `${currency.format(topCategoryAmount)} spent here.`
            : "No expense data available.",
      },
      {
        title: "Monthly comparison",
        value:
          latest && previous
            ? `${delta > 0 ? "+" : ""}${currency.format(delta)}`
            : "Not enough data",
        note:
          latest && previous
            ? `Compared ${latest.month} against ${previous.month} expenses.`
            : "Add more months to unlock this insight.",
      },
      {
        title: "Savings signal",
        value: totals.balance > 0 ? "Positive cash flow" : "Negative cash flow",
        note: `Net balance is currently ${currency.format(totals.balance)}.`,
      },
    ];
  }, [expenseBreakdown, monthComparison, totals.balance]);

  const resetForm = () => {
    setForm({
      date: "2026-04-04",
      description: "",
      amount: "",
      category: "Food",
      type: "expense",
    });
    setEditingId(null);
    setFormError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role !== "admin") return;

    if (!form.description.trim() || !form.amount || !form.date || !form.category) {
      setFormError("Please fill in all fields.");
      return;
    }

    setFormError("");

    const payload = {
      id: editingId ?? Date.now(),
      date: form.date,
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
    };

    if (editingId) {
      setTransactions((prev) => prev.map((t) => (t.id === editingId ? payload : t)));
    } else {
      setTransactions((prev) => [payload, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (transaction) => {
    if (role !== "admin") return;

    setEditingId(transaction.id);
    setFormError("");
    setForm({
      date: transaction.date,
      description: transaction.description,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type,
    });
  };

  const handleDelete = (id) => {
    if (role !== "admin") return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) resetForm();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const rows = [
      "date,description,amount,category,type",
      ...transactions.map((t) =>
        [t.date, `"${t.description}"`, t.amount, t.category, t.type].join(",")
      ),
    ];

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cls("min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white")}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[32px] border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-300">Frontend Developer Intern Assignment</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Finance Dashboard UI</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              A responsive finance dashboard with visual insights, transaction management,
              simulated role-based access, and persistent mock data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setDarkMode((v) => !v)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/20"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode ? "Light" : "Dark"} mode
            </button>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white outline-none backdrop-blur"
            >
              <option className="text-slate-900" value="viewer">
                Viewer
              </option>
              <option className="text-slate-900" value="admin">
                Admin
              </option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Balance"
            value={currency.format(totals.balance)}
            icon={Wallet}
            trend={12}
            subtle="Net of all income and expenses"
          />
          <StatCard
            label="Income"
            value={currency.format(totals.income)}
            icon={TrendingUp}
            trend={8}
            subtle="All tracked inflows"
          />
          <StatCard
            label="Expenses"
            value={currency.format(totals.expenses)}
            icon={Receipt}
            trend={-3}
            subtle="All tracked outflows"
          />
          <StatCard
            label="Current Role"
            value={role === "admin" ? "Admin" : "Viewer"}
            icon={ShieldCheck}
            subtle={
              role === "admin"
                ? "Can add, edit, and remove transactions"
                : "Read-only access enabled"
            }
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-sm dark:bg-slate-900/70 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Balance Trend</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Running balance after each transaction.
                </p>
              </div>
            </div>

            {monthlyTrend.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis />
                    <Tooltip formatter={(value) => currency.format(value)} />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="#6366f1"
                      fill="url(#balanceFill)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                title="No trend data yet"
                description="Add transactions to render the balance trend chart."
              />
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-sm dark:bg-slate-900/70">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Spending Breakdown</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Expense distribution by category.
              </p>
            </div>

            {expenseBreakdown.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => currency.format(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                title="No expense data"
                description="Add expense transactions to see where the money is going."
              />
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-sm dark:bg-slate-900/70 xl:col-span-2">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Transactions</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Search, sort, and filter financial activity.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportCsv}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportJson}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  Export JSON
                </button>
              </div>
            </div>

            <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative xl:col-span-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by description, category, type..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-10 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Highest amount</option>
                <option value="amount-asc">Lowest amount</option>
              </select>
            </div>

            {transactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Add your first transaction to start tracking activity."
              />
            ) : filteredTransactions.length ? (
              <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-500">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-500">Description</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-500">Category</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-500">Type</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-500">Amount</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/60">
                          <td className="px-4 py-3">{transaction.date}</td>
                          <td className="px-4 py-3 font-medium">{transaction.description}</td>
                          <td className="px-4 py-3">{transaction.category}</td>
                          <td className="px-4 py-3">
                            <span
                              className={cls(
                                "rounded-full px-2.5 py-1 text-xs font-medium",
                                transaction.type === "income"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                              )}
                            >
                              {transaction.type}
                            </span>
                          </td>
                          <td
                            className={cls(
                              "px-4 py-3 text-right font-semibold",
                              transaction.type === "income"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {currency.format(transaction.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(transaction)}
                                disabled={role !== "admin"}
                                className="rounded-xl border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction.id)}
                                disabled={role !== "admin"}
                                className="rounded-xl border border-slate-200 p-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No matching transactions"
                description="Try adjusting search or filters, or add a new transaction if you are in Admin mode."
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-sm dark:bg-slate-900/70">
              <div className="mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit Transaction" : "Add Transaction"}
                </h2>
              </div>

              {role === "viewer" ? (
                <EmptyState
                  title="Viewer mode enabled"
                  description="Switch to Admin to add, edit, or delete transactions."
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Description"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                    />
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="Amount"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                    >
                      {[
                        "Salary",
                        "Freelance",
                        "Housing",
                        "Food",
                        "Transport",
                        "Utilities",
                        "Entertainment",
                        "Health",
                        "Travel",
                        "Education",
                        "Investments",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <select
                      value={form.type}
                      onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  {formError && <p className="text-sm text-red-500">{formError}</p>}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      {editingId ? "Update" : "Add transaction"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-700"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-sm dark:bg-slate-900/70">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Insights</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Simple observations generated from current data.
                </p>
              </div>

              <div className="space-y-3">
                {insights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
                    <h3 className="mt-1 text-lg font-semibold">{item.value}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/70 p-5 shadow-sm dark:bg-slate-900/70">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Income vs Expense</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Monthly totals for income and expenses.
                </p>
              </div>

              {monthComparison.length ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthComparison}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => currency.format(value)} />
                      <Bar dataKey="income" radius={[8, 8, 0, 0]} fill="#10b981" />
                      <Bar dataKey="expense" radius={[8, 8, 0, 0]} fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  title="No comparison data"
                  description="Monthly insights will appear once transactions are available."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;