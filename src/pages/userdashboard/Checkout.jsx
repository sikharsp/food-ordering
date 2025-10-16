import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import qrImage from "./assets/IMG_7696.jpg";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();

  const [location, setLocation] = useState("Butwal");
  const [address, setAddress] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleBackClick = () => navigate(-1);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return alert("Please upload receipt first!");
    if (!address) return alert("Please enter your delivery address!");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("User not logged in!");
      navigate("/login");
      return;
    }

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
        alert("Order placed successfully!");
        setCart([]);
        navigate("/dashboard/menu");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 text-center">
        Complete Your Payment
      </h2>

      <img
        src={qrImage}
        alt="Payment QR"
        className="w-64 sm:w-72 h-64 sm:h-72 rounded-xl shadow-lg mb-6 border border-gray-300"
      />

      <div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Delivery Details
        </h3>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        >
          <option value="Butwal">Butwal</option>
          <option value="Tilottama">Tilottama</option>
          <option value="Bhairawa">Bhairawa</option>
          <option value="Sainamaina">Sainamaina</option>
        </select>

        <input
          type="text"
          placeholder="Enter address (e.g., Butwal, Manigram)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        />

        <label
          htmlFor="fileUpload"
          className="w-full h-48 sm:h-52 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center cursor-pointer rounded-xl hover:border-blue-600 transition mb-4"
        >
          {preview ? (
            <img
              src={preview}
              alt="Receipt Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <p className="text-gray-500 text-sm sm:text-base text-center">
              Drag & drop or click to upload receipt
            </p>
          )}
        </label>

        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
          >
            Submit
          </button>
          <button
            onClick={handleBackClick}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg shadow hover:bg-gray-600 transition font-semibold"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
