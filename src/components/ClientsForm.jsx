export default function ClientsForm({
  form,
  paymentCount,
  onSubmit,
  onChange,
}) {
  return (
    <form className="client-form" onSubmit={onSubmit}>
      <div className="form-header">
        <div>
          <span className="form-icon">＋</span>
          <div>
            <h2>Nuevo Cliente</h2>
            <p>
              Introduce la información del préstamo del cliente a continuación.
            </p>
          </div>
        </div>
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="name">Nombre del Cliente</label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter client name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="loanAmount">Monto del Préstamo</label>
          <input
            type="number"
            id="loanAmount"
            value={form.loanAmount}
            onChange={onChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="interestRate">Tasa de Interés Fija (%)</label>
          <input
            type="number"
            id="interestRate"
            value={form.interestRate}
            onChange={onChange}
            placeholder="30"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="paymentFrequency">Frecuencia de Pagos</label>
          <select
            id="paymentFrequency"
            value={form.paymentFrequency}
            onChange={onChange}
          >
            <option value="weekly">Semanal</option>
            <option value="biweekly">Cada dos semanas</option>
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="yearly">Anual</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="startDate">Fecha de Inicio</label>
          <input
            type="date"
            id="startDate"
            value={form.startDate}
            onChange={onChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="endDate">Fecha de Finalización</label>
          <input
            type="date"
            id="endDate"
            value={form.endDate}
            onChange={onChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="numberOfPayments">Número de Semanas</label>
          <input
            type="number"
            id="numberOfPayments"
            value={paymentCount || ""}
            onChange={onChange}
            min="1"
            step="1"
            placeholder="e.g. 10 or 13 weeks"
            required
          />
        </div>
      </div>
      <div className="form-footer">
        <button className="submit-button" type="submit">
          Agregar Cliente
        </button>
      </div>
    </form>
  );
}
