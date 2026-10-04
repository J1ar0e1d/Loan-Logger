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
    liquidateClient,
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

      <section className="client-list-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Overview</p>
            <h2>Clientes</h2>
          </div>
          <span className="client-count">
            {clients.length} {clients.length === 1 ? "client" : "clients"}
          </span>
        </div>

        {clients.length === 0 ? (
          <p className="empty-state">No se han agregado clientes.</p>
        ) : (
          <div className="card-grid">
            <AnimatePresence initial={false}>
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onApplyPayment={applyPayment}
                  onLiquidate={liquidateClient}
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
