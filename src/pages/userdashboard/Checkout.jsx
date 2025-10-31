import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiUpload, FiCheckCircle } from "react-icons/fi";
import qrImage from "./assets/IMG_7696.jpg";

const API_BASE = "http://localhost/api/promos.php"; // promos API (PHP)

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useOutletContext();

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("Butwal");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Promo states now validated by backend
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [appliedPromoDetails, setAppliedPromoDetails] = useState(null);

  const deliveryCharge = ["Butwal", "Tilottama"].includes(location) ? 100 : 150;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  useEffect(() => {
    // if subtotal changes and promo is percent-based, re-calc discount
    if (promoApplied && appliedPromoDetails) {
      if (appliedPromoDetails.type === "percent") {
        const newDiscount = Math.round(subtotal * (appliedPromoDetails.amount / 100));
        setDiscount(newDiscount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Apply promo — calls backend to validate rules (expiry, one-time, new-user only)
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return alert("Enter a promo code");
    if (promoApplied) return alert("Promo already applied");

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const body = new FormData();
      body.append("action", "validate");
      body.append("code", promoCode.trim());
      body.append("user_id", user ? user.id : "");
      body.append("subtotal", subtotal);

      const res = await fetch(API_BASE, { method: "POST", body });
      const data = await res.json();

      if (!data.success) return alert(data.message || "Invalid promo");

      // data.payload should contain: { type: 'percent'|'flat', amount: number, id, one_time_use }
      setAppliedPromoDetails(data.payload);

      let discountAmount = 0;
      if (data.payload.type === "percent") discountAmount = Math.round(subtotal * (data.payload.amount / 100));
      else discountAmount = Number(data.payload.amount || 0);

      setDiscount(discountAmount);
      setPromoApplied(true);
      alert("Promo applied successfully!");
    } catch (err) {
      console.error(err);
      alert("Network error validating promo");
    }
  };

  // Remove promo locally (does not change server usage)
  const handleRemovePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setPromoApplied(false);
    setAppliedPromoDetails(null);
  };

  // On successful order, if promo is one-time we must mark it as used on backend
  const markPromoUsed = async (promoId, userId) => {
    try {
      const body = new FormData();
      body.append("action", "mark_used");
      body.append("promo_id", promoId);
      body.append("user_id", userId);

      const res = await fetch(API_BASE, { method: "POST", body });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error("mark promo used err", err);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage) return alert("Please upload payment screenshot!");
    if (!address.trim()) return alert("Please enter delivery address!");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");

    setLoading(true);
    const formData = new FormData();
    formData.append("receipt", uploadedImage);
    formData.append("user_id", user.id);
    formData.append("transaction_code", "QR" + Date.now());
    formData.append("location", location);
    formData.append("address", address);
    formData.append("cart", JSON.stringify(cart));
    formData.append("delivery_charge", deliveryCharge);
    formData.append("discount", discount);
    formData.append("promo_code", promoApplied ? promoCode.trim() : "");
    formData.append("total_amount", total);

    try {
      const res = await fetch("http://localhost/api/orders/orders.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        // mark promo used if necessary
        if (promoApplied && appliedPromoDetails && appliedPromoDetails.one_time_use) {
          await markPromoUsed(appliedPromoDetails.id, user.id);
        }

        alert("Order Confirmed! You’ll receive it soon.");
        setCart([]);
        navigate("/dashboard/menu");
      } else {
        alert(data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
          Back to Cart
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: QR Code & Payment Info */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Pay via eSewa</h2>
              <p className="text-gray-600 mt-1">Scan QR to pay instantly</p>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <img src={qrImage} alt="eSewa QR Code" className="w-full max-w-xs mx-auto rounded-xl shadow-lg" />
            </div>

            <div className="mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pay to</p>
                  <p className="text-xl font-bold">Sikhar Panthi</p>
                  <p className="text-lg">9867391430</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("9867391430");
                    alert("Copied!");
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Copy ID
                </button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">Scan QR → Pay Rs {total} → Upload Screenshot</p>
          </div>

          {/* Right: Checkout Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Order</h1>

            {/* Delivery Address */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FiMapPin className="text-orange-500" />
                  Delivery Location
                </label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition">
                  <option value="Butwal">Butwal</option>
                  <option value="Tilottama">Tilottama</option>
                  <option value="Bhairawa">Bhairawa</option>
                  <option value="Sainamaina">Sainamaina</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Delivery Address</label>
                <input type="text" placeholder="e.g., Milan Chowk, Near Galaxy School" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition" />
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Enter promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400" disabled={promoApplied} />
                <button onClick={handleApplyPromo} disabled={promoApplied} className="px-6 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50">Apply</button>
                {promoApplied && (
                  <button onClick={handleRemovePromo} className="px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300">Remove</button>
                )}
              </div>
              {promoApplied && <p className="text-green-600 text-sm mt-2">Promo Applied ✔ — {appliedPromoDetails?.code}</p>}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-5 rounded-2xl mb-6 border border-orange-100">
              <h3 className="font-bold text-lg text-orange-700 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-700">{item.name} × {item.quantity}</span>
                    <span className="font-medium">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="my-3 border-dashed border-orange-200" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>Rs. {deliveryCharge}</span></div>
                {discount > 0 && (<div className="flex justify-between text-sm text-green-600 font-bold"><span>Discount</span><span>- Rs. {discount}</span></div>)}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-orange-200"><span className="text-lg font-bold text-gray-800">Total</span><span className="text-2xl font-bold text-orange-600">Rs. {total}</span></div>
            </div>

            {/* Upload Screenshot */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-3 flex items-center gap-2"><FiUpload className="text-orange-500" /> Upload Payment Screenshot</label>
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                {preview ? (
                  <div className="space-y-3">
                    <img src={preview} alt="Payment proof" className="mx-auto max-h-48 rounded-lg shadow-md" />
                    <p className="text-sm text-green-600 flex items-center justify-center gap-1"><FiCheckCircle /> Screenshot uploaded</p>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <FiUpload className="mx-auto text-4xl mb-2 text-gray-400" />
                    <p>Click to upload</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>

            {/* Confirm Button */}
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (<span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</span>) : (<><FiCheckCircle className="text-xl" /> Confirm Payment</>)}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">Secure Payment • Verified in 2–5 mins • Support: 9867391430</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
