import React, { useState, useEffect } from "react";
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  Lock,
  Play,
  FileText,
  Calendar,
  ChevronRight,
  Award,
  Trophy
} from "lucide-react";
import axios from "axios";
import { generateReceiptHTML, downloadReceipt } from "../utils/receiptGenerator";

const PaymentModal = ({ isOpen, onClose, onItemSelect, amount, itemTitle }) => {
  const [step, setStep] = useState("selection"); // selection, processing, success
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiOption, setUpiOption] = useState(null); // 'qr' or 'id'
  const [lastPayment, setLastPayment] = useState(null);
  
  // Card Form States
  const [cardData, setCardData] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: ""
  });

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState(null);
  const [bankCredentials, setBankCredentials] = useState({ userId: "", password: "" });

  const banks = [
    { id: 'sbi', name: 'State Bank of India', icon: '🏛️' },
    { id: 'hdfc', name: 'HDFC Bank', icon: '🏦' },
    { id: 'icici', name: 'ICICI Bank', icon: '💎' },
    { id: 'axis', name: 'Axis Bank', icon: '🛡️' },
    { id: 'kotak', name: 'Kotak Mahindra', icon: '🦁' },
  ];

  // Preload audio for instant playback
  const [successAudio] = useState(new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3"));

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (isOpen) {
      successAudio.load();
    }
    if (!isOpen) {
      setStep("selection");
      setSelectedMethod(null);
      setUpiOption(null);
    }
  }, [isOpen, successAudio]);

  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        setShowDashboard(true);
      }, 2000); // Wait 2 seconds instead of 5
      return () => clearTimeout(timer);
    }
  }, [step]);


  if (!isOpen) return null;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setStep("processing");

    try {
      console.log("Loading Razorpay Script...");
      const res = await loadRazorpayScript();

      if (!res) {
        console.error("Razorpay SDK failed to load");
        alert("Razorpay SDK failed to load. Are you online?");
        setStep("selection");
        return;
      }

      // 0. Get Public Key from Backend
      console.log("Fetching Public Key from backend...");
      const { data: keyData } = await axios.get("/api/payment/key");
      console.log("Key received:", keyData.key ? "Yes" : "No");

      // 1. Create Order in Backend
      console.log("Creating Razorpay Order...");
      const numericAmount = parseFloat(String(amount).replace(/[^0-9.]/g, ''));
      const { data } = await axios.post("/api/payment/order", {
        amount: numericAmount,
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      console.log("Order created:", data.success ? "Success" : "Failed");

      if (!data.success) {
        console.error("Order Creation Error:", data.message);
        alert("Failed to create order. Please try again.");
        setStep("selection");
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: keyData.key, 
        amount: data.amount,
        currency: data.currency,
        name: "CareerPilot",
        description: `Payment for ${itemTitle}`,
        image: "https://your-logo-url.com", // Replace with actual logo if available
        order_id: data.order_id,
        handler: async (response) => {
          console.log("Payment successful, verifying signature...");
          setStep("processing"); // Ensure we show processing during verification
          try {
            const verifyRes = await axios.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              itemTitle: itemTitle,
              amount: amount,
            }, {
              headers: {
                Authorization: `Bearer ${user?.token}`
              }
            });

            if (verifyRes.data.success) {
              console.log("Signature verified and purchase saved!");
              
              const updatedUser = verifyRes.data.user || {
                ...user,
                purchases: [...(user.purchases || []), {
                  item: itemTitle,
                  amount: amount,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  date: new Date()
                }]
              };

              // Ensure token is preserved if backend didn't return it
              if (!updatedUser.token && user?.token) {
                updatedUser.token = user.token;
              }

              localStorage.setItem("user", JSON.stringify(updatedUser));
              setUser(updatedUser);
              
              const paymentDetails = {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: amount,
                item: itemTitle,
                date: new Date().toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              };
              setLastPayment(paymentDetails);

              // Dispatch event for other components to update
              window.dispatchEvent(new Event('storage'));

              setStep("success");
              successAudio.volume = 0.5;
              successAudio.play().catch(err => console.log("Audio blocked", err));
              
              if (onItemSelect) {
                onItemSelect();
              }
            } else {
              console.error("Verification failed:", verifyRes.data.message);
              alert("Payment verification failed.");
              setStep("selection");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            alert("An error occurred during verification.");
            setStep("selection");
          }
        },
        prefill: {
          name: user?.name || "Guest User",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      // If user closes the popup without paying
      paymentObject.on('payment.failed', function (response){
          console.log("Payment Failed:", response.error.description);
          setStep("selection");
      });

    } catch (error) {
      console.error("Payment Error:", error);
      alert(`Payment Error: ${error.message}\n\nTechnical details: ${error.response?.data?.message || 'Check if backend is running at '}`);
      setStep("selection");
    }
  };

  const isFormValid = () => {
    if (selectedMethod === 'card') {
      return cardData.name && cardData.number.replace(/\s/g, '').length >= 16 && cardData.expiry && cardData.cvv.length >= 3;
    }
    if (selectedMethod === 'net') {
      return !!selectedBank && bankCredentials.userId && bankCredentials.password;
    }
    return !!selectedMethod;
  };

  const handleDownloadReceipt = () => {
    if (!lastPayment) return;

    const receiptHtml = generateReceiptHTML({
      item: lastPayment.item,
      amount: lastPayment.amount,
      date: lastPayment.date,
      transactionId: lastPayment.paymentId,
      customerName: user?.name || "Valued Customer",
      customerEmail: user?.email || "N/A"
    });

    downloadReceipt(receiptHtml, `Receipt_${lastPayment.paymentId}.html`);
  };

  const getMaskedCardNumber = () => {
    if (!cardData.number) return "4214 5xxxx xxxx xxxx"; // Professional default with 5 numbers
    const clean = cardData.number.replace(/\s/g, '');
    let res = "";
    for (let i = 0; i < 16; i++) {
      if (i < 5) res += clean[i] || "0";
      else res += "x";
      if ((i + 1) % 4 === 0 && i < 15) res += " ";
    }
    return res;
  };

  const paymentStyles = `
    .payment-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      animation: fadeIn 0.3s ease;
      padding: 20px;
    }

    .payment-content {
      background: var(--white);
      width: 100%;
      max-width: 480px;
      min-height: 520px;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.4);
      position: relative;
      animation: modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      flex-direction: column;
    }

    .payment-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(15, 23, 42, 0.1);
      border: none;
      color: var(--deep-navy);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      z-index: 100;
    }

    .payment-close-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      transform: rotate(90deg);
    }

    .payment-header {
      padding: 40px 32px 32px;
      background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
      color: white;
      text-align: center;
    }

    .payment-item-title {
      font-size: 0.95rem;
      opacity: 0.85;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .payment-amount {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .payment-body {
      padding: 32px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .payment-methods {
      display: grid;
      gap: 16px;
    }

    .payment-method-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px;
      border: 2px solid var(--border-color);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .payment-method-card:hover {
      border-color: var(--vibrant-blue);
      background: rgba(79, 70, 229, 0.04);
      transform: translateY(-2px);
    }

    .payment-method-card.selected {
      border-color: var(--vibrant-blue);
      background: rgba(79, 70, 229, 0.08);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
    }

    .upi-details-area {
      margin-top: 16px;
      padding: 20px;
      background: var(--soft-grey);
      border-radius: 20px;
      animation: slideDown 0.3s ease;
    }

    .upi-options-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    .upi-tab {
      flex: 1;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      background: white;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }

    .upi-tab.active {
      background: var(--vibrant-blue);
      color: white;
      border-color: var(--vibrant-blue);
    }

    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .qr-mock {
      width: 180px;
      height: 180px;
      background: white;
      padding: 10px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .qr-inner {
      width: 100%;
      height: 100%;
      background: #000;
      mask-image: url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CareerPilot-Payment');
      background-size: contain;
    }

    .qr-price-tag {
      font-weight: 700;
      color: var(--deep-navy);
      font-size: 1.1rem;
    }

    .upi-id-input-area {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .upi-id-input-area input {
      width: 100%;
      padding: 14px;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-family: inherit;
      outline: none;
    }

    .upi-id-input-area input:focus {
      border-color: var(--vibrant-blue);
    }

    .payment-method-icon {
      width: 52px;
      height: 52px;
      background: var(--soft-grey);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vibrant-blue);
    }

    .pay-now-btn {
      width: 100%;
      padding: 18px;
      background: var(--vibrant-blue);
      color: white;
      border: none;
      border-radius: 18px;
      font-weight: 700;
      font-size: 1.15rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s;
      margin-top: 24px;
    }

    .pay-now-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pay-now-btn:hover:not(:disabled) {
      background: #4338ca;
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4);
    }

    /* Futuristic Card Design */
    .card-preview-container {
      margin-top: 20px;
      perspective: 1000px;
      animation: slideDown 0.4s ease-out;
    }

    .futuristic-card {
      width: 100%;
      height: 200px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 20px;
      position: relative;
      padding: 24px;
      color: white;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
    }

    .futuristic-card::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(34, 211, 238, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .card-chip {
      width: 45px;
      height: 35px;
      background: linear-gradient(135deg, #fcd34d 0%, #b45309 100%);
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .card-number-display {
      font-family: 'Courier New', Courier, monospace;
      font-size: 1.4rem;
      letter-spacing: 3px;
      margin-bottom: 24px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }

    .card-bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .card-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      opacity: 0.6;
      margin-bottom: 4px;
    }

    .card-value {
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 1px;
    }

    /* Card Details Form */
    .card-form-area {
      margin-top: 24px;
      background: white;
      padding: 24px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-secondary);
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .form-input {
      width: 100%;
      padding: 12px 0;
      border: none;
      border-bottom: 2px solid var(--border-color);
      font-family: inherit;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
    }

    .form-input:focus {
      border-color: var(--vibrant-blue);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .save-details-checkbox {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-top: 16px;
      cursor: pointer;
    }

    .save-details-checkbox input {
      width: 18px;
      height: 18px;
      accent-color: var(--vibrant-blue);
    }

    .bank-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
      animation: slideDown 0.3s ease;
    }

    .bank-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
      font-size: 0.9rem;
      background: white;
    }

    .bank-option:hover {
      border-color: var(--vibrant-blue);
      background: rgba(79, 70, 229, 0.04);
    }

    .bank-option.selected {
      border-color: var(--vibrant-blue);
      background: rgba(79, 70, 229, 0.08);
      color: var(--vibrant-blue);
    }

    .bank-icon {
      font-size: 1.2rem;
    }

    .payment-security {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 20px;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalSlideUp {
      from { opacity: 0; transform: translateY(50px) scale(0.9); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Success Celebration CSS */
    .success-state {
      padding: 60px 32px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      background: linear-gradient(135deg, rgba(8, 20, 48, 0.95), rgba(15, 23, 42, 0.9));
      backdrop-filter: blur(20px);
      flex: 1;
      height: 100%;
      border-radius: 28px;
    }

    .success-icon-wrapper {
      position: relative;
      margin-bottom: 24px;
      z-index: 2;
    }

    .success-icon-svg {
      color: #10b981;
      filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.5));
      animation: successPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .success-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      z-index: -1;
      animation: glowPulse 2s infinite ease-in-out;
    }

    .success-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: #ffffff !important; 
      margin-bottom: 12px;
      letter-spacing: -1px;
      position: relative;
      z-index: 5;
      animation: fadeInUp 0.5s ease 0.1s both;
    }

    .success-message {
      color: rgba(255, 255, 255, 0.7) !important;
      font-size: 1.1rem;
      line-height: 1.5;
      margin-bottom: 32px;
      position: relative;
      z-index: 5;
      animation: fadeInUp 0.5s ease 0.2s both;
    }

    .redirect-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      background: rgba(79, 70, 229, 0.08);
      color: var(--vibrant-blue);
      border-radius: 100px;
      font-size: 0.95rem;
      font-weight: 600;
      animation: fadeInUp 0.5s ease 0.3s both;
    }

    /* Processing State */
    .processing-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .processing-loader {
      color: var(--vibrant-blue);
      animation: spin 1s linear infinite;
      margin-bottom: 24px;
    }

    @keyframes successPop {
      0% { transform: scale(0.5); opacity: 0; }
      80% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }

    .success-wave {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%);
      z-index: 1;
      animation: waveExpand 2s infinite ease-out;
    }

    @keyframes waveExpand {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
      50% { opacity: 0.5; }
      100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }

    @keyframes glowPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
      50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.6; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    .spin-slow { animation: spin 4s linear infinite; }

    /* Action Cards Styling */
    .success-dashboard {
      padding: 32px 24px;
      text-align: left;
      animation: fadeIn 0.5s ease;
    }
    .success-dashboard h3 {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 24px;
      letter-spacing: -0.5px;
    }
    .action-cards-grid {
      display: grid;
      gap: 16px;
      margin-bottom: 32px;
    }
    .action-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      text-decoration: none;
    }
    .action-card:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateX(10px) scale(1.02);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
    .action-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .action-info h4 {
      margin: 0;
      color: #ffffff;
      font-size: 1rem;
      font-weight: 700;
    }
    .action-info p {
      margin: 4px 0 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
    }
    .action-arrow {
      margin-left: auto;
      color: rgba(255, 255, 255, 0.4);
    }
    .action-card:hover .action-arrow {
      color: #ffffff;
      transform: translateX(4px);
    }
    .final-dashboard-btn {
      width: 100%;
      padding: 18px;
      background: #ffffff;
      color: #0f172a;
      border: none;
      border-radius: 18px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      margin-top: 10px;
    }
    .final-dashboard-btn:hover {
      background: var(--vibrant-blue);
      color: white;
      transform: translateY(-4px);
      box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4);
    }
  `;

  return (
    <div className="payment-overlay">
      <style>{paymentStyles}</style>
      <div className="payment-content">
        <button className="payment-close-btn" onClick={onClose} aria-label="Cancel Payment">
          <X size={20} />
        </button>

        {step === "selection" && (
          <>
            <div className="payment-header">
              <div className="payment-item-title">{itemTitle}</div>
              <div className="payment-amount">{amount}</div>
            </div>

            <div className="payment-body">
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ 
                  background: 'rgba(79, 70, 229, 0.05)', 
                  padding: '24px', 
                  borderRadius: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(79, 70, 229, 0.1)'
                }}>
                  <ShieldCheck size={48} color="#4f46e5" style={{ marginBottom: '16px', marginLeft: 'auto', marginRight: 'auto' }} />
                  <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '8px', fontWeight: 700 }}>Secure Checkout</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Payments are securely processed via Razorpay. <br/>
                    We support UPI, All Cards, & Netbanking.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px', opacity: 0.5, color: '#1e293b' }}>
                   <CreditCard size={28} />
                   <Smartphone size={28} />
                   <Building2 size={28} />
                   <Lock size={28} />
                </div>

                <button 
                  className="pay-now-btn" 
                  onClick={handlePayment}
                >
                  Pay Now {amount} <ChevronRight size={20} />
                </button>

                <div className="payment-security" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
                  <ShieldCheck size={14} />
                  <span>100% Secure • SSL Encrypted</span>
                </div>
              </div>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="processing-state">
            <Loader2 className="processing-loader" size={80} />
            <h2 style={{ fontSize: '1.75rem', color: 'var(--deep-navy)', marginBottom: '12px', fontWeight: 800 }}>Initiating Secure Payment</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Please wait while we connect to Razorpay...</p>
          </div>
        )}

        {step === "success" && (
          <div className="success-state" style={{ padding: showDashboard ? '0' : '60px 32px' }}>
            {!showDashboard ? (
              <>
                <div className="success-wave"></div>
                <div className="success-icon-wrapper">
                  <CheckCircle2 className="success-icon-svg" size={130} />
                  <div className="success-glow"></div>
                </div>
                <h2 className="success-title">Successfully Payment Complete!</h2>
                <p className="success-message">Your career journey has been officially unlocked. You're ready to go!</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', marginBottom: '24px' }}>
                  <button 
                    onClick={handleDownloadReceipt}
                    style={{ 
                      fontSize: '0.95rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '10px', 
                      color: '#ffffff', 
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      padding: '14px 28px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      width: 'auto',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <FileText size={20} /> Download Payment Bill
                  </button>

                  <div className="redirect-badge">
                    <Loader2 size={18} className="spin-slow" />
                    <span>Preparing your roadmap...</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="success-dashboard">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ background: '#10b981', width: '12px', height: '12px', borderRadius: '50%' }}></div>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Payment Confirmed</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <h3>Your Personalized Roadmap</h3>
                </div>
                
                <div className="action-cards-grid">
                  {/* Dynamic Primary Card */}
                  {itemTitle && (itemTitle.includes("Counsellor") || itemTitle.includes("Guiding") || itemTitle.includes("Abroad") || itemTitle.includes("Branding")) ? (
                    <div className="action-card" onClick={() => {
                      let courseId = 1;
                      if (itemTitle.includes("Guiding")) courseId = 2;
                      if (itemTitle.includes("Abroad")) courseId = 3;
                      if (itemTitle.includes("Branding")) courseId = 4;
                      window.location.href = `/course/${courseId}`;
                    }}>
                      <div className="action-icon-box" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                        <Award size={24} />
                      </div>
                      <div className="action-info">
                        <h4>Start Your Certification</h4>
                        <p>Access your 8-course bundle & modules.</p>
                      </div>
                      <ChevronRight className="action-arrow" size={20} />
                    </div>
                  ) : (
                    <div className="action-card" onClick={() => window.location.href = '/quiz'}>
                      <div className="action-icon-box" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d2' }}>
                        <FileText size={24} />
                      </div>
                      <div className="action-info">
                        <h4>Start Career Assessment</h4>
                        <p>Discover your strengths and stream fit.</p>
                      </div>
                      <ChevronRight className="action-arrow" size={20} />
                    </div>
                  )}

                  {/* Booking Card */}
                  <div className="action-card" onClick={() => window.location.href = '/bookings'}>
                    <div className="action-icon-box" style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                      <Calendar size={24} />
                    </div>
                    <div className="action-info">
                      <h4>Schedule 1-on-1 Session</h4>
                      <p>Book a time with your dedicated mentor.</p>
                    </div>
                    <ChevronRight className="action-arrow" size={20} />
                  </div>

                  {/* Motivational Video Card */}
                  <div className="action-card" onClick={() => window.open('https://www.youtube.com/results?search_query=career+motivation+for+students', '_blank')}>
                    <div className="action-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                      <Play size={24} />
                    </div>
                    <div className="action-info">
                      <h4>Get Inspired</h4>
                      <p>Watch how others found their perfect career.</p>
                    </div>
                    <ChevronRight className="action-arrow" size={20} />
                  </div>
                </div>

                <button className="final-dashboard-btn" onClick={() => window.location.href = '/dashboard'}>
                  Go to Main Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default PaymentModal;
