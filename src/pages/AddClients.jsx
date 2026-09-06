import { AnimatePresence, motion } from "motion/react";
import ClientCard from "../components/ClientCard";
import Header from "../components/Header";
import ClientsForm from "../components/ClientsForm";
import { useClients } from "../context/ClientsContext";

const AddClients = () => {
  const {
    clients,
    loanForm,
    loanPreview,
    addClient,
    updateLoanForm,
    applyPayment,
  } = useClients();

  return (
    <motion.div
      className="clients-page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header clients={clients} />
      <ClientsForm
        form={loanForm}
        paymentCount={loanPreview.numberOfPayments}
        onSubmit={addClient}
        onChange={updateLoanForm}
      />
      {/* <form className="client-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <span className="form-icon">＋</span>

            <div>
              <h2>New Client</h2>
              <p>Enter the client's loan information below.</p>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">Client Name</label>
            <input
              type="text"
              id="name"
              value={loanForm.name}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="loanAmount">Loan Amount</label>
            <input
              type="number"
              id="loanAmount"
              value={loanForm.loanAmount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="form-field">
            <label htmlFor="interestRate">Interest Rate</label>
            <input
              type="number"
              id="interestRate"
              value={loanForm.interestRate}
              onChange={handleChange}
              placeholder="8.5"
            />
          </div>

          <div className="form-field">
            <label htmlFor="numberOfPayments">Number of Payments</label>
            <input
              type="number"
              id="numberOfPayments"
              value={loanForm.numberOfPayments}
              onChange={handleChange}
              placeholder="e.g., 10"
            />
          </div>

          <div className="form-field">
            <label htmlFor="startDate">Starting Date</label>
            <input
              type="date"
              id="startDate"
              value={loanForm.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={loanForm.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-footer">
          <button className="submit-button" type="submit">
            Add Client
          </button>
        </div>
      </form> */}

      <section className="client-list-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Overview</p>
            <h2>Client List</h2>
          </div>
          <span className="client-count">
            {clients.length} {clients.length === 1 ? "client" : "clients"}
          </span>
        </div>

        {clients.length === 0 ? (
          <p className="empty-state">No clients added yet.</p>
        ) : (
          <div className="card-grid">
            <AnimatePresence initial={false}>
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onApplyPayment={applyPayment}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default AddClients;
