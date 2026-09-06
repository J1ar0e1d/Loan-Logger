import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PaymentFeed from "./PaymentFeed";

const ClientCard = ({ client, onApplyPayment }) => {
  const [paymentInput, setPaymentInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  if (!client) return null;

  const loanAmount = Number(client.loanAmount || 0);
  const payment = client.calculatedLoan?.payment || 0;
  const numberOfPayments = client.calculatedLoan?.numberOfPayments || 0;
  const totalPaid = client.calculatedLoan?.totalPaid || 0;
  const totalInterest = client.calculatedLoan?.totalInterest || 0;
  const endDate = client.endDate
    ? new Date(client.endDate).toLocaleDateString()
    : "N/A";
  return (
    <motion.article
      className="client-card"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="card-header">
        <div>
          <p className="card-label">Client Profile</p>
          <h3>Loan Summary</h3>
        </div>
        <span className="status-pill">Active</span>
      </div>

      <div>
        <span className="card-label">Client Name</span>
        <h2>{client.name}</h2>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span>Loan Amount</span>
          <strong>
            {loanAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
        </div>

        <div className="card-row">
          <span>Interest Rate</span>
          <strong>{client.interestRate}%</strong>
        </div>

        <div className="card-row">
          <span>Payment Frequency</span>
          <strong>{client.paymentFrequency}</strong>
        </div>
        <div className="card-row">
          <span>Compounding</span>
          <strong>{client.compoundingFrequency}</strong>
        </div>
        <div className="card-row">
          <span>Payment (per installment)</span>
          <strong>
            {payment.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
        </div>

        <div className="card-row">
          <span>Number of Payments</span>
          <strong>{numberOfPayments}</strong>
        </div>

        <button
          type="button"
          className="details-button"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? "Hide Details ↑" : "View Details ↓"}
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="card-details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="detail-divider" />

              <div className="card-row">
                <span>Total Paid</span>
                <strong>
                  {totalPaid.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </strong>
              </div>

              <div className="card-row">
                <span>Total Interest</span>
                <strong>
                  {totalInterest.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </strong>
              </div>

              <div className="card-row">
                <span>End Date</span>
                <strong>{endDate}</strong>
              </div>
              <div className="card-row payment-entry">
                <label>Apply Payment</label>
                <div className="payment-controls">
                  <input
                    type="number"
                    value={paymentInput}
                    onChange={(e) => setPaymentInput(e.target.value)}
                    placeholder="Amount"
                  />
                  <button
                    className="apply-payment-button"
                    onClick={() => {
                      if (!paymentInput) return;
                      if (typeof onApplyPayment === "function") {
                        onApplyPayment(client.id, paymentInput);
                      }
                      setPaymentInput("");
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              <PaymentFeed payments={client.payments} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default ClientCard;
