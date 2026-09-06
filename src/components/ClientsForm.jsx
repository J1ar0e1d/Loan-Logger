export default function ClientsForm({ form, paymentCount, onSubmit, onChange }) {
  return (
    <form className="client-form" onSubmit={onSubmit}>
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
            value={form.name}
            onChange={onChange}
            placeholder="Enter client name"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="loanAmount">Loan Amount</label>
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
          <label htmlFor="interestRate">Annual Interest Rate (%)</label>
          <input
            type="number"
            id="interestRate"
            value={form.interestRate}
            onChange={onChange}
            placeholder="8.5"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="paymentFrequency">Payment Frequency</label>
          <select
            id="paymentFrequency"
            value={form.paymentFrequency}
            onChange={onChange}
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every two weeks</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="compoundingFrequency">Compounding Frequency</label>
          <select
            id="compoundingFrequency"
            value={form.compoundingFrequency}
            onChange={onChange}
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every two weeks</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="startDate">Starting Date</label>
          <input
            type="date"
            id="startDate"
            value={form.startDate}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={form.endDate}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="numberOfPayments">Number of Payments</label>
          <input
            type="number"
            id="numberOfPayments"
            value={paymentCount || ""}
            readOnly
            placeholder="Choose dates"
          />
        </div>
      </div>
      <div className="form-footer">
        <button className="submit-button" type="submit">
          Add Client
        </button>
      </div>
    </form>
  );
}
