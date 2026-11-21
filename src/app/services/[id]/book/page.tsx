"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Scissors,
  Sparkles,
} from "lucide-react";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

export default function BookAppointmentPage() {
  const params = useParams();
  const id = params?.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          // `http://localhost:5000/api/services/${id}`
          `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`
        );

        if (!response.ok) {
          throw new Error("Service not found");
        }

        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load this service.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!service) return;

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        // "http://localhost:5000/api/appointments",
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: service._id,
            date,
            time,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create appointment"
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* Loading */
  if (loading) {
    return (
      <main className="booking-page">
        <Navbar />

        <section className="booking-loading">
          <div className="booking-loading-card">
            <div className="booking-loading-image" />

            <div className="booking-loading-content">
              <div className="booking-loading-line small" />
              <div className="booking-loading-line large" />
              <div className="booking-loading-line medium" />
              <div className="booking-loading-box" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* Service not found */
  if (!service) {
    return (
      <main className="booking-page">
        <Navbar />

        <section className="booking-empty">
          <div className="booking-empty-icon">
            <Scissors size={30} />
          </div>

          <p className="booking-eyebrow">
            SalonBook
          </p>

          <h1>Service not found</h1>

          <p>
            {error || "This service is not available right now."}
          </p>

          <Link href="/services" className="booking-dark-button">
            <ArrowLeft size={17} />
            Back to Services
          </Link>
        </section>
      </main>
    );
  }

  /* Success */
  if (submitted) {
    return (
      <main className="booking-page">
        <Navbar />

        <section className="booking-success-section">
          <div className="booking-success-card">

            <div className="booking-success-icon">
              <CheckCircle2 size={34} strokeWidth={2} />
            </div>

            <p className="booking-eyebrow">
              Appointment Confirmed
            </p>

            <h1>Appointment requested</h1>

            <p className="booking-success-description">
              Your appointment request has been submitted
              successfully. It is currently waiting for salon
              confirmation.
            </p>

            <div className="booking-success-service">
              <div className="booking-success-service-image">
                <img
                  src={service.image}
                  alt={service.serviceName}
                />
              </div>

              <div className="booking-success-service-info">
                <span>{service.category}</span>

                <h2>{service.serviceName}</h2>

                <div className="booking-success-duration">
                  <Clock3 size={15} />
                  {service.duration} minutes
                </div>
              </div>
            </div>

            <div className="booking-summary">
              <div className="booking-summary-item">
                <span>Date</span>
                <strong>{date}</strong>
              </div>

              <div className="booking-summary-divider" />

              <div className="booking-summary-item">
                <span>Time</span>
                <strong>{time}</strong>
              </div>
            </div>

            <div className="booking-status-row">
              <div>
                <span>Status</span>
                <strong className="pending-status">
                  Pending
                </strong>
              </div>

              <div>
                <span>Payment</span>
                <strong className="unpaid-status">
                  Unpaid
                </strong>
              </div>
            </div>

            <div className="booking-success-note">
              <Sparkles size={17} />

              <p>
                Payment will become available only after the
                salon confirms your appointment.
              </p>
            </div>

            <div className="booking-success-actions">
              <Link
                href="/dashboard"
                className="booking-dark-button"
              >
                My Dashboard
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/services"
                className="booking-light-button"
              >
                Browse Services
              </Link>
            </div>

          </div>
        </section>
      </main>
    );
  }

  /* Booking form */
  return (
    <main className="booking-page">
      <Navbar />

      <section className="booking-hero">
        <div className="booking-container">

          <Link
            href={`/services/${service._id}`}
            className="booking-back-link"
          >
            <ArrowLeft size={16} />
            Back to Service
          </Link>

          <div className="booking-heading">
            <div>
              <p className="booking-eyebrow">
                SalonBook · Appointment
              </p>

              <h1>Book your appointment</h1>

              <p>
                Choose your preferred date and time for a
                relaxing salon experience.
              </p>
            </div>

            <div className="booking-heading-badge">
              <CalendarDays size={17} />
              Easy Booking
            </div>
          </div>

          <div className="booking-grid">

            {/* Service Card */}
            <aside className="booking-service-card">

              <div className="booking-service-image">
                <img
                  src={service.image}
                  alt={service.serviceName}
                />

                <div className="booking-image-overlay" />

                <span className="booking-service-badge">
                  {service.category}
                </span>
              </div>

              <div className="booking-service-body">

                <p className="booking-service-label">
                  SELECTED SERVICE
                </p>

                <h2>{service.serviceName}</h2>

                <p className="booking-service-description">
                  {service.description}
                </p>

                <div className="booking-service-info">

                  <div>
                    <Clock3 size={18} />

                    <div>
                      <span>Duration</span>
                      <strong>
                        {service.duration} min
                      </strong>
                    </div>
                  </div>

                  <div>
                    <span className="booking-price-label">
                      Price
                    </span>

                    <strong className="booking-price">
                      ৳{service.price.toLocaleString()}
                    </strong>
                  </div>

                </div>

                <div className="booking-service-divider" />

                <div className="booking-service-footer">
                  <CheckCircle2 size={17} />
                  Professional salon service
                </div>

                <div className="booking-service-footer">
                  <CheckCircle2 size={17} />
                  Flexible appointment scheduling
                </div>

              </div>
            </aside>

            {/* Form */}
            <section className="booking-form-card">

              <div className="booking-form-header">
                <div className="booking-form-number">
                  01
                </div>

                <div>
                  <p>Appointment details</p>
                  <h2>Choose your preferred time</h2>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="booking-form"
              >

                {error && (
                  <div className="booking-error">
                    {error}
                  </div>
                )}

                {/* Date + Time */}
                <div className="booking-fields-grid">

                  <div className="booking-field">
                    <label htmlFor="date">
                      Preferred Date
                    </label>

                    <div className="booking-input-wrapper">
                      <CalendarDays size={18} />

                      <input
                        id="date"
                        type="date"
                        required
                        min={today}
                        value={date}
                        onChange={(event) =>
                          setDate(event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="booking-field">
                    <label htmlFor="time">
                      Preferred Time
                    </label>

                    <div className="booking-input-wrapper">
                      <Clock3 size={18} />

                      <select
                        id="time"
                        required
                        value={time}
                        onChange={(event) =>
                          setTime(event.target.value)
                        }
                      >
                        <option value="">
                          Select a time
                        </option>

                        {TIME_SLOTS.map((slot) => (
                          <option
                            key={slot}
                            value={slot}
                          >
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Notes */}
                <div className="booking-field">
                  <div className="booking-label-row">
                    <label htmlFor="notes">
                      Additional Notes
                    </label>

                    <span>Optional</span>
                  </div>

                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                    placeholder="Anything we should know before your appointment?"
                    rows={6}
                  />
                </div>

                {/* Policy */}
                <div className="booking-policy">
                  <div className="booking-policy-icon">
                    <Sparkles size={17} />
                  </div>

                  <div>
                    <h3>Appointment policy</h3>

                    <p>
                      Your request will initially remain
                      pending. Once the salon confirms your
                      appointment, payment will become
                      available.
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="booking-submit"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={19}
                        className="booking-spinner"
                      />
                      Requesting Appointment...
                    </>
                  ) : (
                    <>
                      <CalendarDays size={19} />
                      Request Appointment
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="booking-secure-text">
                  Your appointment information is securely
                  associated with your account.
                </p>

              </form>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}