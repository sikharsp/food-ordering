import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiMenu,
  FiShoppingCart,
  FiBarChart2,
  FiLogOut,
  FiMessageSquare,
  FiX,
} from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="bg-gray-900 text-white flex md:hidden items-center justify-between px-4 py-3 shadow-md fixed w-full top-0 z-30">
        <h1 className="text-lg font-bold flex items-center">
          <FiHome className="mr-2" /> Admin
        </h1>
        <button onClick={toggleSidebar} className="focus:outline-none">
          {isOpen ? <FiX size={24} /> : <GiHamburgerMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg flex flex-col transform transition-transform duration-300 z-40 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-center py-5 border-b border-gray-700 mt-10 md:mt-0">
          <Link
            to="/admin-dashboard"
            className="text-xl font-bold hover:text-orange-400 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <FiHome className="mr-2" /> Admin Panel
          </Link>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 mt-6 space-y-2">
          <Link
            to="/admin-dashboard/menu"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-6 py-2 hover:bg-gray-800 transition-all"
          >
            <FiMenu className="mr-3" /> Menu
          </Link>

          <Link
            to="/admin-dashboard/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-6 py-2 hover:bg-gray-800 transition-all"
          >
            <FiShoppingCart className="mr-3" /> Orders
          </Link>

          <Link
            to="/admin-dashboard/reports"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-6 py-2 hover:bg-gray-800 transition-all"
          >
            <FiBarChart2 className="mr-3" /> Reports
          </Link>

          <Link
            to="/admin-dashboard/message"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-6 py-2 hover:bg-gray-800 transition-all"
          >
            <FiMessageSquare className="mr-3" /> Message
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-700 hover:bg-red-800 text-white py-2 rounded-md transition-all"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default AdminNavbar;
