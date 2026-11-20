"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Heart,
  Scissors,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Navbar from "../../components/Navbar";

const values = [
  {
    icon: Sparkles,
    title: "Quality First",
    description:
      "We believe every salon experience should feel thoughtful, comfortable, and worth your time.",
  },
  {
    icon: Heart,
    title: "Made for You",
    description:
      "From choosing a service to selecting a convenient time, SalonBook keeps the experience simple and personal.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description:
      "Our platform is designed around real customer needs, making salon discovery and booking easier.",
  },
];

const features = [
  "Easy online appointment booking",
  "Clear service information and pricing",
  "Flexible appointment time selection",
  "Simple and organized customer dashboard",
  "Secure online payment for confirmed bookings",
  "Professional salon experience from start to finish",
];

export default function AboutPage() {
  return (
    <main className="inner-page">
      <Navbar />

      {/* Hero */}
      <section className="about-hero">
        <div className="home-container">
          <div className="about-hero-content">
            <div className="about-eyebrow">
              <Scissors size={16} />
              About SalonBook
            </div>

            <h1>
              Beauty care should feel
              <span> simple and personal.</span>
            </h1>

            <p>
              SalonBook is a modern salon appointment platform designed to
              make discovering beauty services and booking appointments
              easier, faster, and more convenient.
            </p>

            <div className="about-hero-actions">
              <Link href="/services" className="primary-button">
                Explore Services
                <ArrowRight size={18} />
              </Link>

              <Link href="/contact" className="secondary-button">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about-story-section">
        <div className="home-container about-story-grid">
          <div className="about-story-image">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
              alt="Modern salon interior"
            />

            <div className="about-rating-card">
              <div className="rating-icon">
                <Star size={18} fill="currentColor" />
              </div>

              <div>
                <strong>4.9/5</strong>
                <span>Client experience</span>
              </div>
            </div>
          </div>

          <div className="about-story-content">
            <p className="section-label">Our Story</p>

            <h2>
              A better way to book your
              <span> beauty experience.</span>
            </h2>

            <p>
              Finding the right salon service should not require unnecessary
              phone calls, long waiting times, or complicated booking
              processes. SalonBook was created to bring the entire experience
              into one simple platform.
            </p>

            <p>
              Customers can explore services, compare prices and durations,
              choose a convenient date and time, and manage their appointments
              from one place.
            </p>

            <p>
              Our goal is simple: make salon booking feel as comfortable and
              effortless as the salon experience itself.
            </p>

            <Link href="/services" className="text-link">
              Discover our services
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats-section">
        <div className="home-container about-stats-grid">
          <div className="about-stat">
            <strong>500+</strong>
            <span>Happy Clients</span>
          </div>

          <div className="about-stat">
            <strong>25+</strong>
            <span>Beauty Services</span>
          </div>

          <div className="about-stat">
            <strong>4.9/5</strong>
            <span>Client Rating</span>
          </div>

          <div className="about-stat">
            <strong>100%</strong>
            <span>Simple Booking</span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values-section">
        <div className="home-container">
          <div className="about-section-heading">
            <p className="section-label">What We Believe</p>

            <h2>Built around a better experience</h2>

            <p>
              Every part of SalonBook is designed to make salon appointments
              easier and more enjoyable.
            </p>
          </div>

          <div className="about-values-grid">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article key={value.title} className="about-value-card">
                  <div className="about-value-icon">
                    <Icon size={23} />
                  </div>

                  <h3>{value.title}</h3>

                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-features-section">
        <div className="home-container about-features-grid">
          <div>
            <p className="section-label">Why SalonBook</p>

            <h2>
              Everything you need for a
              <span> smoother booking experience.</span>
            </h2>

            <p className="about-features-description">
              We bring the important parts of salon booking together in one
              clean and easy-to-use platform.
            </p>

            <div className="about-feature-list">
              {features.map((feature) => (
                <div key={feature} className="about-feature-item">
                  <CheckCircle2 size={19} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-feature-card">
            <CalendarDays size={38} />

            <p className="about-feature-card-label">Your next appointment</p>

            <h3>Book it your way.</h3>

            <p>
              Choose the service, date, and time that works best for you.
              SalonBook keeps the process clear from booking to confirmation.
            </p>

            <Link href="/services" className="primary-button">
              Book an Appointment
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="home-container">
          <div className="about-cta-box">
            <div>
              <p className="section-label">Ready when you are</p>

              <h2>Your next beauty experience starts here.</h2>

              <p>
                Explore our services and find a time that fits your schedule.
              </p>
            </div>

            <Link href="/services" className="primary-button">
              Browse Services
              <ArrowRight size={18} />
            </Link>
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
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
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