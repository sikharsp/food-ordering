import AdminNavbar from '../components/AdminNavbar';

const UsersAdmin = () => {
  const totalUsers = 50; // Mock total

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-900 text-xl">Total Registered Users: {totalUsers}</p>
            {/* Add user list or details here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAdmin;