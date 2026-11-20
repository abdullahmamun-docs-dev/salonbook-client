"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Mail,
  Save,
  Scissors,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type UserProfile = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data?.user) {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
          });

          setName(data.user.name || "");
          setImage(data.user.image || "");
        }
      } catch (error) {
        console.error("Profile loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpdateProfile = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (!trimmedName) {
      toast.error("Please enter your full name.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || null,
      });

      if (error) {
        throw new Error(
          error.message || "Failed to update profile"
        );
      }

      const { data } = await authClient.getSession();

      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        });

        setName(data.user.name || "");
        setImage(data.user.image || "");
      }

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const displayName = user?.name || "SalonBook User";

  const firstLetter = displayName
    .charAt(0)
    .toUpperCase();

  return (
    <main className="profile-page">
      <aside className="profile-sidebar">
        <Link href="/" className="profile-brand">
          <div className="profile-brand-icon">
            <Scissors size={20} />
          </div>

          <div>
            <p>
              Salon<span>Book</span>
            </p>

            <small>Beauty & Care</small>
          </div>
        </Link>

        <div className="profile-sidebar-label">
          CUSTOMER MENU
        </div>

        <nav className="profile-nav">
          <Link
            href="/dashboard"
            className="profile-nav-link"
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          <Link
            href="/dashboard/appointments"
            className="profile-nav-link"
          >
            <CalendarDays size={18} />
            My Appointments
          </Link>

          <Link
            href="/dashboard/profile"
            className="profile-nav-link active"
          >
            <User size={18} />
            My Profile
          </Link>
        </nav>

        <div className="profile-sidebar-bottom">
          <Link href="/" className="profile-back-home">
            <Scissors size={16} />
            Back to SalonBook
          </Link>

          <button
            type="button"
            className="profile-logout"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <section className="profile-main">
        <div className="profile-topbar">
          <div>
            <p className="profile-eyebrow">
              ADMIN DASHBOARD
            </p>

            <h1>My Profile</h1>

            <p className="profile-subtitle">
              Manage your SalonBook account information.
            </p>
          </div>

          <Link
            href="/services"
            className="profile-book-button"
          >
            <CalendarDays size={17} />
            Book Appointment
          </Link>
        </div>

        {loading ? (
          <div className="profile-loading">
            <div className="profile-loading-spinner" />
            <p>Loading your profile...</p>
          </div>
        ) : !user ? (
          <div className="profile-empty">
            <div className="profile-empty-icon">
              <User size={28} />
            </div>

            <h2>Profile unavailable</h2>

            <p>
              Please sign in to view your profile.
            </p>

            <Link
              href="/signin"
              className="profile-dark-button"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="profile-content">
            <section className="profile-card profile-overview-card">
              <div className="profile-card-header">
                <div>
                  <p>ACCOUNT</p>
                  <h2>Profile Overview</h2>
                </div>

                <span className="profile-active-badge">
                  <CheckCircle2 size={13} />
                  Active
                </span>
              </div>

              <div className="profile-user-area">
                <div className="profile-avatar">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={displayName}
                    />
                  ) : (
                    firstLetter
                  )}
                </div>

                <div className="profile-user-info">
                  <h2>{displayName}</h2>

                  <div className="profile-user-email">
                    <Mail size={15} />
                    {user.email}
                  </div>

                  <span className="profile-role">
                    Customer Account
                  </span>
                </div>
              </div>
            </section>

            <section className="profile-card">
              <div className="profile-card-header">
                <div>
                  <p>EDIT PROFILE</p>
                  <h2>Personal Information</h2>
                </div>
              </div>

              <form
                onSubmit={handleUpdateProfile}
                className="profile-edit-form"
              >
                <div className="profile-form-group">
                  <label htmlFor="profile-name">
                    Full Name
                  </label>

                  <div className="profile-input-wrapper">
                    <User size={17} />

                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="profile-email">
                    Email Address
                  </label>

                  <div className="profile-input-wrapper profile-input-disabled">
                    <Mail size={17} />

                    <input
                      id="profile-email"
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </div>

                  <small>
                    Email is managed by your authentication
                    account.
                  </small>
                </div>

                <div className="profile-form-group">
                  <label htmlFor="profile-image">
                    Profile Image URL
                  </label>

                  <div className="profile-input-wrapper">
                    <User size={17} />

                    <input
                      id="profile-image"
                      type="url"
                      value={image}
                      onChange={(event) =>
                        setImage(event.target.value)
                      }
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>

                  <small>
                    You can add a public image URL. Leave
                    empty to use your initial.
                  </small>
                </div>

                <div className="profile-form-preview">
                  <div className="profile-preview-avatar">
                    {image ? (
                      <img
                        src={image}
                        alt="Profile preview"
                      />
                    ) : (
                      firstLetter
                    )}
                  </div>

                  <div>
                    <strong>Profile Preview</strong>

                    <span>
                      {name.trim() || "Your Name"}
                    </span>
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    <Save size={17} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>

            <section className="profile-card">
              <div className="profile-card-header">
                <div>
                  <p>ACCOUNT INFORMATION</p>
                  <h2>Account Details</h2>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-detail-item">
                  <div className="profile-detail-icon">
                    <User size={17} />
                  </div>

                  <div>
                    <span>Full Name</span>
                    <strong>{displayName}</strong>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <div className="profile-detail-icon">
                    <Mail size={17} />
                  </div>

                  <div>
                    <span>Email Address</span>
                    <strong>{user.email}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-security-card">
              <div className="profile-security-icon">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <p>ACCOUNT SECURITY</p>

                <h3>
                  Your account is securely connected.
                </h3>

                <span>
                  SalonBook uses Better Auth to manage your
                  authentication and account session.
                </span>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}