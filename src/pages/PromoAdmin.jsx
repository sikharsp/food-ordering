import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost/api/promos/promos.php";

const PromoAdmin = () => {
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [amount, setAmount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [oneTimeUse, setOneTimeUse] = useState(false);
  const [newUserOnly, setNewUserOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promos, setPromos] = useState([]);

  const fetchPromos = async () => {
    try {
      const body = new FormData();
      body.append("action", "list");
      const res = await fetch(API_BASE, { method: "POST", body });
      const data = await res.json();
      if (data.success) setPromos(data.promos);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleCreate = async () => {
    if (!code || !amount) return alert("Fill all fields");
    setLoading(true);
    try {
      const body = new FormData();
      body.append("action", "create");
      body.append("code", code);
      body.append("type", type);
      body.append("amount", amount);
      body.append("expiry", expiry);
      body.append("one_time_use", oneTimeUse ? 1 : 0);
      body.append("new_user_only", newUserOnly ? 1 : 0);

      const res = await fetch(API_BASE, { method: "POST", body });
      const data = await res.json();

      if (data.success) {
        alert("Promo created successfully");
        setCode("");
        setAmount("");
        setExpiry("");
        setOneTimeUse(false);
        setNewUserOnly(false);
        fetchPromos();
      } else {
        alert(data.message || "Failed to create");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this promo?")) return;
    try {
      const body = new FormData();
      body.append("action", "delete");
      body.append("promo_id", id);
      const res = await fetch(API_BASE, { method: "POST", body });
      const data = await res.json();
      if (data.success) fetchPromos();
      else alert(data.message || "Failed");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Promo Admin</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Promo Code"
            className="p-2 border rounded"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="percent">Percent (%)</option>
            <option value="flat">Flat (Rs)</option>
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded"
            placeholder="Discount Amount"
          />

          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="p-2 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={oneTimeUse}
              onChange={(e) => setOneTimeUse(e.target.checked)}
            />
            One‑time</label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newUserOnly}
              onChange={(e) => setNewUserOnly(e.target.checked)}
            />
            New‑user</label>
        </div>

        <div className="mt-3">
          <button
            disabled={loading}
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Creating..." : "Create Promo"}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Existing Promos</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Expiry</th>
              <th>One‑time</th>
              <th>New‑user</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p.id} className="border-t">
                <td>{p.code}</td>
                <td>{p.type}</td>
                <td>{p.amount}</td>
                <td>{p.expiry || "—"}</td>
                <td>{p.one_time_use ? "Yes" : "No"}</td>
                <td>{p.new_user_only ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoAdmin;
