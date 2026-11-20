"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  LoaderCircle,
  Scissors,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

type Appointment = {
  _id: string;
  serviceName: string;
  category: string;
  price: number;
  duration: number;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/appointments/my",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch appointments"
          );
        }

        if (!cancelled) {
          setAppointments(data);
          setError("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Appointments error:", error);

        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load appointments."
          );
          setLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleCancelAppointment = async (
    appointmentId: string
  ) => {
    toast("Cancel this appointment?", {
      description:
        "Are you sure you want to cancel this appointment?",

      action: {
        label: "Cancel Appointment",
        onClick: async () => {
          try {
            setCancellingId(appointmentId);

            const response = await fetch(
              `http://localhost:5000/api/appointments/${appointmentId}/cancel`,
              {
                method: "PATCH",
                credentials: "include",
              }
            );

            const data = await response.json();

            if (!response.ok) {
              throw new Error(
                data.message || "Failed to cancel appointment"
              );
            }

            setAppointments((currentAppointments) =>
              currentAppointments.map((appointment) =>
                appointment._id === appointmentId
                  ? {
                      ...appointment,
                      status: "cancelled",
                    }
                  : appointment
              )
            );

            toast.success(
              "Appointment cancelled successfully."
            );
          } catch (error) {
            console.error(
              "Cancel appointment error:",
              error
            );

            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to cancel appointment."
            );
          } finally {
            setCancellingId(null);
          }
        },
      },

      cancel: {
        label: "Keep Appointment",
        onClick: () => {},
      },
    });
  };

  const handlePayment = async (appointmentId: string) => {
    try {
      setPayingId(appointmentId);

      const response = await fetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            appointmentId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create payment session"
        );
      }

      if (!data.url) {
        throw new Error(
          "Stripe checkout URL was not returned."
        );
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Payment error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );
    } finally {
      setPayingId(null);
    }
  };

  const pendingCount = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const paidCount = appointments.filter(
    (appointment) => appointment.paymentStatus === "paid"
  ).length;

  return (
    <main className="appointments-page">
      {/* Sidebar */}
      <aside className="appointments-sidebar">
        <Link href="/" className="appointments-brand">
          <div className="appointments-brand-icon">
            <Scissors size={20} />
          </div>

          <div>
            <p>
              Salon<span>Book</span>
            </p>
            <small>Beauty & Care</small>
          </div>
        </Link>

        <div className="appointments-sidebar-label">
          CUSTOMER MENU
        </div>

        <nav className="appointments-nav">
          <Link
            href="/dashboard"
            className="appointments-nav-link"
          >
            <CalendarDays size={18} />
            Overview
          </Link>

          <Link
            href="/dashboard/appointments"
            className="appointments-nav-link active"
          >
            <Clock3 size={18} />
            My Appointments
          </Link>

          <Link
            href="/dashboard/profile"
            className="appointments-nav-link"
          >
            <Scissors size={18} />
            My Profile
          </Link>
        </nav>

        <div className="appointments-sidebar-bottom">
          <Link
            href="/"
            className="appointments-back-home"
          >
            <ArrowLeft size={16} />
            Back to SalonBook
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <section className="appointments-main">
        {/* Topbar */}
        <div className="appointments-topbar">
          <div>
            <Link
              href="/dashboard"
              className="appointments-back-link"
            >
              <ArrowLeft size={15} />
              Dashboard
            </Link>

            <p className="appointments-eyebrow">
              CUSTOMER DASHBOARD
            </p>

            <h1>My Appointments</h1>

            <p className="appointments-subtitle">
              View and manage all your salon appointments in one
              place.
            </p>
          </div>

          <Link
            href="/services"
            className="appointments-book-button"
          >
            <CalendarDays size={17} />
            Book Appointment
          </Link>
        </div>

        {/* Stats */}
        <div className="appointments-stats">
          <div className="appointments-stat-card">
            <div className="appointments-stat-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>Total</span>
              <strong>
                {loading ? "..." : appointments.length}
              </strong>
            </div>
          </div>

          <div className="appointments-stat-card">
            <div className="appointments-stat-icon pending">
              <Clock3 size={19} />
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {loading ? "..." : pendingCount}
              </strong>
            </div>
          </div>

          <div className="appointments-stat-card">
            <div className="appointments-stat-icon confirmed">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <span>Confirmed</span>
              <strong>
                {loading ? "..." : confirmedCount}
              </strong>
            </div>
          </div>

          <div className="appointments-stat-card">
            <div className="appointments-stat-icon paid">
              <CreditCard size={19} />
            </div>

            <div>
              <span>Paid</span>
              <strong>
                {loading ? "..." : paidCount}
              </strong>
            </div>
          </div>
        </div>

        {/* Appointment Panel */}
        <section className="appointments-panel">
          <div className="appointments-panel-header">
            <div>
              <p>BOOKING HISTORY</p>
              <h2>Your Appointments</h2>
            </div>

            <span className="appointments-count">
              {loading
                ? "Loading..."
                : `${appointments.length} appointment${
                    appointments.length !== 1
                      ? "s"
                      : ""
                  }`}
            </span>
          </div>

          {/* Loading */}
          {loading && (
            <div className="appointments-loading">
              <LoaderCircle
                size={30}
                className="appointments-spinner"
              />

              <p>Loading your appointments...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="appointments-error">
              <div className="appointments-error-icon">
                <XCircle size={27} />
              </div>

              <h3>Unable to load appointments</h3>

              <p>{error}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="appointments-error-button"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            appointments.length === 0 && (
              <div className="appointments-empty">
                <div className="appointments-empty-icon">
                  <CalendarDays size={28} />
                </div>

                <p className="appointments-empty-label">
                  SALONBOOK
                </p>

                <h3>No appointments yet</h3>

                <p>
                  You have not booked any appointments yet.
                  Explore our services and book your first
                  appointment.
                </p>

                <Link
                  href="/services"
                  className="appointments-empty-button"
                >
                  Browse Services
                </Link>
              </div>
            )}

          {/* Appointment List */}
          {!loading &&
            !error &&
            appointments.length > 0 && (
              <div className="appointments-list">
                {appointments.map((appointment) => (
                  <article
                    key={appointment._id}
                    className="appointment-card"
                  >
                    <div className="appointment-card-icon">
                      <Scissors size={20} />
                    </div>

                    <div className="appointment-card-main">
                      <div className="appointment-card-heading">
                        <div>
                          <p>{appointment.category}</p>

                          <h3>
                            {appointment.serviceName}
                          </h3>
                        </div>

                        <strong>
                          ৳{appointment.price.toLocaleString()}
                        </strong>
                      </div>

                      <div className="appointment-details">
                        <div>
                          <CalendarDays size={15} />
                          <span>{appointment.date}</span>
                        </div>

                        <div>
                          <Clock3 size={15} />
                          <span>{appointment.time}</span>
                        </div>

                        <div>
                          <Clock3 size={15} />
                          <span>
                            {appointment.duration} min
                          </span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="appointment-notes">
                          <span>Note:</span>{" "}
                          {appointment.notes}
                        </div>
                      )}

                      <div className="appointment-card-footer">
                        <span
                          className={`appointment-status ${appointment.status}`}
                        >
                          {appointment.status}
                        </span>

                        <span
                          className={`appointment-payment ${appointment.paymentStatus}`}
                        >
                          {appointment.paymentStatus}
                        </span>

                        {/* Pay Now */}
                        {appointment.status ===
                          "confirmed" &&
                          appointment.paymentStatus ===
                            "unpaid" && (
                            <button
                              type="button"
                              onClick={() =>
                                handlePayment(
                                  appointment._id
                                )
                              }
                              disabled={
                                payingId === appointment._id
                              }
                              className="appointment-pay-button"
                            >
                              {payingId === appointment._id ? (
                                <>
                                  <LoaderCircle
                                    size={14}
                                    className="appointments-spinner"
                                  />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CreditCard size={14} />
                                  Pay Now
                                </>
                              )}
                            </button>
                          )}

                        {/* Cancel */}
                        {appointment.status ===
                          "pending" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelAppointment(
                                appointment._id
                              )
                            }
                            disabled={
                              cancellingId ===
                              appointment._id
                            }
                            className="appointment-cancel-button"
                          >
                            {cancellingId ===
                            appointment._id ? (
                              <>
                                <LoaderCircle
                                  size={14}
                                  className="appointments-spinner"
                                />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </section>
    </main>
  );
}