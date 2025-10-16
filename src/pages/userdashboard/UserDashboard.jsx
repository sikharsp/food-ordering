import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiHome,
  FiList,
} from "react-icons/fi";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("User Dashboard");

  // Load user name from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("user");
    setCart([]);
    navigate("/login");
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg flex-shrink-0">
        <h1
          className="font-bold text-2xl tracking-wide cursor-pointer"
          onClick={() => navigate("/dashboard/menu")}
        >
          {userName}
        </h1>
        <button
          className="text-white text-2xl md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
        <ul className="hidden md:flex space-x-8 items-center">
          <li>
            <Link
              to="/dashboard/menu"
              className="hover:text-orange-400 flex items-center gap-1" >
              <FiHome /> Menu
            </Link>
          </li>

          <li className="relative">
            <Link
              to="/dashboard/cart"
              className="hover:text-orange-400 flex items-center gap-1" >
              <FiShoppingCart /> Cart
            </Link>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                {cartCount}
              </span>
            )}
          </li>

          <li>
            <Link
              to="/dashboard/orders"
              className="hover:text-orange-400 flex items-center gap-1" >
              <FiList /> Orders
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/profile"
              className="hover:text-orange-400 flex items-center gap-1" >
              <FiUser /> Profile
            </Link>
          </li>

          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg flex items-center gap-1" >
              <FiLogOut /> Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-gray-800 text-white space-y-3 py-4 px-6 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`} >
        <Link
          to="/dashboard/menu"
          onClick={() => setIsOpen(false)}
          className="block hover:text-orange-400 flex items-center gap-2" >
          <FiHome /> Menu
        </Link>

        <Link
          to="/dashboard/cart"
          onClick={() => setIsOpen(false)}
          className="block hover:text-orange-400 flex items-center gap-2 relative" >
          <FiShoppingCart /> Cart
          {cartCount > 0 && (
            <span className="absolute right-6 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartCount}
            </span>
          )}
        </Link>

        <Link
          to="/dashboard/orders"
          onClick={() => setIsOpen(false)}
          className="block hover:text-orange-400 flex items-center gap-2"
        >
          <FiList /> Orders
        </Link>

        <Link
          to="/dashboard/profile"
          onClick={() => setIsOpen(false)}
          className="block hover:text-orange-400 flex items-center gap-2"
        >
          <FiUser /> Profile
        </Link>

        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <FiLogOut /> Logout
        </button>
      </div>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet context={{ cart, setCart }} />
      </main>
      <footer className="bg-gray-900 text-gray-300 text-center py-4 text-sm flex-shrink-0">
        © {new Date().getFullYear()} FoodZone | All Rights Reserved
      </footer>
    </div>
  );
};

export default UserDashboard;
