"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import {
  ArrowRight,
  CalendarDays,
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

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices(data.slice(0, 6));
      } catch (error) {
        console.error(error);
        setError("Unable to load services right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className="home-page">
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <div className="home-container hero-layout">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              Your beauty, your time
            </div>

            <h1 className="hero-title">
              Your perfect salon experience,
              <span> booked simply.</span>
            </h1>

            <p className="hero-description">
              Discover trusted salon services, choose your preferred time,
              and book your next beauty experience without the waiting.
            </p>

            <div className="hero-actions">
              <Link href="/services" className="primary-button">
                Explore Services
                <ArrowRight size={18} />
              </Link>

              <Link href="/about" className="secondary-button">
                Learn More
              </Link>
            </div>

            <div className="stats-row">
              <div>
                <strong>500+</strong>
                <span>Happy Clients</span>
              </div>

              <div>
                <strong>25+</strong>
                <span>Beauty Services</span>
              </div>

              <div>
                <strong>4.9/5</strong>
                <span>Client Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85"
                alt="Professional salon"
              />
            </div>

            <div className="booking-floating-card">
              <div className="floating-icon">
                <CalendarDays size={22} />
              </div>

              <div>
                <p>Easy Booking</p>
                <span>Choose your perfect time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section">
        <div className="home-container">
          <div className="section-heading">
            <div>
              <p className="section-label">Our Services</p>

              <h2>Beauty services made for you</h2>

              <p>
                From everyday care to special occasions, find the service
                that makes you feel your best.
              </p>
            </div>

            <Link href="/services" className="view-all-link">
              View all services
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="services-grid">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="service-card skeleton-card">
                  <div className="skeleton-image" />

                  <div className="skeleton-content">
                    <div className="skeleton-line small" />
                    <div className="skeleton-line large" />
                    <div className="skeleton-line" />
                    <div className="skeleton-button" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="error-box">
              <p>{error}</p>
              <span>
                Please make sure the SalonBook server is running.
              </span>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && services.length === 0 && (
            <div className="empty-box">
              <Scissors size={36} />

              <h3>No services available</h3>

              <p>Our salon services will appear here soon.</p>
            </div>
          )}

          {/* Services */}
            {!loading && !error && services.length > 0 && (
  <div className="services-grid">
    {services.map((service) => (
      <article key={service._id} className="service-card">
        <div className="service-image-wrapper">
          <img
            src={service.image}
            alt={service.serviceName}
          />

          <span className="service-category">
            {service.category}
          </span>
        </div>

        <div className="service-content">
          <div className="service-content-top">
            <h3>{service.serviceName}</h3>

            <p>{service.description}</p>
          </div>

          <div className="service-bottom">
            <div className="service-meta">
              <span>
                <Clock3 size={15} />
                {service.duration} min
              </span>

              <strong>৳{service.price}</strong>
            </div>

            <Link
              href={`/services/${service._id}`}
              className="details-button"
            >
              View Details
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </article>
    ))}
  </div>
)}
        </div>
      </section>

      {/* Why SalonBook */}
      <section className="why-section">
        <div className="home-container">
          <div className="why-box">
            <div className="why-grid">
              <div className="why-item">
                <CalendarDays size={32} />

                <h3>Simple Booking</h3>

                <p>
                  Select a service, date and time without unnecessary steps.
                </p>
              </div>

              <div className="why-item">
                <Scissors size={32} />

                <h3>Quality Services</h3>

                <p>
                  Explore carefully organized salon services in one place.
                </p>
              </div>

              <div className="why-item">
                <Sparkles size={32} />

                <h3>Beautiful Experience</h3>

                <p>
                  A clean and welcoming experience from discovery to booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="home-container footer-grid">
          <div>
            <h2>
              Salon<span>Book</span>
            </h2>

            <p>
              A simple and elegant way to discover salon services and book
              your next appointment.
            </p>
          </div>

          <div>
            <h3>Quick Links</h3>

            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/services">Browse Services</Link>
              <Link href="/signin">Sign In</Link>
              <Link href="/signup">Sign Up</Link>
            </div>
          </div>

          <div>
            <h3>Visit Us</h3>

            <p>
              Dhaka, Bangladesh
              <br />
              Sat - Thu: 10:00 AM - 9:00 PM
              <br />
              Friday: 2:00 PM - 9:00 PM
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="home-container">
            © 2026 SalonBook. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}