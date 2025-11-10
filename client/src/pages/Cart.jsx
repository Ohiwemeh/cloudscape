import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 1500) : 0;
  const total = subtotal + shipping;

  const handleRemove = async (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-sm tracking-wide">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-light tracking-wide text-gray-400 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 text-sm mb-8 tracking-wide">
                Discover our collection and add items to your cart
              </p>
              <button
                onClick={() => navigate('/products')}
                className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-all duration-300 text-sm tracking-widest"
              >
                CONTINUE SHOPPING
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className={`flex gap-6 pb-6 border-b border-gray-200 transition-all duration-300 ${
                    removingId === item._id ? 'opacity-0 translate-x-4' : 'opacity-100'
                  }`}
                >
                  {/* Product Image */}
                  <div 
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="w-32 h-32 flex-shrink-0 bg-gray-100 cursor-pointer overflow-hidden group"
                  >
                    <img
                      src={item.images?.[0] || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 
                        onClick={() => navigate(`/product/${item._id}`)}
                        className="font-medium text-lg tracking-wide mb-1 cursor-pointer hover:text-gray-600 transition-colors duration-300"
                      >
                        {item.name}
                      </h3>
                      <p className="text-xs tracking-wider text-gray-500 uppercase mb-2">
                        {item.category}
                      </p>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">
                          Size: <span className="font-medium">{item.selectedSize}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateQuantity && updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity && updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ₦{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-500">
                            ₦{item.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-gray-400 hover:text-black transition-colors duration-300 self-start"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="text-sm text-gray-600 hover:text-black transition-colors duration-300 tracking-wide underline"
              >
                Clear entire cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-300 p-6 sticky top-24">
                <h2 className="text-xl font-light tracking-wider mb-6 uppercase">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₦{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `₦${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 50000 && (
                    <p className="text-xs text-gray-500 italic">
                      Free shipping on orders over ₦50,000
                    </p>
                  )}
                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium tracking-wide">Total</span>
                      <span className="font-medium text-lg">₦{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors duration-300 text-sm tracking-widest font-medium mb-4"
                >
                  PROCEED TO CHECKOUT
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full border border-gray-300 text-black py-4 hover:border-black transition-colors duration-300 text-sm tracking-widest"
                >
                  CONTINUE SHOPPING
                </button>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart