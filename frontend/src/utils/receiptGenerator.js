export const generateReceiptHTML = (paymentDetails) => {
  const { item, amount, date, transactionId, customerName, customerEmail } = paymentDetails;
  
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 40px; background: #f8fafc; }
          .receipt-card { max-width: 800px; margin: 0 auto; background: white; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #e2e8f0; }
          .header { background: #0f172a; color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
          .logo span { color: #facc15; }
          .status { background: #10b981; color: white; padding: 6px 16px; border-radius: 50px; font-weight: 800; font-size: 14px; text-transform: uppercase; }
          .content { padding: 40px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 800; margin-bottom: 8px; letter-spacing: 1px; }
          .value { font-size: 16px; font-weight: 600; color: #0f172a; }
          .amount-row { background: #f1f5f9; padding: 24px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 40px; border: 1px dashed #cbd5e1; }
          .amount-label { font-size: 18px; font-weight: 800; color: #0f172a; }
          .amount-value { font-size: 32px; font-weight: 900; color: #4f46e5; }
          .footer { text-align: center; padding: 40px; border-top: 1px solid #f1f5f9; font-size: 14px; color: #94a3b8; }
          .btn-print { display: block; width: 200px; margin: 20px auto; padding: 12px; background: #4f46e5; color: white; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }
          @media print { .btn-print { display: none; } body { padding: 0; background: white; } .receipt-card { box-shadow: none; border: none; } }
        </style>
      </head>
      <body>
        <div class="receipt-card">
          <div class="header">
            <div class="logo">Career<span>Pilot</span></div>
            <div class="status">Paid</div>
          </div>
          <div class="content">
            <div style="margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900;">Payment Receipt</h1>
              <p style="margin: 8px 0 0; color: #64748b;">Transaction ID: ${transactionId}</p>
            </div>
            
            <div class="grid">
              <div>
                <div class="label">Billed To</div>
                <div class="value">${customerName}</div>
                <div class="value" style="font-weight: 400; color: #64748b;">${customerEmail}</div>
              </div>
              <div>
                <div class="label">Date of Issue</div>
                <div class="value">${date}</div>
              </div>
            </div>

            <div>
              <div class="label">Item Description</div>
              <div class="value" style="font-size: 20px;">${item}</div>
              <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Full access to professional assessment and career resources.</p>
            </div>

            <div class="amount-row">
              <span class="amount-label">Amount Paid</span>
              <span class="amount-value">${amount}</span>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2026 CareerPilot. All rights reserved.</p>
            <p>This is a computer-generated receipt and requires no signature.</p>
            <a href="javascript:window.print()" class="btn-print">Print or Save as PDF</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const downloadReceipt = (htmlContent, fileName = "CareerPilot_Receipt.html") => {
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
