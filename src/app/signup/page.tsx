"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Scissors,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        console.error(
          "Better Auth signup error:",
          result.error
        );

        setError(
          result.error.message ||
            "Unable to create account. Please check your information and try again."
        );

        return;
      }

      // Signup successful
      window.location.href = "/";
    } catch (error) {
      console.error(
        "Signup request failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-layout">
        {/* Left visual section */}
        <section className="auth-visual">
          <div className="auth-visual-glow" />

          <div className="auth-visual-content">
            <Link href="/" className="auth-logo">
              <div className="auth-logo-icon">
                <Scissors size={20} />
              </div>

              <div>
                <p className="auth-logo-name">
                  Salon<span>Book</span>
                </p>

                <p className="auth-logo-tagline">
                  Beauty & Care
                </p>
              </div>
            </Link>

            <div className="auth-hero-copy">
              <p className="auth-eyebrow">
                Your beauty journey
              </p>

              <h1>
                A better way to book your salon
                experience.
              </h1>

              <p>
                Create your SalonBook account and
                discover services, appointments,
                and a smoother salon experience in
                one place.
              </p>
            </div>

            <p className="auth-copyright">
              © {new Date().getFullYear()} SalonBook
            </p>
          </div>
        </section>

        {/* Form section */}
        <section className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Mobile logo */}
            <div className="auth-mobile-logo">
              <Link
                href="/"
                className="auth-logo auth-logo-dark"
              >
                <div className="auth-logo-icon">
                  <Scissors size={18} />
                </div>

                <div>
                  <p className="auth-logo-name">
                    Salon<span>Book</span>
                  </p>

                  <p className="auth-logo-tagline">
                    Beauty & Care
                  </p>
                </div>
              </Link>
            </div>

            {/* Heading */}
            <div className="auth-heading">
              <p className="auth-heading-label">
                Welcome
              </p>

              <h2>Create your account</h2>

              <p>
                Join SalonBook to discover services
                and manage your appointments.
              </p>
            </div>

            {/* Signup form */}
            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >
              {/* Name */}
              <div className="auth-field">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="auth-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div className="auth-field">
                <label htmlFor="password">
                  Password
                </label>

                <div className="auth-password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Minimum 8 characters"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="auth-password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="auth-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="auth-submit"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      className="auth-spinner"
                      size={18}
                    />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Sign in */}
            <p className="auth-switch">
              Already have an account?{" "}
              <Link href="/signin">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}