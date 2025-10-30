import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import qrImage from "./assets/IMG_7696.jpg";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("Butwal");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Delivery charges
  const deliveryCharge = location === "Butwal" || location === "Tilottama" ? 100 : 150;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryCharge;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return alert("Upload payment screenshot first!");
    if (!address) return alert("Enter delivery address!");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    const formData = new FormData();
    formData.append("receipt", uploadedImage);
    formData.append("user_id", user.id);
    formData.append("transaction_code", "QR" + Date.now());
    formData.append("location", location);
    formData.append("address", address);
    formData.append("cart", JSON.stringify(cart));
    formData.append("delivery_charge", deliveryCharge);
    formData.append("total_amount", total);

    const res = await fetch("http://localhost/api/orders/orders.php", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("Order Confirmed ✅");
      setCart([]);
      navigate("/dashboard/menu");
    } else {
      alert("Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="text-gray-800 text-xl hover:text-black">
            <FiArrowLeft />
          </button>
          <h1 className="font-bold text-xl text-gray-800">Checkout</h1>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm">
          <p><b>Name:</b> Sikhar Panthi</p>
          <p><b>Phone:</b> 9867391430</p>
        </div>

        {/* Delivery Info */}
        <h2 className="font-semibold mb-1">Delivery Address</h2>
        <select
          className="w-full p-3 rounded-xl bg-gray-50 border mb-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option>Butwal</option>
          <option>Tilottama</option>
          <option>Bhairawa</option>
          <option>Sainamaina</option>
        </select>

        <input
          type="text"
          placeholder="Enter Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-50 border mb-4"
        />

        {/* Order Summary */}
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
          <h3 className="font-semibold mb-2 text-orange-700">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-1">
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>Rs {subtotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Delivery Charge:</span>
            <span>Rs {deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-orange-600 mt-2">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>
        </div>

        {/* QR Payment */}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Scan & Pay</h3>
          <img src={qrImage} className="w-64 mx-auto rounded-xl shadow" />
        </div>

        {/* Upload Receipt */}
        <label className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer mb-3 hover:border-orange-400 transition">
          {preview ? (
            <img src={preview} className="w-full h-40 object-cover rounded-lg" />
          ) : (
            <span className="text-gray-500">Upload Payment Screenshot</span>
          )}
          <input type="file" className="hidden" onChange={handleImage} />
        </label>

        {/* Confirm */}
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold hover:bg-orange-700 transition"
        >
          Confirm Payment ✅
        </button>
      </div>
    </div>
  );
};

export default Checkout;
