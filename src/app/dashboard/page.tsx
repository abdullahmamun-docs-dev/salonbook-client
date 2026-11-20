
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Scissors,
  Sparkles,
  User,
} from "lucide-react";

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

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const handleSignOut = async () => {
  await authClient.signOut();

  window.location.href = "/";
};

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/appointments/my",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        // const data = await response.json();

        // setAppointments(data);          

       const data = await response.json();

console.log("APPOINTMENTS RESPONSE:", {
  status: response.status,
  ok: response.ok,
  data,
});

setAppointments(data);



      } catch (error) {
        console.error("Dashboard appointment error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );

  const unpaidAppointments = appointments.filter(
    (appointment) => appointment.paymentStatus === "unpaid"
  );

  const recentAppointments = appointments.slice(0, 3);

  return (
    <main className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <Scissors size={20} />
          </div>

          <div>
            <p>
              Salon<span>Book</span>
            </p>

            <small>Beauty & Care</small>
          </div>
        </Link>

        <div className="dashboard-sidebar-label">
          CUSTOMER MENU
        </div>

        <nav className="dashboard-nav">
          <Link
            href="/dashboard"
            className="dashboard-nav-link active"
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </Link>

          <Link
            href="/dashboard/appointments"
            className="dashboard-nav-link"
          >
            <CalendarDays size={18} />
            <span>My Appointments</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="dashboard-nav-link"
          >
            <User size={18} />
            <span>My Profile</span>
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <Link
            href="/"
            className="dashboard-home-link"
          >
            <Scissors size={17} />
            Back to SalonBook
          </Link>

          <button
  type="button"
  onClick={handleSignOut}
  className="dashboard-logout"
>
  <LogOut size={17} />
  Sign Out
</button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="dashboard-main">
        {/* Top Header */}
        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-eyebrow">
              CUSTOMER DASHBOARD
            </p>

            <h1>Welcome back 👋</h1>

            <p className="dashboard-subtitle">
              Manage your appointments and salon experience
              from one place.
            </p>
          </div>

          <Link
            href="/services"
            className="dashboard-book-button"
          >
            <CalendarDays size={17} />
            Book Appointment
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          {/* Total */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <CalendarDays size={20} />
            </div>

            <div>
              <span>Total Appointments</span>

              <strong>
                {loading ? "..." : appointments.length}
              </strong>
            </div>
          </div>

          {/* Pending */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon pending">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {loading
                  ? "..."
                  : pendingAppointments.length}
              </strong>
            </div>
          </div>

          {/* Confirmed */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon confirmed">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Confirmed</span>

              <strong>
                {loading
                  ? "..."
                  : confirmedAppointments.length}
              </strong>
            </div>
          </div>

          {/* Unpaid */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon payment">
              <CreditCard size={20} />
            </div>

            <div>
              <span>Unpaid</span>

              <strong>
                {loading
                  ? "..."
                  : unpaidAppointments.length}
              </strong>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="dashboard-content-grid">
          {/* Recent Appointments */}
          <section className="dashboard-panel dashboard-appointments-panel">
            <div className="dashboard-panel-header">
              <div>
                <p>YOUR ACTIVITY</p>

                <h2>Recent Appointments</h2>
              </div>

              <Link href="/dashboard/appointments">
                View All
              </Link>
            </div>

            {/* Loading */}
            {loading && (
              <div className="dashboard-loading">
                <div className="dashboard-loading-spinner" />

                <p>
                  Loading your appointments...
                </p>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              appointments.length === 0 && (
                <div className="dashboard-empty">
                  <div className="dashboard-empty-icon">
                    <CalendarDays size={26} />
                  </div>

                  <h3>No appointments yet</h3>

                  <p>
                    You have not booked any salon
                    appointments. Start your beauty
                    journey today.
                  </p>

                  <Link
                    href="/services"
                    className="dashboard-empty-button"
                  >
                    Browse Services
                  </Link>
                </div>
              )}

            {/* Recent Appointment List */}
            {!loading &&
              recentAppointments.length > 0 && (
                <div className="dashboard-recent-list">
                  {recentAppointments.map(
                    (appointment) => (
                      <div
                        key={appointment._id}
                        className="dashboard-appointment-item"
                      >
                        <div className="dashboard-appointment-icon">
                          <Scissors size={18} />
                        </div>

                        <div className="dashboard-appointment-info">
                          <h3>
                            {appointment.serviceName}
                          </h3>

                          <p>
                            {appointment.category}
                          </p>

                          <div className="dashboard-appointment-meta">
                            <span>
                              <CalendarDays size={13} />
                              {appointment.date}
                            </span>

                            <span>
                              <Clock3 size={13} />
                              {appointment.time}
                            </span>
                          </div>
                        </div>

                        <div className="dashboard-appointment-right">
                          <strong>
                            ৳
                            {appointment.price.toLocaleString()}
                          </strong>

                          <span
                            className={`dashboard-status ${appointment.status}`}
                          >
                            {appointment.status}
                          </span>

                          <span
                            className={`dashboard-payment-status ${appointment.paymentStatus}`}
                          >
                            {appointment.paymentStatus}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
          </section>

          {/* Quick Actions */}
          <section className="dashboard-panel dashboard-actions-panel">
            <div className="dashboard-panel-header">
              <div>
                <p>QUICK ACCESS</p>

                <h2>Quick Actions</h2>
              </div>
            </div>

            <div className="dashboard-actions">
              <Link
                href="/services"
                className="dashboard-action-card"
              >
                <div className="dashboard-action-icon">
                  <Scissors size={20} />
                </div>

                <div>
                  <strong>Browse Services</strong>

                  <span>
                    Explore available salon services
                  </span>
                </div>
              </Link>

              <Link
                href="/dashboard/appointments"
                className="dashboard-action-card"
              >
                <div className="dashboard-action-icon">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <strong>My Appointments</strong>

                  <span>
                    View and manage your bookings
                  </span>
                </div>
              </Link>

              <Link
                href="/dashboard/profile"
                className="dashboard-action-card"
              >
                <div className="dashboard-action-icon">
                  <User size={20} />
                </div>

                <div>
                  <strong>My Profile</strong>

                  <span>
                    Manage your account information
                  </span>
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Bottom Information */}
        <section className="dashboard-info-card">
          <div className="dashboard-info-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <p>THE SALONBOOK EXPERIENCE</p>

            <h2>
              Beauty appointments, made simple.
            </h2>

            <span>
              Choose a service, select your preferred
              time, and let SalonBook take care of the
              rest.
            </span>
          </div>

          <Link href="/services">
            Explore Services
          </Link>
        </section>
      </section>
    </main>
  );
}
