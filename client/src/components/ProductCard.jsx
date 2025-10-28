import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, AlertCircle } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (product.sizes && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 3000);
      return;
    }
    
    setIsAdding(true);
    addToCart({ ...product, selectedSize });
    
    // Brief animation delay
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <div className="group relative bg-white">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-gray-100 mb-4">
        <div className="aspect-[3/4] relative">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm tracking-widest text-gray-500 font-medium">OUT OF STOCK</p>
              </div>
            </div>
          )}

          {/* Quick Add Overlay (appears on hover) */}
          {product.inStock && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  disabled={isAdding}
                  className="bg-white text-black px-6 py-3 text-xs tracking-widest font-medium hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  QUICK ADD
                </button>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="text-sm tracking-wide font-medium text-black group-hover:text-gray-600 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs tracking-wider text-gray-500 uppercase">
          {product.category}
        </p>
        
        <p className="text-sm font-medium text-black">
          ${product.price.toFixed(2)}
        </p>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs tracking-wider text-gray-500 uppercase">Size</p>
              {showSizeError && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Select size
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setShowSizeError(false);
                  }}
                  className={`px-3 py-1.5 text-xs tracking-wider border transition-all duration-300 ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button (mobile/always visible) */}
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`mt-4 w-full border border-black text-black py-3 text-xs tracking-widest font-medium transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isAdding ? 'bg-black text-white' : ''
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isAdding ? 'ADDED' : 'ADD TO CART'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;