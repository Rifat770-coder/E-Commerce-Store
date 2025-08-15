'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { cartAPI, authAPI } from '@/utils/api';

export default function Navbar() {
  const [cartItems, setCartItems] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: 'User', email: 'user@example.com' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
    fetchCartItems();
    checkAuthStatus();
    loadUserInfo();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
      fetchCartItems();
      loadUserInfo();
    };

    // Listen for custom auth state changes
    const handleAuthStateChange = () => {
      checkAuthStatus();
      fetchCartItems();
      loadUserInfo();
    };

    // Listen for window focus to check auth status
    const handleWindowFocus = () => {
      checkAuthStatus();
      fetchCartItems();
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthStateChange);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('mousedown', handleClickOutside);

    // Also check auth status periodically (less frequent now)
    const interval = setInterval(() => {
      checkAuthStatus();
      fetchCartItems();
    }, 2000); // Check every 2 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCartItems = async () => {
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    if (!isAuth) {
      setCartItems(0);
      return;
    }

    try {
      const response = await cartAPI.get();
      setCartItems(response.data.total_items || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems(0);
    }
  };

  const checkAuthStatus = () => {
    // Simple check - in a real app, you'd verify with the backend
    const isAuth = localStorage.getItem('isLoggedIn') === 'true';
    if (isAuth !== isLoggedIn) {
      setIsLoggedIn(isAuth);
    }
  };

  const loadUserInfo = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        setUserInfo(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const getInitials = () => {
    return userInfo.username.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      setIsLoggedIn(false);
      setCartItems(0);
      setShowProfileDropdown(false);

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('authStateChanged'));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-slate-900 to-neutral-900 text-white shadow-2xl border-b border-primary-500/20 relative z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-secondary-600/10 to-accent-600/10 animate-pulse"></div>
          <Link href="/" className="text-xl font-bold flex items-center space-x-3 relative z-10 group -ml-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
              </svg>
            </div>
            <span className="text-white font-extrabold text-2xl">
              Shopcart
            </span>
          </Link>

          <div className="flex items-center space-x-8 relative z-10">
            <Link href="/categories" className="relative group px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
              <span className="text-gray-200 group-hover:text-white font-medium">Categories</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/deals" className="relative group px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
              <span className="text-gray-200 group-hover:text-white font-medium">Deals</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/new" className="relative group px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
              <span className="text-gray-200 group-hover:text-white font-medium">What&apos;s New</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/delivery" className="relative group px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
              <span className="text-gray-200 group-hover:text-white font-medium">Delivery</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-white placeholder-gray-300 bg-transparent outline-none px-2 py-1 w-64"
              />
              <button type="submit" className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-300 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {isHydrated && isLoggedIn ? (
              <>
                <Link href="/cart" className="relative group flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <div className="relative">
                    <svg className="w-6 h-6 text-gray-200 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    {isHydrated && cartItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {cartItems}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-200 group-hover:text-white font-medium">Cart</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative z-[99999]" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/30 shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
                      {getInitials()}
                    </div>
                    <span className="hidden md:block text-gray-200 group-hover:text-white font-medium">{isHydrated ? userInfo.username : 'User'}</span>
                    <svg
                      className={`w-4 h-4 text-gray-300 group-hover:text-white transition-all duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-primary-200/30 overflow-hidden z-[99999] animate-in slide-in-from-top-2 duration-300" style={{ zIndex: 99999, position: 'absolute' }}>
                      {/* User Info Section */}
                      <div className="px-6 py-6 bg-gradient-to-br from-sky-50 via-emerald-50 to-orange-50 border-b border-primary-100/50 relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sky-200/20 to-emerald-200/20 rounded-full -translate-y-4 translate-x-4"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-200/20 to-sky-200/20 rounded-full translate-y-4 -translate-x-4"></div>

                        <div className="flex items-center space-x-4 relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-xl ring-4 ring-white/30 transform hover:scale-105 transition-transform duration-200">
                            {getInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xl font-bold text-neutral-900 truncate mb-1">
                              {userInfo.username}
                            </p>
                            <p className="text-sm text-neutral-600 truncate bg-white/50 px-2 py-1 rounded-full">
                              {userInfo.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-3">
                        <Link
                          href="/profile"
                          className="flex items-center mx-3 px-4 py-3 text-neutral-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-emerald-50 hover:text-sky-700 transition-all duration-300 group rounded-2xl"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <div className="w-10 h-10 rounded-xl bg-sky-100 group-hover:bg-sky-200 flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 text-sky-600 group-hover:text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-base">View Profile</span>
                        </Link>

                        <Link
                          href="/profile/edit"
                          className="flex items-center mx-3 px-4 py-3 text-neutral-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-sky-50 hover:text-emerald-700 transition-all duration-300 group rounded-2xl"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-base">Edit Profile</span>
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center mx-3 px-4 py-3 text-neutral-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-sky-50 hover:text-orange-700 transition-all duration-300 group rounded-2xl"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <div className="w-10 h-10 rounded-xl bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <span className="font-semibold text-base">My Orders</span>
                        </Link>

                        <div className="mx-6 my-3 border-t border-gradient-to-r from-sky-200 via-emerald-200 to-orange-200"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full mx-3 px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-700 transition-all duration-300 group rounded-2xl"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center mr-4 transition-all duration-300 group-hover:scale-110">
                            <svg className="w-5 h-5 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <span className="font-semibold text-base">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : isHydrated ? (
              <>
                <Link href="/login" className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-primary-500/25 transform hover:scale-105">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-white font-semibold">Sign In</span>
                </Link>
              </>
            ) : (
              // Loading state during hydration
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}