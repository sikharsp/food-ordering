import { useState } from 'react';
import { FiUser, FiPhone, FiMail, FiLock } from 'react-icons/fi';
import * as Yup from 'yup';

// Validation schema with Yup
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name must contain only alphabetic characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^9[78][0-9]{8}$/, 'Phone must be a 10-digit number starting with 97 or 98')
    .test('no-repeating', 'Phone cannot be all 1s or all 0s', (value) => {
      if (!value) return true;
      return !/^(9[78])(1|0)\1{8}$/.test(value);
    }),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    ),
  foodPreference: Yup.string()
    .required('Please select a food preference')
    .oneOf(['veg', 'nonveg', 'both'], 'Invalid food preference'),
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    foodPreference: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await RegisterSchema.validate(formData, { abortEarly: false });
      setErrors({});
      // Placeholder for backend API call
      console.log('Form submitted:', formData);
      alert('Registration successful! (Placeholder - backend not connected)');
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 flex items-center justify-center mb-6">
          <FiUser className="mr-2" /> Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div className="mt-1 relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                placeholder="9847543024"
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                placeholder="********"
              />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Food Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Preference</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="veg"
                  name="foodPreference"
                  type="radio"
                  value="veg"
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="veg" className="ml-2 text-sm text-gray-700">
                  Vegetarian
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="nonveg"
                  name="foodPreference"
                  type="radio"
                  value="nonveg"
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="nonveg" className="ml-2 text-sm text-gray-700">
                  Non-Vegetarian
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="both"
                  name="foodPreference"
                  type="radio"
                  value="both"
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="both" className="ml-2 text-sm text-gray-700">
                  Both
                </label>
              </div>
            </div>
            {errors.foodPreference && (
              <p className="mt-1 text-sm text-red-500">{errors.foodPreference}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Register
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;