import { FormEvent, useState } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";

export const CreateUserPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    Password: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/v1/user/createuser", form);
      toast.success(data?.message || "User created");
      setForm({ firstName: "", lastName: "", email: "", Password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
      <h1 className="text-xl font-semibold">Create User (Admin)</h1>
      <p className="mt-1 text-sm text-muted-foreground">

      </p>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="First name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Last name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
        <input
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2"
          type="password"
          placeholder="Password"
          value={form.Password}
          onChange={(e) => setForm({ ...form, Password: e.target.value })}
          required
        />
        <button
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-60 md:col-span-2"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </section>
  );
};
