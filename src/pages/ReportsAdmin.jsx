import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';

const ReportsAdmin = () => {
  const [period, setPeriod] = useState('daily');
  const mockSales = {
    daily: { 'Spicy Chicken': 10, 'Veg Biryani': 15 },
    weekly: { 'Spicy Chicken': 50, 'Veg Biryani': 70 },
    monthly: { 'Spicy Chicken': 200, 'Veg Biryani': 250 },
    yearly: { 'Spicy Chicken': 2400, 'Veg Biryani': 3000 },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
          <div className="mb-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border-gray-300 rounded-md p-2"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">Most Sold Items ({period.charAt(0).toUpperCase() + period.slice(1)})</h2>
            <ul className="mt-4 space-y-2">
              {Object.entries(mockSales[period]).map(([item, count]) => (
                <li key={item} className="text-gray-600">{item}: {count} units</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAdmin;