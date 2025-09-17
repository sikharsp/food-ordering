import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }
  }, [navigate, token]);

  const isDashboardRoot = location.pathname === "/admin-dashboard"; // Adjust if your route is different

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Only show on dashboard root */}
          {isDashboardRoot && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mb-4">
                Welcome, Admin! Manage your system from here.
              </p>
            </>
          )}

          {/* Nested pages will render here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
