// src/components/auth/SignupFlow.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronLeft } from 'lucide-react';

const SignupFlow = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
    position: '',
    phone: '',
    phoneCountry: 'US',
    industry: '',
    city: '',
    employeeCount: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const positions = [
    'CEO/Founder',
    'Marketing Manager',
    'Digital Strategist',
    'Project Manager',
    'Web Developer',
    'Designer',
    'Operations Manager',
    'Other'
  ];

  const industries = [
    'Agency/Marketing',
    'Software/Technology',
    'E-commerce',
    'Healthcare',
    'Education',
    'Finance',
    'Manufacturing',
    'Real Estate',
    'Hospitality',
    'Other'
  ];

  const employeeSizes = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 0: // Email step
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        break;

      case 1: // Company step
        if (!formData.companyName) {
          newErrors.companyName = 'Company name is required';
        }
        break;

      case 2: // Personal details step
        if (!formData.fullName) {
          newErrors.fullName = 'Full name is required';
        }
        if (!formData.position) {
          newErrors.position = 'Position is required';
        }
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        }
        if (!formData.industry) {
          newErrors.industry = 'Industry is required';
        }
        break;

      case 3: // Employee count step
        if (!formData.employeeCount) {
          newErrors.employeeCount = 'Please select company size';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep()) {
      if (currentStep === 4) {
        handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await signup(formData);
      setCurrentStep(5); // Move to success step
      setShowConfetti(true);
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        submit: error.message || 'An error occurred during signup. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 150; i++) {
      const piece = document.createElement('div');
      const size = Math.random() * 10 + 5;
      piece.style.position = 'absolute';
      piece.style.width = `${size}px`;
      piece.style.height = `${size}px`;
      piece.style.borderRadius = '50%';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = '-10px';

      const colors = [
        '#FACC15', '#FBBF24', '#F59E0B', '#10B981',
        '#3B82F6', '#EC4899', '#A855F7', '#EF4444', '#FFFFFF'
      ];
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 0.5;
      piece.style.animation = `confetti ${duration}s ease-in ${delay}s forwards`;

      confettiContainer.appendChild(piece);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      document.body.removeChild(confettiContainer);
      document.head.removeChild(style);
    }, 5000);
  };

  useEffect(() => {
    if (showConfetti) {
      addConfetti();
    }
  }, [showConfetti]);

  const gotoDashboard = () => {
    navigate('/dashboard');
  };

  // Welcome Screen
  const WelcomeScreen = () => (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Build Digital Growth</h1>
        <p className="mb-6 text-gray-600">Create your free account in seconds</p>
        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="youremail@company.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Create a secure password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-black text-white p-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            Continue with Email
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <button className="w-full border border-gray-300 p-3 rounded-md font-medium flex items-center justify-center">
            <img src="/google-logo.svg" alt="Google" className="h-5 w-5 mr-2" />
            <span>Google</span>
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Log in</a>
          </p>
        </div>
      </div>
      <div className="w-1/2 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-3">Grow your business</h2>
          <p className="text-lg">Get insights and strategy to help your business thrive</p>
        </div>
      </div>
    </div>
  );

  // Company Form
  const CompanyForm = () => (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-4">Your company</h1>
        <p className="mb-6 text-gray-600">Tell us about your business</p>

        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`w-full p-3 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Enter your company name"
            />
            {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-black text-white p-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Continue
          </button>
        </div>
      </div>
      <div className="w-1/2 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-3">Tell us about your company</h2>
          <p className="text-lg">We'll tailor our recommendations to your business</p>
        </div>
      </div>
    </div>
  );

  // Personal Info Form
  const PersonalInfoForm = () => (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-4">Your details</h1>
        <p className="mb-6 text-gray-600">Help us personalize your experience</p>

        <div className="space-y-4">
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full p-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              placeholder="Your name"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={`w-full p-3 border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white`}
            >
              <option value="" disabled>Select your position</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
            {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <select
                name="phoneCountry"
                value={formData.phoneCountry}
                onChange={handleInputChange}
                className="p-3 border border-gray-300 rounded-l-md bg-white w-24"
              >
                <option value="US">+1 🇺🇸</option>
                <option value="GB">+44 🇬🇧</option>
                <option value="AU">+61 🇦🇺</option>
                <option value="CA">+1 🇨🇦</option>
                {/* Add more countries as needed */}
              </select>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`flex-1 p-3 border border-gray-300 rounded-r-md ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className={`w-full p-3 border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white`}
            >
              <option value="" disabled>Select your industry</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Your city"
            />
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-black text-white p-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Continue
          </button>
        </div>
      </div>
      <div className="w-1/2 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-3">Tell us about yourself</h2>
          <p className="text-lg">We'll use this to provide you with better support</p>
        </div>
      </div>
    </div>
  );

  // Company Size Form
  const CompanySizeForm = () => (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-4">Number of employees</h1>
        <p className="mb-6 text-gray-600">Help us understand your business size</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {employeeSizes.map((size) => (
              <label
                key={size}
                className={`flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  formData.employeeCount === size
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="employeeCount"
                  value={size}
                  checked={formData.employeeCount === size}
                  onChange={handleInputChange}
                  className="mr-2 text-yellow-500"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
          {errors.employeeCount && <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>}

          <button
            onClick={handleContinue}
            className="w-full bg-black text-white p-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Continue
          </button>
        </div>
      </div>
      <div className="w-1/2 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-3">Almost there</h2>
          <p className="text-lg">We'll tailor our recommendations based on your company size</p>
        </div>
      </div>
    </div>
  );

  // Summary
  const SummaryScreen = () => (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold mb-4">Summary</h1>
        <p className="mb-6 text-gray-600">Please review your information</p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.companyName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.fullName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.phoneCountry === 'US' ? '+1 ' :
                 formData.phoneCountry === 'GB' ? '+44 ' :
                 formData.phoneCountry === 'AU' ? '+61 ' :
                 formData.phoneCountry === 'CA' ? '+1 ' : ''}
                {formData.phone}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Position</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.position}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Industry</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.industry}</dd>
            </div>
            {formData.city && (
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.city}</dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Company Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.employeeCount} employees</dd>
            </div>
          </dl>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {errors.submit}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-md font-medium hover:bg-gray-300 transition-colors"
            disabled={isSubmitting}
          >
            Go Back
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 bg-yellow-500 text-white p-3 rounded-md font-medium hover:bg-yellow-600 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Get Started'}
          </button>
        </div>
      </div>
      <div className="w-1/2 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-3">Ready to get started</h2>
          <p className="text-lg">You're just one click away from unlocking your digital growth potential</p>
        </div>
      </div>
    </div>
  );

  // Success Screen
  const SuccessScreen = () => (
    <div className="flex min-h-screen">
      <div className="w-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-xl max-w-lg mx-auto p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Account Created!</h1>
          <p className="text-gray-600 mb-8">
            Welcome to Build Digital Growth, {formData.fullName}! Your account has been successfully created.
          </p>
          <button
            onClick={gotoDashboard}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return <CompanyForm />;
      case 2:
        return <PersonalInfoForm />;
      case 3:
        return <CompanySizeForm />;
      case 4:
        return <SummaryScreen />;
      case 5:
        return <SuccessScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return renderStep();
};

export default SignupFlow;
