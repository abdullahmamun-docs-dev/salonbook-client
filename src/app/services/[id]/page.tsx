"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
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

export default function ServiceDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/services/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Service not found");
          }

          throw new Error("Failed to fetch service");
        }

        const data = await response.json();

        setService(data);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  /* =========================
     LOADING STATE
  ========================= */

  if (loading) {
    return (
      <main className="service-details-page">
        <Navbar />

        <section className="service-details-loading">
          <div className="service-details-container">
            <div className="details-skeleton-grid">
              <div className="details-skeleton-image" />

              <div className="details-skeleton-content">
                <div className="details-skeleton-category" />
                <div className="details-skeleton-title" />
                <div className="details-skeleton-description" />

                <div className="details-skeleton-price" />

                <div className="details-skeleton-benefits">
                  <div />
                  <div />
                  <div />
                </div>

                <div className="details-skeleton-button" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */

  if (error || !service) {
    return (
      <main className="service-details-page">
        <Navbar />

        <section className="service-details-error-section">
          <div className="service-details-error">
            <div className="service-error-icon">
              <Scissors size={28} />
            </div>

            <p className="service-error-label">
              SERVICE UNAVAILABLE
            </p>

            <h1>Service not found</h1>

            <p className="service-error-description">
              The service you are looking for may have been removed or is
              currently unavailable.
            </p>

            <Link
              href="/services"
              className="service-back-button"
            >
              <ArrowLeft size={17} />
              Back to Services
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* =========================
     SERVICE DETAILS
  ========================= */

  return (
    <main className="service-details-page">
      <Navbar />

      {/* =========================
          BREADCRUMB
      ========================= */}

      <section className="details-breadcrumb-section">
        <div className="service-details-container">
          <Link
            href="/services"
            className="details-back-link"
          >
            <ArrowLeft size={16} />
            Back to Services
          </Link>
        </div>
      </section>

      {/* =========================
          MAIN DETAILS
      ========================= */}

      <section className="service-details-section">
        <div className="service-details-container">
          <div className="service-details-grid">

            {/* IMAGE */}
            <div className="service-details-visual">

              <div className="service-details-image-box">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="service-details-image"
                />

                <div className="service-image-overlay" />
              </div>

              {/* Duration Badge */}

              <div className="service-duration-card">
                <div className="service-duration-icon">
                  <Clock3 size={19} />
                </div>

                <div>
                  <span>Duration</span>
                  <strong>
                    {service.duration} minutes
                  </strong>
                </div>
              </div>

            </div>

            {/* CONTENT */}

            <div className="service-details-content">

              {/* Category */}

              <div className="service-details-category">
                <Sparkles size={15} />
                {service.category}
              </div>

              {/* Title */}

              <h1 className="service-details-title">
                {service.serviceName}
              </h1>

              {/* Description */}

              <p className="service-details-description">
                {service.description}
              </p>

              {/* Price + Duration */}

              <div className="service-details-info">

                <div className="service-price-info">
                  <span>Service price</span>

                  <div>
                    <strong>
                      ৳{service.price}
                    </strong>

                    <small>
                      / session
                    </small>
                  </div>
                </div>

                <div className="service-time-info">
                  <Clock3 size={20} />

                  <div>
                    <span>Estimated time</span>
                    <strong>
                      {service.duration} min
                    </strong>
                  </div>
                </div>

              </div>

              {/* Benefits */}

              <div className="service-benefits">

                <h3>
                  Why choose this service?
                </h3>

                <div className="service-benefit-list">

                  <div className="service-benefit-item">
                    <CheckCircle2 size={18} />
                    <span>
                      Professional salon service
                    </span>
                  </div>

                  <div className="service-benefit-item">
                    <CheckCircle2 size={18} />
                    <span>
                      Easy appointment booking
                    </span>
                  </div>

                  <div className="service-benefit-item">
                    <CheckCircle2 size={18} />
                    <span>
                      Flexible appointment time
                    </span>
                  </div>

                </div>
              </div>

              {/* Booking */}

              <div className="service-booking-area">

                <Link
                  href={`/services/${service._id}/book`}
                  className="service-book-button"
                >
                  <CalendarDays size={19} />
                  Book Appointment
                </Link>

                <p>
                  Login is required before booking an appointment.
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================
          EXPERIENCE SECTION
      ========================= */}

      <section className="service-experience-section">
        <div className="service-details-container">

          <div className="service-experience-card">

            <div className="service-experience-icon">
              <Sparkles size={22} />
            </div>

            <p className="service-experience-label">
              THE SALONBOOK EXPERIENCE
            </p>

            <h2>
              A better salon experience starts here.
            </h2>

            <p>
              Choose your preferred time and enjoy a simple,
              organized appointment experience with SalonBook.
            </p>

            <Link
              href="/services"
              className="service-experience-link"
            >
              Explore More Services
              <ArrowLeft
                size={16}
                className="rotate-180"
              />
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}