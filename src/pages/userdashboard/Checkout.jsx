import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FiUpload, FiArrowLeft, FiHome } from "react-icons/fi";
import qrImage from "./assets/IMG_7696.jpg";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();

  const [location, setLocation] = useState("Butwal");
  const [address, setAddress] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return alert("Please upload your payment receipt!");
    if (!address) return alert("Enter delivery address first!");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    setLoading(true);

    const formData = new FormData();
    formData.append("receipt", uploadedImage);
    formData.append("user_id", user.id);
    formData.append("transaction_code", "TXN" + Date.now());
    formData.append("location", location);
    formData.append("address", address);
    formData.append("cart", JSON.stringify(cart));

    try {
      const res = await fetch("http://localhost/api/orders/orders.php", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setCart([]);
        navigate("/dashboard/menu");
        alert("🎉 Payment submitted! Order is being verified.");
      } else {
        alert(data.message);
      }
    } catch {
      alert("❌ Something went wrong! Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-lg flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <FiArrowLeft size={22} />
        </button>
        <h2 className="text-xl font-bold tracking-wide text-gray-800">
          Secure Checkout
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white shadow-xl w-full max-w-lg p-6 rounded-2xl space-y-6 border border-orange-200">

        {/* QR */}
        <div className="text-center">
          <p className="font-semibold text-gray-700 mb-2">Scan & Pay via eSewa</p>
          <img src={qrImage} className="w-64 mx-auto rounded-xl shadow" />
          <p className="text-xs text-orange-600 mt-1">Payment auto-verified in 5–10 mins</p>
        </div>

        {/* Order Info */}
        <div className="bg-orange-50 p-4 rounded-xl">
          <p className="font-semibold text-gray-700 mb-2">Order Summary</p>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-700">
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 font-bold text-gray-800 flex justify-between">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>
        </div>

        {/* Location */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-2 rounded-xl focus:ring focus:ring-orange-300"
        >
          <option>Butwal</option>
          <option>Tilottama</option>
          <option>Bhairawa</option>
          <option>Sainamaina</option>
        </select>

        {/* Address */}
        <input
          type="text"
          placeholder="Delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded-xl focus:ring focus:ring-orange-300"
        />

        {/* Upload */}
        <label
          htmlFor="file"
          className="border-2 border-dashed p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-orange-50 hover:bg-orange-100 transition"
        >
          {preview ? (
            <img src={preview} className="w-full rounded-lg" />
          ) : (
            <>
              <FiUpload size={32} className="text-orange-500" />
              <p className="text-sm text-gray-500 mt-2">Upload payment screenshot</p>
            </>
          )}
        </label>
        <input id="file" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-600 text-white font-semibold py-2 rounded-xl shadow hover:bg-orange-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Payment"}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        🔒 Secure Payment — Receipt stored safely
      </p>
    </div>
  );
};

export default Checkout;
