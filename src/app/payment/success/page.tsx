
"use client";

import Link from "next/link";
import { CheckCircle2, CalendarDays, Home, Scissors } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="payment-result-page">
      <div className="payment-result-card">
        <div className="payment-result-icon success">
          <CheckCircle2 size={52} />
        </div>

        <p className="payment-result-label">SALONBOOK</p>

        <h1>Payment Successful!</h1>

        <p className="payment-result-message">
          Your payment has been completed successfully.
          Your appointment payment is being verified securely.
        </p>

        <div className="payment-result-note">
          <Scissors size={18} />
          <span>
            Your appointment status will be updated after
            payment verification.
          </span>
        </div>

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
      </div>
    </main>
  );
}
