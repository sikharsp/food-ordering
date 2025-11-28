import { FiTruck, FiPackage, FiUsers, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: FiTruck,
      title: "Lightning Fast Delivery",
      description: "Hot & fresh food delivered to your doorstep in 30 minutes or less — guaranteed.",
      time: "30 mins average",
      gradient: "from-orange-400 to-red-500",
      badge: "Most Popular",
    },
    {
      icon: FiPackage,
      title: "Express Takeaway",
      description: "Order online and pick up your meal in just 15 minutes. Skip the wait!",
      time: "Ready in 15 mins",
      gradient: "from-emerald-400 to-teal-600",
    },
    {
      icon: FiUsers,
      title: "Event Catering",
      description: "From birthdays to corporate events — we cater with custom menus and professional service.",
      time: "24-hour notice",
      gradient: "from-purple-400 to-indigo-600",
      badge: "Perfect for Groups",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920')] bg-cover bg-center opacity-10"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto px-6 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto font-light">
            However you want to enjoy your meal — we've got you covered with speed, convenience, and care.
          </p>
        </motion.div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 96L80 80C160 64 320 32 480 32C640 32 800 64 960 80C1120 96 1280 96 1360 96L1440 96V120H1360C1280 120 1120 120 960 120C800 120 640 120 480 120C320 120 160 120 80 120H0V96Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Choose How You Enjoy FoodHub
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast. Fresh. Flexible — made for your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -12 }}
                  className="group relative"
                >
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full flex flex-col">
                    {/* Badge */}
                    {service.badge && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                        {service.badge}
                      </div>
                    )}

                    <div className="p-8 text-center flex-1 flex flex-col justify-between">
                      <div>
                        {/* Icon with Gradient Background */}
                        <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="text-white" size={44} />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                          {service.description}
                        </p>
                      </div>

                      {/* Time Badge */}
                      <div className="mt-auto">
                        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-full text-sm">
                          <FiClock className="text-orange-500" />
                          {service.time}
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Order?
          </h3>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you're dining in, taking away, or hosting an event — we've got the perfect option for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold text-lg py-4 px-10 rounded-full transition-all duration-300"
            >
              Book Catering
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;