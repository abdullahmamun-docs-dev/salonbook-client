"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Mail,
  Save,
  Scissors,
  Settings,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role?: "customer" | "admin";
  blocked?: boolean;
};

export default function AdminProfilePage() {
  const router = useRouter();

  const {
    data: session,
    isPending: sessionLoading,
  } = authClient.useSession();

  const currentUser = session?.user as AdminUser | undefined;

  /*
   * Keep local form state separate from session state.
   * null means: user has not edited this field yet.
   */
  const [editedName, setEditedName] = useState<string | null>(
    null
  );

  const [editedImage, setEditedImage] = useState<string | null>(
    null
  );

  const [saving, setSaving] = useState(false);

  const name =
    editedName ?? currentUser?.name ?? "";

  const image =
    editedImage ?? currentUser?.image ?? "";

  const displayName =
    name.trim() || "Administrator";

  const firstLetter =
    displayName.charAt(0).toUpperCase() || "A";

  /* ================= SAVE PROFILE ================= */

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in again.");
      return;
    }

    if (currentUser.role !== "admin") {
      toast.error("Admin access required.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (result.error) {
        toast.error(
          result.error.message ||
            "Failed to update profile."
        );
        return;
      }

      /*
       * Keep the newly saved values in local state
       * so the preview immediately reflects the update.
       */
      setEditedName(name.trim());
      setEditedImage(image.trim());

      toast.success(
        "Admin profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Admin profile update error:",
        error
      );

      toast.error(
        "Something went wrong while updating your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= SIGN OUT ================= */

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  /* ================= LOADING ================= */

  if (sessionLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loader" />

        <p>Loading admin profile...</p>
      </div>
    );
  }

  /* ================= NOT LOGGED IN ================= */

  if (!currentUser) {
    return (
      <div className="admin-access-page">
        <div className="admin-access-card">
          <ShieldCheck size={46} />

          <h1>Admin Access Required</h1>

          <p>
            Please sign in to access your administrator
            profile.
          </p>

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

  /* ================= NOT ADMIN ================= */

  if (currentUser.role !== "admin") {
    return (
      <div className="admin-access-page">
        <div className="admin-access-card">
          <ShieldCheck size={46} />

          <h1>Access Denied</h1>

          <p>
            This page is only available to
            administrators.
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

  return (
    <div className="admin-layout">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="admin-sidebar">

        {/* Logo */}

        <div className="admin-sidebar-top">
          <Link
            href="/admin"
            className="admin-logo"
          >
            <div className="admin-logo-icon">
              <Scissors
                size={21}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <strong>
                Salon<span>Book</span>
              </strong>

              <small>ADMIN PANEL</small>
            </div>
          </Link>
        </div>

        {/* Navigation */}

        <div className="admin-sidebar-label">
          MANAGEMENT
        </div>

        <nav className="admin-navigation">

          <Link
            href="/admin"
            className="admin-nav-item"
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </Link>

          <Link
            href="/admin/services"
            className="admin-nav-item"
          >
            <Scissors size={18} />
            <span>Manage Services</span>
          </Link>

          <Link
            href="/admin/appointments"
            className="admin-nav-item"
          >
            <CalendarDays size={18} />
            <span>Appointments</span>
          </Link>

          <Link
            href="/admin/users"
            className="admin-nav-item"
          >
            <Users size={18} />
            <span>Customers</span>
          </Link>

          <Link
            href="/admin/transactions"
            className="admin-nav-item"
          >
            <CircleDollarSign size={18} />
            <span>Transactions</span>
          </Link>

          <div className="admin-sidebar-divider" />

          <Link
            href="/admin/profile"
            className="admin-nav-item admin-nav-active"
          >
            <Settings size={18} />
            <span>My Profile</span>
          </Link>

        </nav>

        {/* Sidebar Bottom */}

        <div className="admin-sidebar-bottom">

          <div className="admin-user-mini">

            <div className="admin-user-avatar">
              {image.trim() ? (
                <img
                  src={image.trim()}
                  alt={displayName}
                />
              ) : (
                firstLetter
              )}
            </div>

            <div>
              <strong>{displayName}</strong>

              <span>
                Administrator
              </span>
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

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="admin-main">

        {/* Topbar */}

        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <div>

              <span className="admin-topbar-label">
                SALONBOOK ADMINISTRATION
              </span>

              <h1>My Profile</h1>

            </div>

          </div>

          <div className="admin-topbar-right">

            <Link
              href="/admin"
              className="admin-view-site"
            >
              <ArrowLeft size={16} />

              Dashboard
            </Link>

          </div>

        </header>

        {/* ==================================================
            WELCOME
        ================================================== */}

        <section className="admin-welcome">

          <div>

            <span className="admin-welcome-badge">
              <ShieldCheck size={14} />

              Administrator Profile
            </span>

            <h2>
              Welcome, {displayName} 👋
            </h2>

            <p>
              Manage your administrator profile
              information from here.
            </p>

          </div>

        </section>

        {/* ==================================================
            PROFILE SECTION
        ================================================== */}

        <section className="admin-profile-page">

          <div className="admin-profile-grid">

            {/* ==================================================
                PROFILE PREVIEW
            ================================================== */}

            <div className="admin-profile-card admin-profile-preview-card">

              <div className="admin-profile-card-heading">

                <div>

                  <span>
                    PROFILE
                  </span>

                  <h2>
                    Profile Preview
                  </h2>

                </div>

              </div>

              <div className="admin-profile-preview">

                {/* Avatar */}

                <div className="admin-profile-avatar-large">

                  {image.trim() ? (
                    <img
                      src={image.trim()}
                      alt={displayName}
                    />
                  ) : (
                    <span>
                      {firstLetter}
                    </span>
                  )}

                  <div className="admin-profile-camera">
                    <Camera size={15} />
                  </div>

                </div>

                <h3>
                  {displayName}
                </h3>

                <p>
                  {currentUser.email}
                </p>

                <span className="admin-profile-role">
                  <ShieldCheck size={14} />

                  Administrator
                </span>

              </div>

              {/* Security */}

              <div className="admin-profile-security">

                <div className="admin-security-icon">
                  <CheckCircle2 size={18} />
                </div>

                <div>

                  <strong>
                    Account Protected
                  </strong>

                  <p>
                    Your role and account access
                    cannot be changed from this page.
                  </p>

                </div>

              </div>

            </div>

            {/* ==================================================
                EDIT PROFILE
            ================================================== */}

            <div className="admin-profile-card">

              <div className="admin-profile-card-heading">

                <div>

                  <span>
                    ACCOUNT INFORMATION
                  </span>

                  <h2>
                    Edit Profile
                  </h2>

                </div>

              </div>

              <form
                onSubmit={handleSave}
                className="admin-profile-form"
              >

                {/* ================= NAME ================= */}

                <div className="admin-profile-form-group">

                  <label htmlFor="admin-name">
                    Full Name
                  </label>

                  <div className="admin-profile-input-wrapper">

                    <User size={17} />

                    <input
                      id="admin-name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setEditedName(
                          event.target.value
                        )
                      }
                      placeholder="Enter your full name"
                    />

                  </div>

                </div>

                {/* ================= EMAIL ================= */}

                <div className="admin-profile-form-group">

                  <label htmlFor="admin-email">
                    Email Address
                  </label>

                  <div className="admin-profile-input-wrapper">

                    <Mail size={17} />

                    <input
                      id="admin-email"
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="admin-profile-input-disabled"
                    />

                  </div>

                  <small>
                    Email cannot be changed from
                    this page.
                  </small>

                </div>

                {/* ================= IMAGE ================= */}

                <div className="admin-profile-form-group">

                  <label htmlFor="admin-image">
                    Profile Image URL
                  </label>

                  <div className="admin-profile-input-wrapper">

                    <Camera size={17} />

                    <input
                      id="admin-image"
                      type="url"
                      value={image}
                      onChange={(event) =>
                        setEditedImage(
                          event.target.value
                        )
                      }
                      placeholder="Paste your ImgBB image URL"
                    />

                  </div>

                  <small>
                    Paste the image URL uploaded
                    to ImgBB.
                  </small>

                </div>

                {/* ================= PROTECTED ================= */}

                <div className="admin-protected-fields">

                  <div className="admin-protected-item">

                    <span>
                      Role
                    </span>

                    <strong>
                      <ShieldCheck size={14} />

                      Administrator
                    </strong>

                  </div>

                  <div className="admin-protected-item">

                    <span>
                      Account Status
                    </span>

                    <strong
                      className={
                        currentUser.blocked
                          ? "admin-status-blocked"
                          : "admin-status-active"
                      }
                    >
                      <CheckCircle2 size={14} />

                      {currentUser.blocked
                        ? "Blocked"
                        : "Active"}
                    </strong>

                  </div>

                </div>

                {/* ================= SAVE ================= */}

                <div className="admin-profile-form-actions">

                  <button
                    type="submit"
                    disabled={saving}
                    className="admin-profile-save-button"
                  >

                    {saving ? (
                      <>
                        <span className="admin-button-spinner" />

                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={17} />

                        Save Changes
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </section>

        {/* ==================================================
            FOOTER
        ================================================== */}

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