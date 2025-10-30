import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import qrImage from "./assets/IMG_7696.jpg";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();

  const [location, setLocation] = useState("Butwal");
  const [address, setAddress] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return alert("Please upload the payment screenshot.");
    if (!address) return alert("Please enter your delivery address.");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

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
        alert("✅ Order submitted! We will verify your payment.");
        setCart([]);
        navigate("/dashboard/menu");
      } else {
        alert(data.message);
      }
    } catch {
      alert("❌ Something went wrong!");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen p-4 flex justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Checkout & Payment
        </h2>

        {/* QR Box */}
        <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
          <img src={qrImage} className="w-52 mx-auto rounded-lg" alt="QR" />
          <p className="mt-3 text-gray-700 font-medium">Scan & Pay via eSewa</p>

          <div className="mt-2 text-sm text-gray-600">
            <p><span className="font-semibold">Name:</span> Sikhar Panthi</p>
            <p><span className="font-semibold">Number:</span> 9867391430</p>
          </div>

          <p className="text-xs text-green-600 mt-2">✔ Payment secure & verified manually</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 mt-4 p-3 rounded-lg border">
          <p className="font-semibold text-gray-700 mb-2">Order Summary</p>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-700 mb-1">
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t mt-2 pt-2 font-bold flex justify-between text-gray-800">
            <span>Total:</span>
            <span>Rs. {total}</span>
          </div>
        </div>

        {/* Form */}
        <div className="mt-4 space-y-3">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2 rounded-md"
          >
            <option>Butwal</option>
            <option>Tilottama</option>
            <option>Bhairawa</option>
            <option>Sainamaina</option>
          </select>

          <input
            type="text"
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border p-2 rounded-md"
          />

          {/* Upload Box */}
          <label className="border border-dashed p-4 rounded-md cursor-pointer text-center text-gray-600 bg-gray-50 hover:bg-gray-100 transition">
            {preview ? (
              <img src={preview} className="w-full rounded-md" alt="Receipt" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FiUpload size={24} />
                <span className="text-sm">Upload payment screenshot</span>
              </div>
            )}
            <input type="file" className="hidden" onChange={handleImageChange} />
          </label>

          {/* Buttons */}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700"
          >
            Submit Order
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-600 text-white py-2 rounded-md font-medium hover:bg-gray-700"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
