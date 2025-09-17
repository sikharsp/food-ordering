import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost/api/menu";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();

  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${API_URL}/read.php`);
      setMenus(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching menus:", error);
      setMenus([]);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
     <div className="p-6 bg-gray-50 min-h-screen pt-20">
  <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
    🍽️ Our Delicious Menu
  </h1>

      {menus.length === 0 ? (
        <p className="text-center text-gray-600">No menu items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-2xl"
            >
              {menu.image && (
                <img
                  src={`http://localhost/api/uploads/${menu.image}`}
                  alt={menu.name}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {menu.name}
                </h2>
                <p className="text-gray-600 mb-3">{menu.description}</p>

                {/* Preference badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    menu.preference === "veg"
                      ? "bg-green-100 text-green-700"
                      : menu.preference === "nonveg"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {menu.preference.charAt(0).toUpperCase() +
                    menu.preference.slice(1)}
                </span>

                <p className="text-lg font-semibold text-gray-800 mb-4">
                  ₹{menu.price}
                </p>

                {/* Order button */}
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:from-orange-600 hover:to-red-600 transition"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
