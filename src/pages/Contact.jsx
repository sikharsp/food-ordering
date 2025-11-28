import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import * as Yup from "yup";

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ContactSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const res = await fetch("http://localhost/api/contact/send_message.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        alert("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920')] bg-cover bg-center opacity-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto px-6 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto font-light">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 96L80 80C160 64 320 32 480 32C640 32 800 64 960 80C1120 96 1280 96 1360 96L1440 96V120H1360C1280 120 1120 120 960 120C800 120 640 120 480 120C320 120 160 120 80 120H0V96Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-8">We're Here to Help</h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Whether you need help with an order, have feedback, or want to explore catering options — our team is ready to assist you 24/7.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-4 bg-orange-500 rounded-xl text-white">
                    <FiPhone size={28} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+977-9867391430</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-4 bg-orange-500 rounded-xl text-white">
                    <FiMail size={28} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">support@foodhub.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-4 bg-orange-500 rounded-xl text-white">
                    <FiClock size={28} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Support Hours</p>
                    <p className="text-gray-600">24 hours a day, 7 days a week</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-4 bg-orange-500 rounded-xl text-white">
                    <FiMapPin size={28} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">Kathmandu, Nepal</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border ${
                      errors.name ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                    } focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border ${
                      errors.email ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                    } focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-5 py-4 rounded-xl border ${
                      errors.message ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-orange-500"
                    } focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all resize-none`}
                    placeholder="How can we help you today?"
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-lg py-5 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <FiSend size={22} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;