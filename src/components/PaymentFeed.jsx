import { motion } from "motion/react";

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

const PaymentFeed = ({ payments = [] }) => {
  const orderedPayments = [...payments].reverse();

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
              <strong>{formatCurrency(payment.amount)}</strong>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PaymentFeed;
