import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ShoppingBag, User, Search } from 'lucide-react';

const Dashboard = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
     

      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070')`,
              filter: 'brightness(0.85)'
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-6">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-sm tracking-[0.3em] mb-6 text-gray-300">SPRING/SUMMER 2025</p>
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-6 leading-tight">
              Explore Our<br />
              <span className="font-extralight italic">New Collection</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light">
              Timeless elegance meets contemporary design
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative px-10 py-4 bg-white text-black overflow-hidden transition-all duration-500 hover:scale-105">
                <span className="relative z-10 text-sm tracking-widest font-medium">SHOP NOW</span>
                <div className="absolute inset-0 bg-gray-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-sm tracking-widest font-medium z-20">SHOP NOW</span>
              </button>
              
              <button
                onClick={() => navigate('/lookbook')}
                aria-label="Open Lookbook"
                className="group px-10 py-4 border border-white text-white hover:bg-white hover:text-black transition-all duration-500 hover:scale-105"
              >
                <span className="text-sm tracking-widest font-medium">LOOKBOOK</span>
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-xs tracking-widest mb-2">SCROLL</span>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="relative bg-white text-black py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group cursor-pointer">
              <div className="overflow-hidden mb-6 bg-gray-100 aspect-[3/4]">
                <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-700 bg-gray-200"></div>
              </div>
              <h3 className="text-xl tracking-wider mb-2">ESSENTIALS</h3>
              <p className="text-gray-600 text-sm">Curated basics for every wardrobe</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="overflow-hidden mb-6 bg-gray-100 aspect-[3/4]">
                <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-700 bg-gray-200"></div>
              </div>
              <h3 className="text-xl tracking-wider mb-2">STATEMENT PIECES</h3>
              <p className="text-gray-600 text-sm">Bold designs that stand out</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="overflow-hidden mb-6 bg-gray-100 aspect-[3/4]">
                <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-700 bg-gray-200"></div>
              </div>
              <h3 className="text-xl tracking-wider mb-2">ACCESSORIES</h3>
              <p className="text-gray-600 text-sm">Complete your look</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-black py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-light tracking-wider mb-6">Join Our Community</h2>
          <p className="text-gray-400 mb-8">Subscribe to receive exclusive updates and early access</p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address"
              className="flex-1 px-6 py-4 bg-transparent border border-gray-700 focus:border-white transition-colors duration-300 outline-none text-sm tracking-wider"
            />
            <button className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-colors duration-300 text-sm tracking-widest font-medium">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black border-t border-gray-900 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-light tracking-[0.3em] mb-6">ÉLÉGANCE</div>
          <div className="flex justify-center space-x-8 text-sm text-gray-500 tracking-wider">
            <a href="#" className="hover:text-white transition-colors duration-300">CONTACT</a>
            <a href="#" className="hover:text-white transition-colors duration-300">CAREERS</a>
            <a href="#" className="hover:text-white transition-colors duration-300">PRIVACY</a>
          </div>
          <p className="text-gray-600 text-xs mt-8 tracking-wider">© 2025 ÉLÉGANCE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;