
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

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Unable to sign in.");
      setLoading(false);
      return;
    }

    window.location.href = "/";
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });


//     const { error } = await authClient.signIn.social({
//   provider: "google",
//   callbackURL: "http://localhost:3000/",
// });

    if (error) {
      setError(error.message || "Unable to sign in with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-layout">

        {/* Left Visual */}
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
                Welcome back
              </p>

              <h1>
                Your next beautiful experience is waiting.
              </h1>

              <p>
                Sign in to manage your appointments, discover salon
                services, and keep your beauty journey organized.
              </p>
            </div>

            <p className="auth-copyright">
              © {new Date().getFullYear()} SalonBook
            </p>
          </div>
        </section>

        {/* Sign In Form */}
        <section className="auth-form-section">
          <div className="auth-form-wrapper">

            {/* Mobile Logo */}
            <div className="auth-mobile-logo">
              <Link href="/" className="auth-logo auth-logo-dark">
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

            <div className="auth-heading">
              <p className="auth-heading-label">
                Welcome back
              </p>

              <h2>
                Sign in to your account
              </h2>

              <p>
                Continue your SalonBook journey and manage your
                appointments with ease.
              </p>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="auth-google-button"
            >
              {googleLoading ? (
                <>
                  <LoaderCircle
                    className="auth-spinner"
                    size={18}
                  />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <span className="auth-google-icon">
                    G
                  </span>
                  Continue with Google
                </>
              )}
            </button>

            <div className="auth-divider">
              <span>or continue with email</span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >
              {/* Email */}
              <div className="auth-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword((value) => !value)
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

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="auth-submit"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      className="auth-spinner"
                      size={18}
                    />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="auth-switch">
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                Create one
              </Link>
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
