
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Home,
  XCircle,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="payment-result-page">
      <div className="payment-result-card">
        <div className="payment-result-icon cancel">
          <XCircle size={52} />
        </div>

        <p className="payment-result-label">SALONBOOK</p>

        <h1>Payment Cancelled</h1>

        <p className="payment-result-message">
          Your payment was cancelled. Your appointment has not
          been marked as paid.
        </p>

        <div className="payment-result-actions">
          <Link
            href="/dashboard/appointments"
            className="payment-result-primary"
          >
            <CalendarDays size={17} />
            My Appointments
          </Link>

          <Link
            href="/"
            className="payment-result-secondary"
          >
            <Home size={17} />
            Back to Home
          </Link>
        </div>

        <Link
          href="/dashboard/appointments"
          className="payment-result-back"
        >
          <ArrowLeft size={15} />
          Return to appointments
        </Link>
      </div>
    </main>
  );
}
