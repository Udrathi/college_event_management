// src/services/paymentService.ts
// Handles API calls to your backend for payment

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export const createOrder = async (amount: number, eventId: string) => {
  const res = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, eventId }),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json(); // { orderId, amount }
};

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await fetch(`${BACKEND_URL}/api/payment/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentData),
  });
  if (!res.ok) throw new Error("Payment verification failed");
  return res.json(); // { success: true }
};