import React from "react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <p>Qty: {item.quantity} × ${item.price}</p>
                    {item.selectedSize && (
                      <p className="text-gray-600">Size: {item.selectedSize}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold mb-2">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={clearCart}
              className="bg-gray-300 text-black rounded-xl px-4 py-2 mr-3"
            >
              Clear
            </button>
            <button
              className="bg-blue-600 text-white rounded-xl px-4 py-2"
              onClick={() => alert("Checkout coming soon...")}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
