// backend/routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
router.post("/create-order", async (req, res) => {
  const { amount, eventId } = req.body;

  if (!amount || !eventId) {
    return res.status(400).json({ error: "Amount and eventId are required" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,           // Razorpay needs paise (₹199 → 19900)
      currency: "INR",
      receipt: `event_${eventId}_${Date.now()}`,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,           // send paise back to frontend
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// POST /api/payment/verify
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Signature check — this prevents fake payment confirmations
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Payment is genuine!
    res.json({ success: true, paymentId: razorpay_payment_id });
  } else {
    res.status(400).json({ success: false, error: "Invalid payment signature" });
  }
});

module.exports = router;