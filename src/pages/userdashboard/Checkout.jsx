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

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const esewaFormSubmit = () => {
    const data = {
      amt: total,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: total,
      pid: "EPAY" + Date.now(),
      scd: "EPAYTEST",
      su: "http://localhost:5173/payment-success",
      fu: "http://localhost:5173/payment-failed"
    };

    const form = document.createElement("form");
    form.action = "https://uat.esewa.com.np/epay/main";
    form.method = "POST";

    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitReceipt = async () => {
    if (!uploadedImage) return alert("Upload screenshot first!");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        
        <h2 className="text-2xl font-bold text-center mb-3">Checkout</h2>

        <p className="text-gray-600 text-center mb-4">
          <strong>Name:</strong> Sikhar Panthi <br />
          <strong>Phone:</strong> 9867391430
        </p>

        <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>

        <select 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-2 border p-2 rounded"
        >
          <option>Butwal</option>
          <option>Tilottama</option>
          <option>Bhairawa</option>
          <option>Sainamaina</option>
        </select>

        <input
          type="text"
          placeholder="Enter address…"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-4 border p-2 rounded"
        />

        <h3 className="text-lg font-semibold mb-2">Payment Method</h3>

        <button
          onClick={esewaFormSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition mb-3"
        >
          Pay with eSewa
        </button>

        <p className="text-center text-gray-500 text-sm mb-3">or Scan & Pay</p>

        <img src={qrImage} className="w-64 mx-auto rounded-lg shadow mb-4" />

        <label className="block border-2 border-dashed p-4 rounded-lg text-center cursor-pointer mb-3">
          {preview ? (
            <img src={preview} className="w-full h-40 object-cover rounded" />
          ) : (
            "Upload Payment Screenshot"
          )}
          <input type="file" accept="image/*" onChange={handleReceiptUpload} className="hidden" />
        </label>

        <button
          onClick={handleSubmitReceipt}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          I Already Paid ✅
        </button>
      </div>
    </div>
  );
};

export default Checkout;
