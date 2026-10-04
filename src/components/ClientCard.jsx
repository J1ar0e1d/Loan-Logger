import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PaymentFeed from "./PaymentFeed";

const ClientCard = ({ client, onApplyPayment, onLiquidate }) => {
  const [paymentInput, setPaymentInput] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  if (!client) return null;

  const getUpcomingDueDate = (startDate) => {
    if (!startDate) return null;

    const [year, month, day] = startDate.split("-").map(Number);
    const loanDate = new Date(year, month - 1, day);
    if (!Number.isFinite(loanDate.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    loanDate.setHours(0, 0, 0, 0);

    if (loanDate > today) return loanDate;

    const daysUntilDue = (loanDate.getDay() - today.getDay() + 7) % 7;
    const upcomingDueDate = new Date(today);
    upcomingDueDate.setDate(today.getDate() + daysUntilDue);
    return upcomingDueDate;
  };

  const loanAmount = Number(client.loanAmount || 0);
  const payment = client.calculatedLoan?.payment || 0;
  const numberOfPayments = client.calculatedLoan?.numberOfPayments || 0;
  const totalInterest = client.calculatedLoan?.totalInterest || 0;
  const paidSoFar = (client.payments || []).reduce(
    (total, item) => total + (Number(item.amount) || 0),
    0,
  );
  const remainingBalance = Math.max(
    0,
    (client.calculatedLoan?.totalAmount || 0) - paidSoFar,
  );
  const remainingCents = Math.round(remainingBalance * 100);
  const canLiquidate = client.status !== "liquidated" && remainingCents === 0;
  const endDate = client.endDate
    ? new Date(client.endDate).toLocaleDateString()
    : "N/A";
  const upcomingDueDate = getUpcomingDueDate(client.startDate);
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
          <p className="card-label">Perfil del Cliente</p>
          <h3>Resumen del Préstamo</h3>
        </div>
        <span
          className={`status-pill ${client.status === "liquidated" ? "status-pill-complete" : ""}`}
        >
          {client.status === "liquidated" ? "Liquidated" : "Active"}
        </span>
      </div>

      <div>
        <span className="card-label">Nombre del Cliente</span>
        <h2>{client.name}</h2>
      </div>

      <div className="card-body">
        <div className="card-row">
          <span>Monto del Préstamo</span>
          <strong>
            {loanAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
        </div>

        <div className="card-row">
          <span>Tasa de Interés</span>
          <strong>{client.interestRate}%</strong>
        </div>

        <div className="card-row">
          <span>Frecuencia de Pagos</span>
          <strong>{client.paymentFrequency}</strong>
        </div>
        <div className="card-row upcoming-due-row">
          <span>Próximo Vencimiento</span>
          <strong>
            {upcomingDueDate
              ? upcomingDueDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </strong>
        </div>
        <div className="card-row">
          <span>Pago (por cuota)</span>
          <strong>
            {payment.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
        </div>

        <div className="card-row">
          <span>Plazo del Préstamo (semanas)</span>
          <strong>{numberOfPayments}</strong>
        </div>

        <button
          type="button"
          className="details-button"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? "Ocultar Detalles ↑" : "Ver Detalles ↓"}
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
                <span>Total Pagado</span>
                <strong>
                  {paidSoFar.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </strong>
              </div>

              <div className="card-row">
                <span>Interes Total</span>
                <strong>
                  {totalInterest.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </strong>
              </div>

              <div className="card-row">
                <span>Saldo Restante</span>
                <strong>
                  {remainingBalance.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </strong>
              </div>

              <div className="card-row">
                <span>Fecha de Vencimiento</span>
                <strong>{endDate}</strong>
              </div>
              <div className="card-row payment-entry">
                <label>Procesar Pago</label>
                <div className="payment-controls">
                  <input
                    type="number"
                    value={paymentInput}
                    min="0.01"
                    max={remainingBalance}
                    step="0.01"
                    onChange={(e) => {
                      setPaymentInput(e.target.value);
                      setPaymentError("");
                    }}
                    placeholder="Amount"
                    disabled={
                      client.status === "liquidated" || remainingCents === 0
                    }
                  />
                  <button
                    className="details-button"
                    type="button"
                    disabled={
                      client.status === "liquidated" || remainingCents === 0
                    }
                    onClick={() => {
                      const paymentAmount = Number(paymentInput);
                      if (
                        !paymentInput ||
                        !Number.isFinite(paymentAmount) ||
                        paymentAmount <= 0
                      ) {
                        setPaymentError("Enter a payment amount.");
                        return;
                      }
                      if (Math.round(paymentAmount * 100) > remainingCents) {
                        setPaymentError(
                          "Payment cannot exceed the remaining balance.",
                        );
                        return;
                      }
                      if (
                        typeof onApplyPayment === "function" &&
                        onApplyPayment(client.id, paymentInput)
                      ) {
                        setPaymentError("");
                        setPaymentInput("");
                      }
                    }}
                  >
                    Cobrar 💰
                  </button>
                </div>
                {paymentError && (
                  <p className="payment-error">{paymentError}</p>
                )}
              </div>

              <PaymentFeed
                payments={client.payments}
                clientName={client.name}
              />

              <button
                type="button"
                className="liquidate-button"
                disabled={!canLiquidate}
                onClick={() => {
                  if (!canLiquidate) return;
                  const confirmed = window.confirm(
                    `Liquidate ${client.name}'s loan? The fully paid client will be removed from the active list.`,
                  );
                  if (confirmed && typeof onLiquidate === "function") {
                    onLiquidate(client.id);
                  }
                }}
              >
                {client.status === "liquidated"
                  ? "Loan liquidated"
                  : canLiquidate
                    ? "Liquidate client"
                    : "Pay balance to liquidate"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
};

export default ClientCard;
