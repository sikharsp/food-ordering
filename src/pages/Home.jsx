import { FiMenu, FiTruck, FiPhone, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const items = [
    {
      icon: FiMenu,
      title: "Menu",
      description: "Explore our wide variety of delicious dishes crafted with love.",
      color: "from-orange-400 to-red-500",
    },
    {
      icon: FiTruck,
      title: "Delivery & Services",
      description: "Fast delivery, catering, and pickup options available daily.",
      color: "from-emerald-400 to-teal-600",
    },
    {
      icon: FiPhone,
      title: "Contact Us",
      description: "We're here to help! Call or message us anytime.",
      color: "from-blue-400 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 py-32">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920')] bg-cover bg-center opacity-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto px-6 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Welcome to <span className="text-orange-200">FoodHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-10 max-w-3xl mx-auto font-light">
            Experience culinary excellence with fresh ingredients and bold flavors — 
            delivered straight to your doorstep in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/menu"
              className="group inline-flex items-center bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg py-4 px-10 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Order Now
              <FiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={20} />
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold text-lg py-4 px-10 rounded-full transition-all duration-300"
            >
              View Menu
            </Link>
          </div>
        </motion.div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 96L80 80C160 64 320 32 480 32C640 32 800 64 960 80C1120 96 1280 96 1360 96L1440 96V120H1360C1280 120 1120 120 960 120C800 120 640 120 480 120C320 120 160 120 80 120H0V96Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose FoodHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh food, fast service, and unforgettable taste — every single time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <Link
                    to={`/${item.title.split(" ")[0].toLowerCase()}`}
                    className="block h-full"
                  >
                    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 h-full p-8 text-center">
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="text-white" size={40} />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-6 text-orange-600 font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Learn more <FiArrowRight />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;