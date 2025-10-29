import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { ChevronLeft, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverError, setServerError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShippingForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors = {};
    if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
    if (!formData.cardName) newErrors.cardName = 'Name on card is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!formData.cvv) newErrors.cvv = 'CVV is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitShipping = (e) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setCurrentStep('payment');
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!validatePaymentForm()) return;

    setIsProcessing(true);
    setServerError('');

    try {
      const token = localStorage.getItem('cloudscape_token');
      if (!token) {
        navigate('/login');
        return;
      }

     // --- FIX 1: Sanitize the cart items to match the Order.js schema ---
 const sanitizedItems = cart.map(item => ({
product: item._id, // Send only the product ID
 quantity: item.quantity,
price: item.price,
name: item.name,
selectedSize: item.selectedSize || undefined // Handle optional size
}));

// --- FIX 2: Create shippingAddress object *without* email ---
const shippingAddress = {
 firstName: formData.firstName,
 lastName: formData.lastName,
 // email: formData.email, // <-- REMOVED (Not in Order.js schema for shipping)
phone: formData.phone,
address: formData.address,
city: formData.city,
state: formData.state,
zipCode: formData.zipCode
};

 const orderData = {
 items: sanitizedItems, // <-- Use the new sanitized array
 shippingAddress: shippingAddress,
 totalAmount: total,
};

await axios.post(
 `${import.meta.env.VITE_API_URL}/api/orders/create-order`,
 orderData,
 { headers: { Authorization: `Bearer ${token}` } }
);

      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Order creation failed:', err);
      setServerError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  const renderInput = (label, name, type = 'text', colSpan = 'full') => (
    <div className={colSpan === 'half' ? '' : 'col-span-2'}>
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`w-full border ${errors[name] ? 'border-red-500' : 'border-gray-300'} p-3`}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <button
            onClick={() => currentStep === 'shipping' ? navigate('/cart') : setCurrentStep('shipping')}
            className="flex items-center text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {currentStep === 'shipping' ? 'Back to Cart' : 'Back to Shipping'}
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-2">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {currentStep === 'shipping' ? (
              <form onSubmit={handleSubmitShipping} className="space-y-6">
                <h2 className="text-xl font-light tracking-wider mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {renderInput('First Name', 'firstName', 'text', 'half')}
                  {renderInput('Last Name', 'lastName', 'text', 'half')}
                </div>

                {renderInput('Email', 'email', 'email')}
                {renderInput('Phone', 'phone', 'tel')}
                {renderInput('Address', 'address')}
                
                <div className="grid grid-cols-2 gap-4">
                  {renderInput('City', 'city', 'text', 'half')}
                  {renderInput('State', 'state', 'text', 'half')}
                </div>

                {renderInput('ZIP Code', 'zipCode')}

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitPayment} className="space-y-6">
                <h2 className="text-xl font-light tracking-wider mb-6">Payment Information</h2>

                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{serverError}</span>
                  </div>
                )}

                {renderInput('Card Number', 'cardNumber')}
                {renderInput('Name on Card', 'cardName')}
                
                <div className="grid grid-cols-2 gap-4">
                  {renderInput('Expiry Date (MM/YY)', 'expiryDate', 'text', 'half')}
                  {renderInput('CVV', 'cvv', 'text', 'half')}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {isProcessing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-24">
              <h2 className="text-xl font-light tracking-wider mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={item.id || item._id || index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium tracking-wide">Total</span>
                    <span className="font-medium text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;