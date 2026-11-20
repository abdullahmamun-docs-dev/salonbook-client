"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Scissors,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role?: "customer" | "admin";
  blocked?: boolean;
};

type Appointment = {
  _id: string;
  serviceName?: string;
  date?: string;
  time?: string;
  status?: string;
  paymentStatus?: string;
};

type Service = {
  _id: string;
  serviceName: string;
  price: number;
  status: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const user = session?.user as AdminUser | undefined;
  const userRole = user?.role ?? null;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sessionLoading || userRole !== "admin") {
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [appointmentsResponse, servicesResponse] =
          await Promise.all([
            fetch(
              "http://localhost:5000/api/appointments/admin/all",
              {
                credentials: "include",
              }
            ),
            fetch(
              "http://localhost:5000/api/services",
              {
                credentials: "include",
              }
            ),
          ]);

        if (appointmentsResponse.ok) {
          const appointmentsData =
            await appointmentsResponse.json();

          setAppointments(appointmentsData);
        }

        if (servicesResponse.ok) {
          const servicesData =
            await servicesResponse.json();

          setServices(servicesData);
        }
      } catch (error) {
        console.error(
          "Admin dashboard data error:",
          error
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadDashboardData();
  }, [sessionLoading, userRole]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  const totalServices = services.length;

  const pendingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed"
  ).length;

  const paidAppointments = appointments.filter(
    (appointment) =>
      appointment.paymentStatus === "paid"
  ).length;

  if (sessionLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loader" />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="admin-access-page">
        <div className="admin-access-card">
          <ShieldCheck size={44} />
          <h1>Admin Access Required</h1>
          <p>Please sign in to access the admin panel.</p>

          <Link
            href="/signin"
            className="admin-primary-button"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="admin-access-page">
        <div className="admin-access-card">
          <ShieldCheck size={44} />
          <h1>Access Denied</h1>
          <p>
            You do not have permission to access the
            admin panel.
          </p>

          <Link
            href="/dashboard"
            className="admin-primary-button"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loader" />
        <p>Preparing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : ""
        }`}
      >
        <div className="admin-sidebar-top">

          <div className="admin-logo">
            <div className="admin-logo-icon">
              <Scissors size={21} />
            </div>

            <div>
              <strong>
                Salon<span>Book</span>
              </strong>
              <small>ADMIN PANEL</small>
            </div>
          </div>

          <button
            type="button"
            className="admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

        </div>

        <div className="admin-sidebar-label">
          MANAGEMENT
        </div>

        <nav className="admin-navigation">

          <Link
            href="/admin"
            className="admin-nav-item admin-nav-active"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/services"
            className="admin-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <Scissors size={18} />
            <span>Manage Services</span>
          </Link>

          <Link
            href="/admin/appointments"
            className="admin-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <CalendarDays size={18} />
            <span>Appointments</span>
          </Link>

          <Link
            href="/admin/users"
            className="admin-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <Users size={18} />
            <span>Customers</span>
          </Link>

          <Link
            href="/admin/transactions"
            className="admin-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <CircleDollarSign size={18} />
            <span>Transactions</span>
          </Link>

          <div className="admin-sidebar-divider" />

          <Link
            href="/admin/profile"
            className="admin-nav-item"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings size={18} />
            <span>My Profile</span>
          </Link>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-user-mini">
            <div className="admin-user-avatar">
              {(user?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.name || "Administrator"}
              </strong>
              <span>Administrator</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="admin-signout"
          >
            <LogOut size={17} />
            Sign Out
          </button>

        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">

          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-button"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div>
              <span className="admin-topbar-label">
                SALONBOOK ADMINISTRATION
              </span>

              <h1>Admin Dashboard</h1>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-status">
              <span />
              System Online
            </div>

            <Link
              href="/"
              className="admin-view-site"
            >
              View Website
              <ChevronRight size={16} />
            </Link>
          </div>

        </header>

        {/* Welcome */}
        <section className="admin-welcome">

          <div>
            <span className="admin-welcome-badge">
              <Sparkles size={14} />
              Welcome back
            </span>

            <h2>
              Hello, {user?.name || "Administrator"} 👋
            </h2>

            <p>
              Manage your salon, appointments, services
              and customers from one place.
            </p>
          </div>

          <Link
            href="/admin/services"
            className="admin-add-service-button"
          >
            <Scissors size={17} />
            Manage Services
          </Link>

        </section>

        {/* Statistics */}
        <section className="admin-stats-grid">

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon purple">
                <Scissors size={21} />
              </div>

              <span className="admin-stat-label">
                SERVICES
              </span>
            </div>

            <strong>{totalServices}</strong>

            <p>
              Active salon services
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon orange">
                <Clock3 size={21} />
              </div>

              <span className="admin-stat-label">
                PENDING
              </span>
            </div>

            <strong>{pendingAppointments}</strong>

            <p>
              Awaiting confirmation
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon green">
                <CheckCircle2 size={21} />
              </div>

              <span className="admin-stat-label">
                CONFIRMED
              </span>
            </div>

            <strong>{confirmedAppointments}</strong>

            <p>
              Confirmed appointments
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-top">
              <div className="admin-stat-icon blue">
                <CircleDollarSign size={21} />
              </div>

              <span className="admin-stat-label">
                PAID
              </span>
            </div>

            <strong>{paidAppointments}</strong>

            <p>
              Successful payments
            </p>
          </div>

        </section>

        {/* Quick Actions */}
        <section className="admin-section">

          <div className="admin-section-heading">
            <div>
              <span>MANAGEMENT</span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="admin-action-grid">

            <Link
              href="/admin/services"
              className="admin-action-card"
            >
              <div className="admin-action-icon purple">
                <Scissors size={22} />
              </div>

              <div>
                <h3>Manage Services</h3>
                <p>
                  Add, update and manage salon services.
                </p>
              </div>

              <ChevronRight size={18} />
            </Link>

            <Link
              href="/admin/appointments"
              className="admin-action-card"
            >
              <div className="admin-action-icon orange">
                <CalendarDays size={22} />
              </div>

              <div>
                <h3>Appointments</h3>
                <p>
                  Review and update customer bookings.
                </p>
              </div>

              <ChevronRight size={18} />
            </Link>

            <Link
              href="/admin/users"
              className="admin-action-card"
            >
              <div className="admin-action-icon blue">
                <UserCog size={22} />
              </div>

              <div>
                <h3>Manage Users</h3>
                <p>
                  Manage customer accounts and access.
                </p>
              </div>

              <ChevronRight size={18} />
            </Link>

            <Link
              href="/admin/transactions"
              className="admin-action-card"
            >
              <div className="admin-action-icon green">
                <CircleDollarSign size={22} />
              </div>

              <div>
                <h3>Transactions</h3>
                <p>
                  Review salon payment transactions.
                </p>
              </div>

              <ChevronRight size={18} />
            </Link>

          </div>
        </section>

        {/* Appointments */}
        <section className="admin-section">

          <div className="admin-section-heading">
            <div>
              <span>BOOKINGS</span>
              <h2>Recent Appointments</h2>
            </div>

            <Link
              href="/admin/appointments"
              className="admin-section-link"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="admin-appointments-card">

            {appointments.length === 0 ? (
              <div className="admin-empty-state">

                <div className="admin-empty-icon">
                  <CalendarDays size={30} />
                </div>

                <h3>No appointments yet</h3>

                <p>
                  Customer appointments will appear here
                  once they make a booking.
                </p>

                <Link
                  href="/admin/appointments"
                  className="admin-outline-button"
                >
                  Manage Appointments
                </Link>

              </div>
            ) : (
              <div className="admin-table-wrapper">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments
                      .slice(0, 5)
                      .map((appointment) => (
                        <tr key={appointment._id}>

                          <td>
                            <strong>
                              {appointment.serviceName ||
                                "Service"}
                            </strong>
                          </td>

                          <td>
                            {appointment.date || "-"}
                          </td>

                          <td>
                            {appointment.time || "-"}
                          </td>

                          <td>
                            <span
                              className={`admin-status-badge ${
                                appointment.status
                                  ?.toLowerCase()
                              }`}
                            >
                              {appointment.status ||
                                "Pending"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`admin-payment-badge ${
                                appointment.paymentStatus
                                  ?.toLowerCase()
                              }`}
                            >
                              {appointment.paymentStatus ||
                                "Unpaid"}
                            </span>
                          </td>

                        </tr>
                      ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        </section>

        {/* Bottom Summary */}
        <section className="admin-bottom-grid">

          <div className="admin-summary-card">

            <div className="admin-summary-icon">
              <CalendarDays size={21} />
            </div>

            <div>
              <span>Total Appointments</span>
              <strong>{appointments.length}</strong>
            </div>

          </div>

          <div className="admin-summary-card">

            <div className="admin-summary-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Confirmed Appointments</span>
              <strong>
                {confirmedAppointments}
              </strong>
            </div>

          </div>

          <div className="admin-summary-card">

            <div className="admin-summary-icon blue">
              <CircleDollarSign size={21} />
            </div>

            <div>
              <span>Paid Appointments</span>
              <strong>
                {paidAppointments}
              </strong>
            </div>

          </div>

        </section>

        <footer className="admin-footer">
          <p>
            © 2026 SalonBook. Admin Panel.
          </p>

          <span>
            Secure Management System
          </span>
        </footer>

      </main>
    </div>
  );
}