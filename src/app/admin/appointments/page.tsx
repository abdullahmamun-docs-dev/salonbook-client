
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Loader2,
  Mail,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Customer = {
  name?: string;
  email?: string;
};

type Appointment = {
  _id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  category: string;
  price: number;
  duration: number;
  date: string;
  time: string;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/admin/all`,
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

      setAppointments(data);
      setError("");
    } catch (error) {
      console.error(
        "Fetch admin appointments error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadAppointments = async () => {
      try {
        const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/admin/all`,
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

        if (active) {
          setAppointments(data);
          setError("");
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Initial appointments fetch error:",
          error
        );

        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to fetch appointments"
          );
          setLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      active = false;
    };
  }, []);

  const handleConfirm = async (appointmentId: string) => {
    try {
      setActionId(appointmentId);

      const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointmentId}/confirm`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to confirm appointment"
        );
      }

      toast.success("Appointment confirmed successfully");

      await fetchAppointments();
    } catch (error) {
      console.error("Confirm appointment error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to confirm appointment"
      );
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (appointmentId: string) => {
  toast("Cancel this appointment?", {
    description:
      "Are you sure you want to cancel this appointment?",

    action: {
      label: "Cancel Appointment",
      onClick: async () => {
        try {
          setActionId(appointmentId);

          const response = await fetch(
           `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointmentId}/cancel-admin`,
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

          toast.success(
            "Appointment cancelled successfully"
          );

          await fetchAppointments();
        } catch (error) {
          console.error(
            "Cancel appointment error:",
            error
          );

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to cancel appointment"
          );
        } finally {
          setActionId(null);
        }
      },
    },

    cancel: {
      label: "Keep Appointment",
      onClick: () => {},
    },
  });
};

  const getStatusClass = (
    status: Appointment["status"]
  ) => {
    if (status === "confirmed") {
      return "admin-appointment-status confirmed";
    }

    if (status === "cancelled") {
      return "admin-appointment-status cancelled";
    }

    return "admin-appointment-status pending";
  };

  const getPaymentClass = (
    paymentStatus: Appointment["paymentStatus"]
  ) => {
    return paymentStatus === "paid"
      ? "admin-payment-status paid"
      : "admin-payment-status unpaid";
  };

  return (
    <main className="admin-appointments-page">
      <div className="admin-appointments-container">
        <div className="admin-appointments-topbar">
          <Link
            href="/admin"
            className="admin-appointments-back"
          >
            <ArrowLeft size={17} />
            Back to Admin Dashboard
          </Link>
        </div>

        <section className="admin-appointments-header">
          <div>
            <span className="admin-page-eyebrow">
              APPOINTMENT MANAGEMENT
            </span>

            <h1>Manage Appointments</h1>

            <p>
              Review customer bookings and manage appointment
              status from one place.
            </p>
          </div>

          <div className="admin-appointments-count">
            <CalendarDays size={18} />
            <span>
              {appointments.length} Appointments
            </span>
          </div>
        </section>

        {loading ? (
          <section className="admin-appointments-loading">
            <Loader2 size={32} className="spin" />
            <p>Loading appointments...</p>
          </section>
        ) : error ? (
          <section className="admin-appointments-message error">
            <X size={30} />
            <h3>Unable to load appointments</h3>
            <p>{error}</p>

            <button
              type="button"
              onClick={fetchAppointments}
              className="admin-appointment-retry"
            >
              Try Again
            </button>
          </section>
        ) : appointments.length === 0 ? (
          <section className="admin-appointments-message">
            <CalendarDays size={38} />
            <h3>No appointments found</h3>
            <p>
              Customer appointments will appear here when they
              make a booking.
            </p>
          </section>
        ) : (
          <section className="admin-appointments-table-section">
            <div className="admin-appointments-table-wrapper">
              <table className="admin-appointments-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => {
                    const isProcessing =
                      actionId === appointment._id;

                    return (
                      <tr key={appointment._id}>
                        <td>
                          <div className="admin-customer-cell">
                            <div className="admin-customer-avatar">
                              <User size={16} />
                            </div>

                            <div>
                              <strong>
                                {appointment.customer?.name ||
                                  "Unknown Customer"}
                              </strong>

                              <span>
                                <Mail size={13} />
                                {appointment.customer?.email ||
                                  "No email"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="admin-service-cell">
                            <strong>
                              {appointment.serviceName}
                            </strong>

                            <span>
                              {appointment.category} ·{" "}
                              {appointment.duration} min
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="admin-date-cell">
                            <strong>
                              {appointment.date}
                            </strong>

                            <span>
                              <Clock3 size={13} />
                              {appointment.time}
                            </span>
                          </div>
                        </td>

                        <td>
                          <strong className="admin-price">
                            ৳{appointment.price}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              appointment.status
                            )}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        <td>
                          <span
                            className={getPaymentClass(
                              appointment.paymentStatus
                            )}
                          >
                            {appointment.paymentStatus}
                          </span>
                        </td>

                        <td>
                          <div className="admin-appointment-actions">
                            {appointment.status ===
                              "pending" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleConfirm(
                                    appointment._id
                                  )
                                }
                                disabled={isProcessing}
                                className="admin-confirm-button"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={14}
                                    className="spin"
                                  />
                                ) : (
                                  <Check size={14} />
                                )}
                                Confirm
                              </button>
                            )}

                            {(appointment.status ===
                              "pending" ||
                              appointment.status ===
                                "confirmed") && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancel(
                                    appointment._id
                                  )
                                }
                                disabled={isProcessing}
                                className="admin-cancel-button"
                              >
                                {isProcessing ? (
                                  <Loader2
                                    size={14}
                                    className="spin"
                                  />
                                ) : (
                                  <X size={14} />
                                )}
                                Cancel
                              </button>
                            )}

                            {appointment.status ===
                              "cancelled" && (
                              <span className="admin-no-action">
                                No actions
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
