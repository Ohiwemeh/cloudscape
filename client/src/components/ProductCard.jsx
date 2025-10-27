import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart({ ...product, selectedSize });
  };

  return (
    <div className="group border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 bg-white relative">
      <Link to={`/product/${product._id}`} className="block mb-2">
        <div className="relative overflow-hidden rounded-xl mb-3">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h2 className="font-semibold text-lg">{product.name}</h2>
      </Link>
      <p className="text-gray-600 text-sm">{product.category}</p>
      <p className="mt-2 font-bold text-blue-600">${product.price}</p>

      {product.sizes && (
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-1">Size:</p>
          <div className="flex flex-wrap gap-1.5 max-h-[64px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2.5 py-1 text-sm rounded-md border min-w-[36px] flex-shrink-0 font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm"
                    : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        className="mt-3 bg-blue-600 text-white rounded-xl px-4 py-2 w-full hover:bg-blue-700 transition-colors relative overflow-hidden group-hover:shadow-md"
      >
        Add to Cart
      </button>

      {!product.inStock && (
        <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded-2xl">
          <p className="text-gray-500 font-medium">Out of Stock</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
