"use client";

import Link from "next/link";
import { CalendarDays, LogIn, LogOut, Menu, Scissors } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <header className="salon-navbar">
      <div className="navbar-container">

        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Scissors size={19} strokeWidth={1.8} />
          </div>

          <div className="navbar-brand">
            <p>
              Salon<span>Book</span>
            </p>
            <small>Beauty & Care</small>
          </div>
        </Link>

        <nav className="navbar-links">
          <Link href="/" className="navbar-link active">
            Home
          </Link>

          <Link href="/services" className="navbar-link">
            Services
          </Link>

          <Link href="/about" className="navbar-link">
            About
          </Link>

          <Link href="/contact" className="navbar-link">
            Contact
          </Link>
        </nav>

        <div className="navbar-actions">
          {isPending ? (
            <span className="navbar-auth-loading">
              Loading...
            </span>
          ) : session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="navbar-dashboard"
              >
                <span>
                  {session.user.name || "Dashboard"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="navbar-signout"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="navbar-signin"
              >
                <LogIn size={15} />
                Sign In
              </Link>

              <Link
                href="/signup"
                className="navbar-signup"
              >
                <span>Sign Up</span>
              </Link>
            </>
          )}

          <Link
            href="/services"
            className="navbar-book"
          >
            <CalendarDays size={16} />
            Book Now
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            className="navbar-menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}