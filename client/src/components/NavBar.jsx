import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Adjust path as needed
import logo from '../../public/logoLight.png'; // Adjust path as needed

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Check if we're on the dashboard/home page
  const isHomePage = location.pathname === '/' || location.pathname === '/dashboard';

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("cloudscape_user"));
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("cloudscape_token");
    localStorage.removeItem("cloudscape_user");
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Determine navbar style based on page and scroll
  const getNavbarStyle = () => {
    if (isHomePage) {
      // On home page: transparent when at top, solid when scrolled
      return scrolled 
        ? 'bg-black/80 backdrop-blur-md py-4' 
        : 'bg-transparent py-6';
    } else {
      // On other pages: always solid background
      return 'bg-black py-4';
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 text-white right-0 z-50 transition-all duration-500 ${getNavbarStyle()}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => handleNavigation('/')}
            className={`text-[25px] font-light tracking-[0.3em] transition-all duration-700 cursor-pointer hover:text-gray-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <img src={logo} alt="Cloudscape ÉLÉGANCE" className="h-8 inline-block mr-2" />
            CLOUDSCAPE  
          </div>
          
          {/* Desktop Navigation Links */}
          <div className={`hidden md:flex space-x-12 text-sm tracking-widest transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <button onClick={() => handleNavigation('/new')} className="hover:text-gray-300 transition-colors duration-300">NEW</button>
            <button onClick={() => handleNavigation('/women')} className="hover:text-gray-300 transition-colors duration-300">EXCLUSIVE</button>
            <button onClick={() => handleNavigation('/men')} className="hover:text-gray-300 transition-colors duration-300"></button>
            <button onClick={() => handleNavigation('/products')} className="hover:text-gray-300 transition-colors duration-300">COLLECTIONS</button>
          </div>
          
          {/* Desktop Icons */}
          <div className={`hidden md:flex items-center space-x-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <button 
              onClick={() => handleNavigation('/search')}
              className="hover:text-gray-300 transition-colors duration-300"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hover:text-gray-300 transition-colors duration-300"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>
              
              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 text-white bg-black border border-gray-800 shadow-2xl">
                  {user ? (
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button 
                        onClick={() => { handleNavigation('/profile'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-900 transition-colors duration-200"
                      >
                        My Profile
                      </button>
                      <button 
                        onClick={() => { handleNavigation('/orders'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-900 transition-colors duration-200"
                      >
                        My Orders
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-900 transition-colors duration-200 flex items-center gap-2 border-t border-gray-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <button 
                        onClick={() => { handleNavigation('/login'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-900 transition-colors duration-200"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => { handleNavigation('/register'); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-900 transition-colors duration-200"
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Cart Icon with Badge */}
            <button 
              onClick={() => handleNavigation('/cart')}
              className="relative hover:text-gray-300 transition-colors duration-300"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-gray-300 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black text-white z-40 md:hidden transition-transform duration-500 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-6">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-8 mb-12">
            <button 
              onClick={() => handleNavigation('/new')}
              className="text-2xl font-light tracking-widest hover:text-gray-300 transition-colors duration-300 text-left"
            >
              NEW
            </button>
            <button 
              onClick={() => handleNavigation('/women')}
              className="text-2xl font-light tracking-widest hover:text-gray-300 transition-colors duration-300 text-left"
            >
              Exclusive
            </button>
            <button 
              onClick={() => handleNavigation('/men')}
              className="text-2xl font-light tracking-widest hover:text-gray-300 transition-colors duration-300 text-left"
            >
              
            </button>
            <button 
              onClick={() => handleNavigation('/collections')}
              className="text-2xl font-light tracking-widest hover:text-gray-300 transition-colors duration-300 text-left"
            >
              COLLECTIONS
            </button>
          </div>

          {/* Mobile User Section */}
          <div className="border-t border-gray-800 pt-8 space-y-6">
            <button 
              onClick={() => handleNavigation('/search')}
              className="flex items-center gap-4 text-lg hover:text-gray-300 transition-colors duration-300"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
            
            <button 
              onClick={() => handleNavigation('/cart')}
              className="flex items-center gap-4 text-lg hover:text-gray-300 transition-colors duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </button>

            {user ? (
              <>
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="flex items-center gap-4 text-lg hover:text-gray-300 transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </button>
                <button 
                  onClick={() => handleNavigation('/orders')}
                  className="flex items-center gap-4 text-lg hover:text-gray-300 transition-colors duration-300"
                >
                  My Orders
                </button>
                <button 
                  onClick={logout}
                  className="flex items-center gap-4 text-lg hover:text-gray-300 transition-colors duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="flex items-center gap-4 text-lg hover:text-gray-300 transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </button>
                <button 
                  onClick={() => handleNavigation('/register')}
                  className="text-lg hover:text-gray-300 transition-colors duration-300 text-left"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-30 hidden md:block"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default NavBar;