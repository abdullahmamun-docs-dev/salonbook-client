"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
} from "lucide-react";
import Navbar from "../../components/Navbar";

export default function ContactPage() {
  return (
    <main className="inner-page">
      <Navbar />

      {/* Hero */}
      <section className="contact-hero">
        <div className="home-container">
          <div className="contact-hero-content">
            <div className="contact-eyebrow">
              <MessageCircle size={16} />
              Get in Touch
            </div>

            <h1>
              We would love to
              <span> hear from you.</span>
            </h1>

            <p>
              Have a question about our services or need help with your
              appointment? Send us a message and our team will be happy to
              help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-main-section">
        <div className="home-container contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <p className="section-label">Contact Information</p>

            <h2>Let&apos;s talk about your next appointment.</h2>

            <p className="contact-intro">
              Whether you are looking for a service, need help with a
              booking, or simply have a question, you can reach us through
              the information below.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={21} />
                </div>

                <div>
                  <span>Our Location</span>
                  <strong>Dhaka, Bangladesh</strong>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Phone size={21} />
                </div>

                <div>
                  <span>Phone</span>
                  <strong>+880 1XXX-XXXXXX</strong>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={21} />
                </div>

                <div>
                  <span>Email</span>
                  <strong>hello@salonbook.com</strong>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Clock3 size={21} />
                </div>

                <div>
                  <span>Opening Hours</span>
                  <strong>Sat - Thu: 10:00 AM - 9:00 PM</strong>
                  <strong>Friday: 2:00 PM - 9:00 PM</strong>
                </div>
              </div>
            </div>

            <div className="contact-book-card">
              <div className="contact-book-icon">
                <CalendarDays size={23} />
              </div>

              <div>
                <h3>Looking for an appointment?</h3>

                <p>
                  Explore our available services and choose your preferred
                  date and time.
                </p>

                <Link href="/services" className="text-link">
                  Browse Services
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-card">
            <div className="contact-form-heading">
              <div className="contact-form-icon">
                <Scissors size={21} />
              </div>

              <div>
                <p className="section-label">Send a Message</p>
                <h2>How can we help?</h2>
              </div>
            </div>

            <form className="contact-form">
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Full Name</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Email Address</label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="subject">Subject</label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What can we help you with?"
                />
              </div>

              <div className="contact-field">
                <label htmlFor="message">Message</label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Write your message here..."
                />
              </div>

              <button type="button" className="primary-button contact-submit">
                Send Message
                <ArrowRight size={17} />
              </button>

              <p className="contact-form-note">
                We&apos;ll get back to you as soon as possible.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ / Help */}
      <section className="contact-help-section">
        <div className="home-container">
          <div className="contact-help-box">
            <div className="contact-help-icon">
              <MessageCircle size={28} />
            </div>

            <div>
              <p className="section-label">Need a faster answer?</p>

              <h2>Check our services and booking options.</h2>

              <p>
                Most appointment information, service details, prices, and
                available booking options can be found directly on SalonBook.
              </p>
            </div>

            <Link href="/services" className="primary-button">
              Explore Services
              <ArrowRight size={17} />
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