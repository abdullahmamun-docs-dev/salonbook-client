
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  LogIn,
  LogOut,
  Menu,
  Scissors,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const dashboardLink =
    session?.user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="salon-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
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

        {/* Desktop Navigation */}
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

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {isPending ? (
            <span className="navbar-auth-loading">Loading...</span>
          ) : session?.user ? (
            <>
              <Link href={dashboardLink} className="navbar-dashboard">
                <span>{session.user.name || "Dashboard"}</span>
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
              <Link href="/signin" className="navbar-signin">
                <LogIn size={15} />
                Sign In
              </Link>

              <Link href="/signup" className="navbar-signup">
                <span>Sign Up</span>
              </Link>
            </>
          )}

          <Link href="/services" className="navbar-book">
            <CalendarDays size={16} />
            Book Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="navbar-menu"
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-navbar">
          <nav className="mobile-navbar-links">
            <Link
              href="/"
              className="mobile-navbar-link"
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              href="/services"
              className="mobile-navbar-link"
              onClick={closeMenu}
            >
              Services
            </Link>

            <Link
              href="/about"
              className="mobile-navbar-link"
              onClick={closeMenu}
            >
              About
            </Link>

            <Link
              href="/contact"
              className="mobile-navbar-link"
              onClick={closeMenu}
            >
              Contact
            </Link>
          </nav>

          <div className="mobile-navbar-actions">
            {isPending ? (
              <span className="mobile-auth-loading">Loading...</span>
            ) : session?.user ? (
              <>
                <Link
                  href={dashboardLink}
                  className="mobile-dashboard-link"
                  onClick={closeMenu}
                >
                  {session.user.name || "Dashboard"}
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    handleSignOut();
                  }}
                  className="mobile-signout-button"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="mobile-signin-link"
                  onClick={closeMenu}
                >
                  <LogIn size={16} />
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="mobile-signup-link"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link
              href="/services"
              className="mobile-book-link"
              onClick={closeMenu}
            >
              <CalendarDays size={17} />
              Book an Appointment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
