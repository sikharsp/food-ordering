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

    try {
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
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 flex flex-col md:flex-row gap-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-800 text-xl hover:text-black z-50"
          aria-label="Go back"
        >
          <FiArrowLeft />
        </button>

        {/* Left Column: QR + Payment Info */}
        <div className="flex-1 bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <h2 className="font-bold text-xl mb-2">Sikhar Panthi</h2>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-gray-600">📞 9867391430</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText("9867391430");
                alert("Phone number copied!");
              }}
              className="text-blue-500 text-sm hover:underline"
            >
              Copy
            </button>
          </div>

          <img src={qrImage} alt="eSewa QR Code" className="w-64 h-64 rounded-xl shadow mb-3" />
          <p className="text-gray-500 text-sm text-center">Scan QR to Pay</p>

          {/* eSewa Payment Details */}
          <div className="mt-4 text-center bg-white p-3 rounded-lg shadow-sm">
            <p className="text-green-600 font-medium">eSewa</p>
            <p className="text-gray-700 font-semibold">Sikhar Panthi</p>
            <p className="text-gray-600">9867391430</p>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="flex-1">
          <h1 className="font-bold text-2xl mb-4">Checkout</h1>

          {/* Delivery Address */}
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <h2 className="font-semibold mb-2">Delivery Address</h2>
            <select
              className="w-full p-3 rounded-xl bg-white border mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Butwal">Butwal</option>
              <option value="Tilottama">Tilottama</option>
              <option value="Bhairawa">Bhairawa</option>
              <option value="Sainamaina">Sainamaina</option>
            </select>
            <input
              type="text"
              placeholder="Enter Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
            <h3 className="font-semibold mb-2 text-orange-700">Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span>{item.name} × {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="my-2 border-orange-200" />
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

          {/* Upload Payment Screenshot */}
          <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer mb-3 hover:border-orange-400 transition">
            {preview ? (
              <img src={preview} alt="Payment proof preview" className="w-full h-48 object-cover rounded-lg mx-auto" />
            ) : (
              <span className="text-gray-500">Upload Payment Screenshot</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>

          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-600 text-white p-3 rounded-xl font-bold hover:bg-orange-700 transition mb-2 flex items-center justify-center gap-2"
          >
            Confirm Payment ✅
          </button>

          <p className="text-gray-500 text-sm text-center">
            Secure Payment • Manually verified within 2-5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
