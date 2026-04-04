const razorpay = require("../config/razorpay");
const crypto = require("crypto");

/**
 * @desc    Create a new Razorpay order
 * @route   POST /api/payment/order
 * @access  Private
 */
const createOrder = async (req, res) => {
  console.log("Backend: createOrder called with body:", req.body);
  try {
    const { amount, currency = "INR", receipt = `receipt_${Date.now()}` } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise for INR)
      currency,
      receipt,
    };

    console.log("Backend: Creating Razorpay order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("Backend: Razorpay order created successfully:", order.id);

    if (!order) {
      console.error("Backend: Order creation returned null");
      return res.status(500).json({ success: false, message: "Failed to create order" });
    }

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Backend: Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payment/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const { itemTitle, amount } = req.body;

      // Find user and update purchases
      const user = await req.user; // req.user is already populated by protect middleware
      if (user) {
        const purchase = {
          item: itemTitle,
          amount: amount,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          date: new Date(),
        };

        user.purchases.push(purchase);
        await user.save();
        
        console.log(`Backend: Purchase of ${itemTitle} saved for user ${user.email}`);

        res.status(200).json({
          success: true,
          message: "Payment verified and purchase saved successfully",
          user: user, // Return updated user to frontend
        });
      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Signature Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicKey = async (req, res) => {
  const key = process.env.RAZORPAY_KEY_ID;
  console.log("Backend: getPublicKey called, returning key:", key ? key.substring(0, 10) + "..." : "UNDEFINED");
  res.status(200).json({ key: key || "YOUR_KEY_ID" });
};

module.exports = {
  createOrder,
  verifyPayment,
  getPublicKey,
};
