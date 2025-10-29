import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";

const STATS_URL = "http://localhost/api/orders/stats.php";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    approved_orders: 0,
    total_sales: 0,
  });

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate, token]);

  // ✅ Fetch live stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(STATS_URL);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const isDashboardRoot = location.pathname === "/admin-dashboard";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 mt-14 md:mt-0 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6 min-h-[80vh]">
          {isDashboardRoot && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mb-8">
                Welcome back, Admin  Manage orders, menu, and reports here.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h2 className="text-lg font-medium text-gray-700">Total Orders</h2>
                  <p className="mt-2 text-3xl font-bold text-blue-700">
                    {stats.total_orders}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h2 className="text-lg font-medium text-gray-700">Pending Orders</h2>
                  <p className="mt-2 text-3xl font-bold text-yellow-600">
                    {stats.pending_orders}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h2 className="text-lg font-medium text-gray-700">Approved Orders</h2>
                  <p className="mt-2 text-3xl font-bold text-green-700">
                    {stats.approved_orders}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h2 className="text-lg font-medium text-gray-700">Total Sales</h2>
                  <p className="mt-2 text-3xl font-bold text-purple-700">
                    ₹{stats.total_sales}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Nested Admin Pages */}
          <div className={`${isDashboardRoot ? "mt-10" : "mt-0"}`}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
