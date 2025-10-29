import React, { useEffect, useState } from "react";
import axios from "axios";

// Use relative API path for both local & live
const API_URL = "/api/orders/orders.php";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      // Ensure orders is always an array
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("action", "update_status");
      formData.append("id", id);
      formData.append("status", status);

      await axios.post(API_URL, formData);
      fetchOrders();
    } catch (err) {
      alert("Failed to update order!");
    }
  };

  // Safely filter orders
  const filteredOrders = Array.isArray(orders)
    ? filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus)
    : [];

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
        Admin Orders Management
      </h2>

      {/* Filter Dropdown */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="font-medium">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white text-left text-sm sm:text-base">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Transaction</th>
              <th className="py-3 px-4">Receipt</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{order.user_name}</td>
                  <td className="py-3 px-4">{order.location || "—"}</td>
                  <td className="py-3 px-4">{order.address || "—"}</td>
                  <td className="py-3 px-4">{order.transaction_code || "—"}</td>
                  <td className="py-3 px-4">
                    {order.receipt_url ? (
                      <a
                        href={order.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={order.receipt_url}
                          alt="Receipt"
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      </a>
                    ) : (
                      "No Receipt"
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {Array.isArray(order.items)
                      ? order.items.map((item, i) => (
                          <div key={i}>
                            {item.name} × {item.quantity}
                          </div>
                        ))
                      : "—"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    ₹{Number(order.total || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, "Approved")}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "Rejected")}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center py-6 text-gray-500 text-lg"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
