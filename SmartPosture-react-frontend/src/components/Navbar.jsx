import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get the user's display name and profile image
  const getUserDisplayName = () => {
    if (!user) return "User";
    return (
      user.username ||
      user.name ||
      user.firstName ||
      user.displayName ||
      user.email?.split('@')[0] ||
      "User"
    );
  };

  const getUserProfileImage = () => {
    if (!user) return "/default-avatar.png";
    return user.profilePicture || user.picture || user.avatar || user.imageUrl || "/default-avatar.png";
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes subtleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.7;
            filter: blur(4px);
          }
          50% {
            opacity: 1;
            filter: blur(6px);
          }
        }

        @keyframes borderFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        @keyframes shimmer {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out w-full">
        {/* Full-width background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 backdrop-blur-sm -z-10"></div>
        
        {/* Main navbar container - now full width with padding on sides */}
        <div className={`w-full px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
          {/* Logo */}
          <Link to="/" className="relative group">
            <div
              className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 
              group-hover:opacity-25 blur-lg transition-all duration-500 -z-10 rounded-lg"
            ></div>
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent 
              text-3xl font-bold transition-all duration-300"
            >
              Smart Posture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-10 items-center">
            {[
              { path: "/", label: "Home" },
              { path: "/analysis", label: "Analysis" },
              { path: "/report", label: "Report" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                label={item.label}
                active={location.pathname === item.path}
              />
            ))}
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-6 group relative">
                <div className="flex items-center space-x-4">
                  <div className="relative p-1 rounded-full overflow-hidden">
                    {/* Enhanced animated border */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      style={{ backgroundSize: "200% 100%", animation: "borderFlow 2s linear infinite" }}
                    ></div>
                    <img
                      src={getUserProfileImage()}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-transparent object-cover relative z-10 bg-gray-800"
                    />
                  </div>
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-lg font-medium">
                    {getUserDisplayName()}
                  </span>
                </div>

                {/* Logout Button - With gradient text */}
                <button
                  onClick={logout}
                  className="relative overflow-hidden px-6 py-3 bg-white hover:bg-gray-50 border border-purple-300
                  rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent text-lg font-medium"
                        style={{ backgroundSize: "200% auto", animation: "gradientShift 3s ease infinite" }}>
                    Logout
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {/* Subtle shimmer effect */}
                  <div className="absolute inset-0 -z-10">
                    <div
                      className="absolute inset-y-0 w-1/3 bg-purple-100/50"
                      style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
                    ></div>
                  </div>
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="relative overflow-hidden px-6 py-3 bg-white hover:bg-gray-50 border border-blue-300
                rounded-lg transition-all duration-300 hover:shadow-lg group"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg font-medium"
                        style={{ backgroundSize: "200% auto", animation: "gradientShift 3s ease infinite" }}>
                    Sign In
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 -z-10">
                  <div
                    className="absolute inset-y-0 w-1/3 bg-blue-100/50"
                    style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
                  ></div>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white border border-purple-300 shadow-sm transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="url(#menuIconGradient)" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="menuIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Overlay - Full screen */}
        <div
          className={`fixed inset-0 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-md
          flex flex-col items-center justify-center transition-all duration-400 ease-in-out z-50
          ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"} 
          md:hidden`}
        >
          {/* Floating particles effect */}
          <FloatingParticles />

          {/* Navigation items with gradient text */}
          <div className="flex flex-col items-center space-y-8">
            {[
              { path: "/", label: "Home" },
              { path: "/analysis", label: "Analysis" },
              { path: "/report", label: "Report" },
            ].map((item, index) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="relative text-3xl font-medium hover:scale-105 transition-all duration-300"
                style={{
                  animation: mobileMenuOpen
                    ? `fadeIn 0.3s ease-out forwards ${index * 0.1}s`
                    : "none",
                  opacity: 0,
                }}
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                      style={{ backgroundSize: "200% auto", animation: "gradientShift 3s ease infinite" }}>
                  {item.label}
                </span>
                {/* Gradient underline on hover */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section with gradient text */}
          <div
            className="mt-12"
            style={{
              animation: mobileMenuOpen ? "fadeIn 0.3s ease-out forwards 0.3s" : "none",
              opacity: 0,
            }}
          >
            {user ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative p-1 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ backgroundSize: "200% 100%", animation: "borderFlow 2s linear infinite" }}
                  ></div>
                  <img
                    src={getUserProfileImage()}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover relative z-10 bg-gray-800"
                  />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-medium text-2xl"
                      style={{ backgroundSize: "200% auto", animation: "gradientShift 3s ease infinite" }}>
                  {getUserDisplayName()}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="relative overflow-hidden mt-3 px-8 py-3 bg-white border border-pink-300
                  rounded-lg shadow-md transition-all duration-300"
                >
                  <span className="relative z-10 bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent text-xl font-medium"
                        style={{ backgroundSize: "200% auto", animation: "gradientShift 3s ease infinite" }}>
                    Logout
                  </span>
                  {/* Subtle shimmer effect */}
                  <div className="absolute inset-0 -z-10">
                    <div
                      className="absolute inset-y-0 w-1/3 bg-pink-100/50"
                      style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
                    ></div>
                  </div>
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="relative overflow-hidden px-8 py-4 bg-white border border-blue-300
                rounded-lg shadow-md transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xl font-medium"
                        style={{ backgroundSize: "200% auto", animation: "gradientShift 3s ease infinite" }}>
                    Sign In
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 -z-10">
                  <div
                    className="absolute inset-y-0 w-1/3 bg-blue-100/50"
                    style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
                  ></div>
                </div>
              </Link>
            )}
          </div>

          {/* Close button with gradient */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white border border-pink-300 transition-colors duration-300"
            aria-label="Close menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="url(#closeIconGradient)" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="closeIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

// NavLink with gradient text
const NavLink = ({ to, label, active }) => (
  <Link
    to={to}
    className={`relative py-3 px-4 transition-all duration-300 group`}
  >
    <span className="relative text-xl">
      <span 
        className={`bg-gradient-to-r ${
          active 
            ? "from-purple-500 to-indigo-500" 
            : "from-blue-500 to-purple-600 group-hover:from-purple-500 group-hover:to-indigo-500"
        } bg-clip-text text-transparent transition-all duration-300`}
        style={{ backgroundSize: "200% auto", animation: active ? "gradientShift 3s ease infinite" : "none" }}
      >
        {label}
      </span>
      {/* Animated underline */}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full
        transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`}
        style={{
          animation: active ? "subtleFloat 2s ease-in-out infinite" : "none",
        }}
      ></span>
    </span>
  </Link>
);

// FloatingParticles effect for background decoration in mobile menu
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-xl"
          style={{
            width: `${Math.random() * 100 + 40}px`,
            height: `${Math.random() * 100 + 40}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.6,
            animation: `glowPulse ${Math.random() * 4 + 6}s infinite ease-in-out, subtleFloat ${
              Math.random() * 8 + 12
            }s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
};

export default Navbar;