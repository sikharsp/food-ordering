import { Link } from 'react-router-dom';
import { FiHome, FiMenu, FiPhone, FiMail, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-orange-300 flex items-center">
                <FiHome className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-orange-300 flex items-center">
                <FiMenu className="mr-2" /> Menu
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-orange-300 flex items-center">
                <FiMenu className="mr-2" /> Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-300 flex items-center">
                <FiPhone className="mr-2" /> Contact
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-orange-300 flex items-center">
                <FiPhone className="mr-2" /> Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-orange-300 flex items-center">
                <FiPhone className="mr-2" /> Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="flex items-center text-gray-300 mb-2">
            <FiPhone className="mr-2" /> +977-9867391430
          </p>
          <p className="flex items-center text-gray-300 mb-2">
            <FiMail className="mr-2" /> support@foodhub.com
          </p>
          <p className="text-gray-300">Kathmandu, Nepal</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="hover:text-orange-300">
              <FiFacebook />
            </a>
            <a href="https://twitter.com" className="hover:text-orange-300">
              <FiTwitter />
            </a>
            <a href="https://instagram.com" className="hover:text-orange-300">
              <FiInstagram />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} FoodHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;