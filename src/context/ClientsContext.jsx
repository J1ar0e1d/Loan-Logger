import { createContext, useContext, useEffect, useState } from "react";

const CLIENTS_STORAGE_KEY = "san-loan-clients";

export const initialForm = {
  name: "",
  loanAmount: "",
  interestRate: "",
  paymentFrequency: "monthly",
  compoundingFrequency: "monthly",
  startDate: "",
  endDate: "",
  numberOfPayments: "",
};

const paymentIntervals = {
  weekly: { days: 7, months: 0 },
  biweekly: { days: 14, months: 0 },
  monthly: { days: 0, months: 1 },
  quarterly: { days: 0, months: 3 },
  yearly: { days: 0, months: 12 },
};

const compoundingPeriods = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

const ClientsContext = createContext(null);

const readClients = () => {
  try {
    const savedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    return savedClients ? JSON.parse(savedClients) : [];
  } catch {
    return [];
  }
};

const parseDate = (date) => {
  if (!date) return null;
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const getNumberOfPayments = (loan) => {
  const startDate = parseDate(loan.startDate);
  const endDate = parseDate(loan.endDate);
  const interval = paymentIntervals[loan.paymentFrequency];

  if (!startDate || !endDate || !interval || endDate <= startDate) {
    return Math.max(1, Number(loan.numberOfPayments) || 1);
  }

  if (interval.days) {
    return Math.max(
      1,
      Math.floor((endDate - startDate) / 86400000 / interval.days),
    );
  }

  let months =
    (endDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
    endDate.getUTCMonth() -
    startDate.getUTCMonth();
  if (endDate.getUTCDate() < startDate.getUTCDate()) months -= 1;

  return Math.max(1, Math.floor(months / interval.months));
};

export const calculateLoan = (loan) => {
  const principal = Number(loan.loanAmount) || 0;
  const annualRate = Number(loan.interestRate) / 100 || 0;
  const numberOfPayments = getNumberOfPayments(loan);
  const compoundsPerYear = compoundingPeriods[loan.compoundingFrequency] || 12;
  const paymentPeriodsPerYear = compoundingPeriods[loan.paymentFrequency] || 12;
  const periodicRate = annualRate / compoundsPerYear;
  const totalPeriods =
    numberOfPayments * (compoundsPerYear / paymentPeriodsPerYear);
  const totalAmount =
    periodicRate > 0
      ? principal * Math.pow(1 + periodicRate, totalPeriods)
      : principal;
  const payment = totalAmount / numberOfPayments;

  return {
    payment,
    numberOfPayments,
    totalPaid: payment * numberOfPayments,
    totalInterest: totalAmount - principal,
    totalAmount,
  };
};

export function ClientsProvider({ children }) {
  const [loanForm, setLoanForm] = useState(initialForm);
  const [clients, setClients] = useState(readClients);

  useEffect(() => {
    try {
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    } catch {
      return;
    }
  }, [clients]);

  const updateLoanForm = (event) => {
    const { id, value } = event.target;
    setLoanForm((previous) => ({ ...previous, [id]: value }));
  };

  const addClient = (event) => {
    event.preventDefault();
    const calculatedLoan = calculateLoan(loanForm);
    const newClient = {
      id:
        clients.reduce(
          (highestId, client) => Math.max(highestId, Number(client.id) || 0),
          0,
        ) + 1,
      ...loanForm,
      numberOfPayments: calculatedLoan.numberOfPayments,
      calculatedLoan,
      payments: [],
    };

    setClients((previous) => [...previous, newClient]);
    setLoanForm(initialForm);
  };

  const applyPayment = (clientId, amount) => {
    const paymentAmount = Number(amount) || 0;
    if (paymentAmount <= 0) return;

    setClients((previous) =>
      previous.map((client) => {
        if (client.id !== clientId) return client;

        const currentPrincipal = Number(client.loanAmount) || 0;
        const appliedAmount = Math.min(currentPrincipal, paymentAmount);
        if (appliedAmount <= 0) return client;

        const updatedPrincipal = currentPrincipal - appliedAmount;
        const updatedLoan = calculateLoan({
          ...client,
          loanAmount: updatedPrincipal,
        });

        return {
          ...client,
          loanAmount: String(updatedPrincipal),
          numberOfPayments: updatedLoan.numberOfPayments,
          calculatedLoan: updatedLoan,
          payments: [
            ...(client.payments || []),
            {
              id: `${clientId}-${(client.payments || []).length + 1}`,
              amount: appliedAmount,
              date: new Date().toISOString(),
            },
          ],
        };
      }),
    );
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loanForm,
        loanPreview: calculateLoan(loanForm),
        addClient,
        updateLoanForm,
        applyPayment,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used inside ClientsProvider");
  }
  return context;
}
