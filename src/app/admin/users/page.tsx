
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  blocked: boolean;
  emailVerified: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  useEffect(() => {
    if (sessionLoading || !session?.user) {
      return;
    }

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/users/admin/all",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch users"
          );
        }

        setUsers(data);
      } catch (error) {
        console.error("Fetch users error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch users"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [sessionLoading, session]);

  const handleUserStatus = async (
    userId: string,
    blocked: boolean
  ) => {
    try {
      setActionId(userId);
      setError("");

      const endpoint = blocked
        ? `http://localhost:5000/api/users/${userId}/unblock`
        : `http://localhost:5000/api/users/${userId}/block`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update user"
        );
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                blocked: !blocked,
              }
            : user
        )
      );
    } catch (error) {
      console.error("Update user status error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update user"
      );
    } finally {
      setActionId("");
    }
  };

  if (sessionLoading) {
    return (
      <main className="admin-page">
        <div className="admin-loading">
          <Loader2 size={28} className="admin-spinner" />
          <p>Checking admin access...</p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="admin-page">
        <div className="admin-error-state">
          <ShieldCheck size={42} />
          <h2>Authentication Required</h2>
          <p>Please sign in to access this page.</p>
          <Link href="/signin" className="admin-back-button">
            Go to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        {/* ===============================
            HEADER
        =============================== */}
        <div className="admin-page-header">
          <div>
            <Link href="/admin" className="admin-back-link">
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="admin-page-title-row">
              <div className="admin-page-icon">
                <Users size={22} />
              </div>

              <div>
                <h1>Manage Users</h1>
                <p>
                  View and manage registered SalonBook users.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===============================
            ERROR
        =============================== */}
        {error && (
          <div className="admin-alert admin-alert-error">
            <Ban size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* ===============================
            SUMMARY
        =============================== */}
        <div className="admin-user-stats">
          <div className="admin-user-stat-card">
            <div className="admin-user-stat-icon">
              <Users size={20} />
            </div>

            <div>
              <span>Total Users</span>
              <strong>{users.length}</strong>
            </div>
          </div>

          <div className="admin-user-stat-card">
            <div className="admin-user-stat-icon">
              <UserRound size={20} />
            </div>

            <div>
              <span>Customers</span>
              <strong>
                {users.filter(
                  (user) => user.role === "customer"
                ).length}
              </strong>
            </div>
          </div>

          <div className="admin-user-stat-card">
            <div className="admin-user-stat-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <span>Admins</span>
              <strong>
                {users.filter(
                  (user) => user.role === "admin"
                ).length}
              </strong>
            </div>
          </div>

          <div className="admin-user-stat-card">
            <div className="admin-user-stat-icon">
              <Ban size={20} />
            </div>

            <div>
              <span>Blocked</span>
              <strong>
                {users.filter(
                  (user) => user.blocked
                ).length}
              </strong>
            </div>
          </div>
        </div>

        {/* ===============================
            USERS TABLE
        =============================== */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>All Users</h2>
              <p>
                Manage customer access and account status.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">
              <Loader2
                size={28}
                className="admin-spinner"
              />
              <p>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="admin-empty-state">
              <Users size={40} />
              <h3>No users found</h3>
              <p>
                There are currently no registered users.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="admin-user-info">
                          <div className="admin-user-avatar">
                            {user.name
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </div>

                          <div>
                            <strong>
                              {user.name || "Unnamed User"}
                            </strong>

                            <span>
                              {user.emailVerified
                                ? "Verified"
                                : "Not verified"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-user-email">
                          {user.email}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-role-badge ${
                            user.role === "admin"
                              ? "admin-role-admin"
                              : "admin-role-customer"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${
                            user.blocked
                              ? "admin-status-blocked"
                              : "admin-status-active"
                          }`}
                        >
                          {user.blocked
                            ? "Blocked"
                            : "Active"}
                        </span>
                      </td>

                      <td>
                        <span className="admin-date">
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        {user.role === "admin" ? (
                          <span className="admin-protected-label">
                            <ShieldCheck size={15} />
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              actionId === user._id
                            }
                            onClick={() =>
                              handleUserStatus(
                                user._id,
                                user.blocked
                              )
                            }
                            className={`admin-user-action ${
                              user.blocked
                                ? "admin-unblock-button"
                                : "admin-block-button"
                            }`}
                          >
                            {actionId === user._id ? (
                              <>
                                <Loader2
                                  size={15}
                                  className="admin-spinner"
                                />
                                Updating...
                              </>
                            ) : user.blocked ? (
                              <>
                                <CheckCircle2 size={15} />
                                Unblock
                              </>
                            ) : (
                              <>
                                <Ban size={15} />
                                Block
                              </>
                            )}
                          </button>
                        )}
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
