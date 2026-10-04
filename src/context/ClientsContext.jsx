import { createContext, useContext, useEffect, useState } from "react";

const CLIENTS_STORAGE_KEY = "san-loan-clients";

export const initialForm = {
  name: "",
  loanAmount: "",
  interestRate: "",
  paymentFrequency: "weekly",
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

const ClientsContext = createContext(null);

const readClients = () => {
  try {
    const savedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    const clients = savedClients ? JSON.parse(savedClients) : [];
    return clients
      .filter((client) => client.status !== "liquidated")
      .map((client) => ({
        ...client,
        calculatedLoan: calculateLoan(client),
      }));
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
  const interestRate = Number(loan.interestRate) / 100 || 0;
  const numberOfPayments =
    Number(loan.numberOfPayments) > 0
      ? Number(loan.numberOfPayments)
      : getNumberOfPayments(loan);
  const totalInterest = principal * interestRate;
  const totalAmount = principal + totalInterest;
  const payment = totalAmount / numberOfPayments;

  return {
    payment,
    numberOfPayments,
    totalPaid: payment * numberOfPayments,
    totalInterest,
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
      status: "active",
    };

    setClients((previous) => [...previous, newClient]);
    setLoanForm(initialForm);
  };

  const liquidateClient = (clientId) => {
    setClients((previous) =>
      previous.filter((client) => {
        if (client.id !== clientId || client.status === "liquidated") {
          return true;
        }

        const loanTotal = Number(client.calculatedLoan?.totalAmount) || 0;
        const paidSoFar = (client.payments || []).reduce(
          (total, payment) => total + (Number(payment.amount) || 0),
          0,
        );

        return Math.round(paidSoFar * 100) < Math.round(loanTotal * 100);
      }),
    );
  };

  const applyPayment = (clientId, amount) => {
    if (amount === "" || amount === null || amount === undefined) return false;

    const paymentAmount = Number(amount);
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) return false;

    const client = clients.find((item) => item.id === clientId);
    if (!client || client.status === "liquidated") return false;

    const loanTotal = Number(client.calculatedLoan?.totalAmount) || 0;
    const paidSoFar = (client.payments || []).reduce(
      (total, payment) => total + (Number(payment.amount) || 0),
      0,
    );
    const remainingBalance = Math.max(0, loanTotal - paidSoFar);
    const remainingCents = Math.round(remainingBalance * 100);
    const paymentCents = Math.round(paymentAmount * 100);
    if (paymentCents > remainingCents) return false;

    setClients((previous) =>
      previous.map((client) => {
        if (client.id !== clientId) return client;
        if (client.status === "liquidated") return client;

        const loanTotal = Number(client.calculatedLoan?.totalAmount) || 0;
        const paidSoFar = (client.payments || []).reduce(
          (total, payment) => total + (Number(payment.amount) || 0),
          0,
        );
        const remainingBalance = Math.max(0, loanTotal - paidSoFar);
        const appliedAmount = Math.min(remainingBalance, paymentAmount);
        if (appliedAmount <= 0) return client;

        return {
          ...client,
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
    return true;
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
        liquidateClient,
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
