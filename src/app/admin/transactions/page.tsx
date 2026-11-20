"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  Receipt,
  ShieldCheck,
} from "lucide-react";

type Transaction = {
  _id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/payments/admin/all",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch transactions"
          );
        }

        setTransactions(data);
      } catch (error) {
        console.error(
          "Transactions fetch error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (
    amount: number,
    currency: string
  ) => {
    return `${currency.toUpperCase()} ${amount.toLocaleString(
      "en-BD"
    )}`;
  };

  const totalAmount = transactions
    .filter((transaction) => transaction.status === "paid")
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  return (
    <main className="admin-transactions-page">
      <div className="admin-transactions-container">
        {/* Header */}
        <div className="admin-transactions-header">
          <div>
            <Link
              href="/admin"
              className="admin-transactions-back"
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </Link>

            <p className="admin-transactions-eyebrow">
              SALONBOOK ADMIN
            </p>

            <h1>Transactions</h1>

            <p>
              Monitor successful customer payments and
              Stripe transaction records.
            </p>
          </div>

          <div className="admin-transactions-header-icon">
            <Receipt size={30} />
          </div>
        </div>

        {/* Summary */}
        <div className="admin-transactions-summary">
          <div className="admin-transaction-summary-card">
            <div className="admin-transaction-summary-icon">
              <Receipt size={20} />
            </div>

            <div>
              <span>Total Transactions</span>
              <strong>{transactions.length}</strong>
            </div>
          </div>

          <div className="admin-transaction-summary-card">
            <div className="admin-transaction-summary-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Paid Transactions</span>
              <strong>
                {
                  transactions.filter(
                    (transaction) =>
                      transaction.status === "paid"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="admin-transaction-summary-card">
            <div className="admin-transaction-summary-icon">
              <CreditCard size={20} />
            </div>

            <div>
              <span>Total Revenue</span>
              <strong>
                BDT {totalAmount.toLocaleString("en-BD")}
              </strong>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="admin-transactions-card">
          <div className="admin-transactions-card-header">
            <div>
              <h2>Payment History</h2>
              <p>
                Verified Stripe payments received from
                customers.
              </p>
            </div>

            <div className="admin-transactions-secure">
              <ShieldCheck size={16} />
              Verified payments
            </div>
          </div>

          {loading ? (
            <div className="admin-transactions-loading">
              <LoaderCircle
                size={28}
                className="admin-transactions-spinner"
              />
              <p>Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="admin-transactions-error">
              <h3>Unable to load transactions</h3>
              <p>{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="admin-transactions-empty">
              <Receipt size={40} />
              <h3>No transactions yet</h3>
              <p>
                Successful customer payments will appear
                here.
              </p>
            </div>
          ) : (
            <div className="admin-transactions-table-wrapper">
              <table className="admin-transactions-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Appointment</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Stripe Session</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>
                        <div className="transaction-customer">
                          <strong>
                            {transaction.customerName}
                          </strong>

                          <span>
                            {transaction.customerEmail}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="transaction-id">
                          {transaction.appointmentId}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`transaction-status ${transaction.status}`}
                        >
                          <CheckCircle2 size={14} />
                          {transaction.status}
                        </span>
                      </td>

                      <td>
                        <span className="transaction-stripe-id">
                          {transaction.stripeSessionId}
                        </span>
                      </td>

                      <td>
                        <span className="transaction-date">
                          {formatDate(
                            transaction.createdAt
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}