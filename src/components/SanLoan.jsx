import { useState } from "react";

const initialForm = {
  loanAmount: "",
  interestRate: "",
  paymentFrequency: "",
  startDate: "",
  endDate: "",
  numberOfPayments: "",
};

const SanLoan = () => {
  const [loanForm, setLoanForm] = useState(initialForm);
  // result preview
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const principal = Number(loanForm.loanAmount) || 0;
    const interestRate = Number(loanForm.interestRate) / 100 || 0;
    let numberOfPayments = Number(loanForm.numberOfPayments) || 0;

    if (numberOfPayments <= 0) numberOfPayments = 1;

    const totalAmount = principal + principal * interestRate;
    const payment = totalAmount / numberOfPayments;

    const res = {
      payment,
      numberOfPayments,
      totalPaid: payment * numberOfPayments,
      totalInterest: totalAmount - principal,
      totalAmount,
    };

    setResult(res);
    console.log("Loan calculation result:", res);
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    setLoanForm((prev) => ({ ...prev, loanAmount: value }));
  };

  const handleInterestRateChange = (e) => {
    const { value } = e.target;
    setLoanForm((prev) => ({ ...prev, interestRate: value }));
  };

  const handlePaymentRequiredChange = (e) => {
    const { value } = e.target;
    setLoanForm((prev) => ({ ...prev, numberOfPayments: value }));
  };

  return (
    <div>
      <div>
        <h2>San Loan</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <label> Amount:</label>
        <input
          onChange={handleAmountChange}
          value={loanForm.loanAmount}
          type="number"
        />
        <label> Interest Rate:</label>
        <input
          onChange={handleInterestRateChange}
          value={loanForm.interestRate}
          type="number"
        />
        <label>Number of Payments:</label>
        <input
          onChange={handlePaymentRequiredChange}
          value={loanForm.numberOfPayments}
          type="number"
        />
        <button type="submit">Calculate</button>
      </form>
      <div>
        {result && (
          <div>
            <p>Payment (per installment): {result.payment}</p>
            <p>Number of Payments: {result.numberOfPayments}</p>
            <p>Total Paid: {result.totalPaid}</p>
            <p>Total Interest: {result.totalInterest}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SanLoan;
