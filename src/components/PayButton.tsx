// src/components/PayButton.tsx
// Drop this button into any event card or event detail page

import { useState } from "react";
import { toast } from "sonner"; // you already have sonner installed!
import { useRazorpay } from "@/hooks/useRazorpay";
import { createOrder, verifyPayment } from "@/services/paymentService";

interface PayButtonProps {
  eventId: string;
  eventTitle: string;
  price: number;           // in rupees e.g. 199
  studentName: string;
  studentEmail: string;
  onSuccess: () => void;   // callback — issue ticket, update state, etc.
}

export const PayButton = ({
  eventId,
  eventTitle,
  price,
  studentName,
  studentEmail,
  onSuccess,
}: PayButtonProps) => {
  const { loadScript } = useRazorpay();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Load Razorpay script
      const loaded = await loadScript();
      if (!loaded) {
        toast.error("Razorpay failed to load. Check your internet connection.");
        setLoading(false);
        return;
      }

      // 2. Create order on backend
      const { orderId, amount } = await createOrder(price, eventId);

      // 3. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,                        // in paise (backend sends this)
        currency: "INR",
        name: "Campus Eventful",
        description: `Registration: ${eventTitle}`,
        order_id: orderId,
        prefill: {
          name: studentName,
          email: studentEmail,
        },
        theme: { color: "#6366f1" },   // indigo — matches shadcn default
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled.");
            setLoading(false);
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify signature on backend
          const result = await verifyPayment(response);
          if (result.success) {
            toast.success("Payment successful! Your ticket has been issued 🎉");
            onSuccess(); // parent handles ticket issuance
          } else {
            toast.error("Payment verification failed. Contact support.");
          }
          setLoading(false);
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        toast.error(`Payment failed: ${resp.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 
                 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      {loading ? "Processing..." : `Pay ₹${price} & Register`}
    </button>
  );
};