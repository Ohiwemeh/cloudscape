import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSizeError, setShowSizeError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        // Fetch the main product
        const productRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(productRes.data);
        setSelectedSize(productRes.data.sizes?.[0] || null);

        // Fetch related products from the same category
        const relatedRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?category=${productRes.data.category}`);
        // Filter out the current product and limit to 4 related products
        const filtered = relatedRes.data
          .filter(item => item._id !== id)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      setShowSizeError(true);
      setTimeout(() => setShowSizeError(false), 3000);
      return;
    }
    
    setIsAdding(true);
    addToCart({ ...product, selectedSize });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-sm tracking-widest text-gray-500 font-medium">PRODUCT NOT FOUND</h2>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Main Product Section */}
      <div className="max-w-7xl mt-4 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="relative bg-gray-100">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm tracking-widest text-gray-500 font-medium">OUT OF STOCK</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-3">
              <p className="text-xs tracking-widest text-gray-500 uppercase">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-medium tracking-wide text-black">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-black">
                ₦{product.price.toFixed(2)}
              </p>
            </div>

            {product.description && (
              <div className="border-t border-gray-200 pt-8">
                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs tracking-widest text-gray-500 uppercase">Select Size</p>
                  {showSizeError && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Please select a size
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowSizeError(false);
                      }}
                      className={`px-6 py-3 text-xs tracking-wider border transition-all duration-300 ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="border-t border-gray-200 pt-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className={`w-full border border-black text-black py-4 text-xs tracking-widest font-medium transition-all duration-300 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black flex items-center justify-center gap-2 ${
                  isAdding ? 'bg-black text-white' : ''
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {!product.inStock ? 'OUT OF STOCK' : isAdding ? 'ADDED TO CART' : 'ADD TO CART'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <h2 className="text-xs tracking-widest text-gray-500 uppercase mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;