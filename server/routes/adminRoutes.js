import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check admin access
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Not authorized - admin access only" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Apply protect and adminOnly middleware to all routes
router.use(protect, adminOnly);

// ============================================
// USER ROUTES
// ============================================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Get user statistics
 * @access  Private/Admin
 */
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const recentUsers = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// ORDER ROUTES
// ============================================

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (status === 'delivered') {
      order.paymentStatus = 'completed';
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// ANALYTICS ROUTES
// ============================================

/**
 * @route   GET /api/admin/analytics/product-sales
 * @desc    Get product sales statistics
 * @access  Private/Admin
 */
router.get("/analytics/product-sales", async (req, res) => {
  try {
    const productSales = await Order.aggregate([
      // Only include completed orders
      {
        $match: { 
          status: { $in: ['processing', 'shipped', 'delivered'] } 
        }
      },
      // Unwind items array
      {
        $unwind: "$items"
      },
      // Group by product
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          totalUnitsSold: { $sum: "$items.quantity" },
          totalRevenue: { 
            $sum: { $multiply: ["$items.quantity", "$items.price"] } 
          }
        }
      },
      // Sort by revenue
      {
        $sort: { totalRevenue: -1 }
      },
      // Lookup product details
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      // Unwind product details
      {
        $unwind: { 
          path: "$productDetails", 
          preserveNullAndEmptyArrays: true 
        }
      },
      // Final projection
      {
        $project: {
          _id: 1,
          productName: { 
            $ifNull: ["$productName", "$productDetails.name"] 
          },
          totalUnitsSold: 1,
          totalRevenue: 1
        }
      }
    ]);

    res.json(productSales);
  } catch (err) {
    console.error("Aggregation Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;