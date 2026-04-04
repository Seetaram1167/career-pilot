import React from "react";
import { X, FileText, Download, Calendar, IndianRupee, Package } from "lucide-react";
import { generateReceiptHTML, downloadReceipt } from "../utils/receiptGenerator";
import { syncUserProfile } from "../utils/authUtils";

const TransactionsModal = ({ isOpen, onClose, user: initialUser }) => {
  const [currentUser, setCurrentUser] = React.useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : initialUser;
  });

  React.useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('user');
      if (stored) setCurrentUser(JSON.parse(stored));
      syncUserProfile(); // Sync when modal opens
    }
  }, [isOpen]);

  React.useEffect(() => {
    // Sync with localStorage on changes from other components/tabs
    const handleStorage = () => {
      const stored = JSON.parse(localStorage.getItem('user') || "{}");
      setCurrentUser(stored);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!isOpen) return null;

  const rawPurchases = currentUser?.purchases || [];
  
  // Deduplicate by item name to handle cases where same course was saved twice
  const purchases = [];
  const seenItems = new Set();
  
  // Process from newest to oldest to keep the most recent transaction
  [...rawPurchases].reverse().forEach(p => {
    if (!seenItems.has(p.item)) {
      seenItems.add(p.item);
      purchases.push(p);
    }
  });

  // Since we already reversed and kept first unique, no need to reverse again for display
  // But wait, the original code reversed at render. Let's keep the logic clean.
  // The 'purchases' array now contains unique items from newest to oldest.
  
  const handleDownload = (purchase) => {
    const html = generateReceiptHTML({
      item: purchase.item,
      amount: purchase.amount,
      date: purchase.date,
      transactionId: purchase.paymentId,
      customerName: currentUser?.name || "Valued Customer",
      customerEmail: currentUser?.email || "N/A"
    });
    
    // Open in new tab for viewing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  const modalStyles = `
    .transactions-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(8, 20, 48, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease;
    }
    .transactions-content {
      background: linear-gradient(135deg, rgba(8, 20, 48, 0.95), rgba(15, 23, 42, 0.9));
      backdrop-filter: blur(20px);
      width: 90%;
      max-width: 600px;
      padding: 32px;
      border-radius: 28px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
      position: relative;
      max-height: 80vh;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 16px;
    }
    .transactions-header h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
    }
    .close-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #ffffff;
      transition: all 0.2s;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }
    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .transaction-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    }
    .transaction-card:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateX(8px) scale(1.02);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    .transaction-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .transaction-item {
      font-weight: 800;
      color: #ffffff;
      font-size: 1.1rem;
    }
    .transaction-meta {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .download-btn {
      background: #ffffff;
      color: #0f172a;
      border: none;
      border-radius: 12px;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s;
    }
    .download-btn:hover {
      background: var(--vibrant-blue);
      color: #ffffff;
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(41, 121, 255, 0.3);
    }
    .empty-state {
      text-align: center;
      padding: 40px 0;
    }
    .empty-state p {
      color: #64748b;
      margin-top: 12px;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;

  return (
    <div className="transactions-overlay" onClick={onClose}>
      <style>{modalStyles}</style>
      <div className="transactions-content" onClick={(e) => e.stopPropagation()}>
        <div className="transactions-header">
          <h2>Your Transactions</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="transactions-list">
          {purchases.length > 0 ? (
            purchases.map((purchase, index) => (
              <div key={index} className="transaction-card" onClick={() => handleDownload(purchase)}>
                <div className="transaction-info">
                  <div className="transaction-item">{purchase.item}</div>
                  <div className="transaction-meta">
                    <div className="meta-item"><Calendar size={14} /> {purchase.date}</div>
                    <div className="meta-item"><IndianRupee size={14} /> {purchase.amount}</div>
                  </div>
                </div>
                <button 
                  className="download-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const html = generateReceiptHTML({
                      item: purchase.item,
                      amount: purchase.amount,
                      date: purchase.date,
                      transactionId: purchase.paymentId,
                      customerName: currentUser?.name || "Valued Customer",
                      customerEmail: currentUser?.email || "N/A"
                    });
                    downloadReceipt(html, `Receipt_${purchase.paymentId}.html`);
                  }}
                >
                  <Download size={18} /> Receipt
                </button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Package size={48} color="#cbd5e1" style={{ margin: '0 auto' }} />
              <p>No transactions found. <br/>When you purchase a service, it will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;
