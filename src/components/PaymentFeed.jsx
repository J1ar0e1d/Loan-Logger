import { useState } from "react";
import { motion } from "motion/react";

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

const PaymentFeed = ({ payments = [], clientName }) => {
  const orderedPayments = [...payments].reverse();
  const [receiptPaymentId, setReceiptPaymentId] = useState(null);

  return (
    <section className="payment-feed" aria-labelledby="payment-history-title">
      <div className="feed-heading">
        <h4 id="payment-history-title">Payment history</h4>
        <span>{payments.length}</span>
      </div>
      {orderedPayments.length === 0 ? (
        <p className="feed-empty">No payments recorded yet.</p>
      ) : (
        <ul className="payment-list">
          {orderedPayments.map((payment, index) => (
            <motion.li
              key={payment.id}
              className="payment-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
            >
              <span>{new Date(payment.date).toLocaleDateString()}</span>
              <div className="payment-item-actions">
                <strong>{formatCurrency(payment.amount)}</strong>
                <button
                  type="button"
                  className="receipt-toggle payment-receipt-toggle"
                  onClick={() =>
                    setReceiptPaymentId((current) =>
                      current === payment.id ? null : payment.id,
                    )
                  }
                >
                  {receiptPaymentId === payment.id ? "Hide receipt" : "Receipt"}
                </button>
              </div>
              {receiptPaymentId === payment.id && (
                <div
                  className="payment-receipt"
                  role="dialog"
                  aria-label="Payment receipt"
                >
                  <p className="receipt-kicker">Payment receipt</p>
                  <h4>{clientName}</h4>
                  <p>{new Date(payment.date).toLocaleDateString()}</p>
                  <strong>{formatCurrency(payment.amount)}</strong>
                  <span>Payment received</span>
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PaymentFeed;
