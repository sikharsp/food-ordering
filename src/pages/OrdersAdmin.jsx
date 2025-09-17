import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheck, FiX } from 'react-icons/fi';
import AdminNavbar from '../components/AdminNavbar';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost/api/get-orders.php');
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders.');
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put('http://localhost/api/update-order.php', { id, status: 'approved' });
      setOrders(orders.map(order => order.id === id ? { ...order, status: 'approved' } : order));
    } catch (err) {
      setError('Failed to approve order.');
      console.error('Error approving order:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put('http://localhost/api/update-order.php', { id, status: 'rejected' });
      setOrders(orders.map(order => order.id === id ? { ...order, status: 'rejected' } : order));
    } catch (err) {
      setError('Failed to reject order.');
      console.error('Error rejecting order:', err);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 pt-16 flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Orders</h1>
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-lg">
                <p className="text-gray-900">User: {order.user_name}</p>
                <p className="text-gray-600 mt-1">Item: {order.item_name}</p>
                <p className="text-gray-600 mt-1">Status: {order.status}</p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleApprove(order.id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md"
                    disabled={order.status !== 'pending'}
                  >
                    <FiCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                    disabled={order.status !== 'pending'}
                  >
                    <FiX /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
          {orders.length === 0 && <p className="text-center text-gray-600">No orders available.</p>}
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;