import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Package, Calendar, Clock, Filter } from 'lucide-react';
import axios from 'axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, processing, shipped, delivered
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cloudscape_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('cloudscape_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure orders is always an array
      const ordersData = Array.isArray(response.data) ? response.data : [];
      setOrders(ordersData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Make sure orders is an array before filtering
  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  }) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-12"></div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-2">
            My Orders
          </h1>
          <p className="text-gray-600 text-sm tracking-wide">
            View and track your orders
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                  filter === status
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-light tracking-wide text-gray-400 mb-4">
              No Orders Found
            </h2>
            <p className="text-gray-500 text-sm mb-8 tracking-wide">
              You haven't placed any orders yet
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-all duration-300 text-sm tracking-widest"
            >
              START SHOPPING
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Order Items */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100">
                              <img
                                src={item.product?.images?.[0] || '/placeholder.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                                {item.selectedSize && ` | Size: ${item.selectedSize}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <div className="flex items-start gap-2 text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mt-0.5" />
                        <div>
                          <p className="text-sm">Ordered on</p>
                          <p className="text-sm font-medium text-black">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-gray-500">
                        <Clock className="w-4 h-4 mt-0.5" />
                        <div>
                          <p className="text-sm">Time</p>
                          <p className="text-sm font-medium text-black">
                            {formatTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="text-xl font-medium">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;