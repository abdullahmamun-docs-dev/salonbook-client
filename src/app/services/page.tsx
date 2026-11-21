"use client";

import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Clock3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Service = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  isActive: boolean;
};

const categories = [
  "All Categories",
  "Grooming",
  "Hair",
  "Spa",
  "Nails",
  "Makeup",
  "Skin Care",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ========================================
     LOAD SERVICES
  ======================================== */

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          // "http://localhost:5000/api/services"
          `${process.env.NEXT_PUBLIC_API_URL}/api/services`
        );

        if (!response.ok) {
          throw new Error("Failed to load services");
        }

        const data = await response.json();

        setServices(
          Array.isArray(data)
            ? data
            : data.services || []
        );
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load services right now."
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  /* ========================================
     FILTER + SEARCH + SORT
  ======================================== */

  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search
    if (search.trim()) {
      const keyword = search
        .trim()
        .toLowerCase();

      result = result.filter(
        (service) =>
          service.name
            .toLowerCase()
            .includes(keyword) ||
          service.category
            .toLowerCase()
            .includes(keyword) ||
          service.description
            .toLowerCase()
            .includes(keyword)
      );
    }

    // Category
    if (category !== "All Categories") {
      result = result.filter(
        (service) =>
          service.category === category
      );
    }

    // Sort
    if (sort === "low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [services, search, category, sort]);

  return (
    <main className="services-page">

      {/* ========================================
          HERO
      ======================================== */}

      <section className="services-hero">
        <div className="services-container">
          <div className="services-hero-inner">

            <div className="services-hero-badge">
              <Sparkles size={14} />
              <span>SalonBook Collection</span>
            </div>

            <p className="services-eyebrow">
              BEAUTY • CARE • CONFIDENCE
            </p>

            <h1>
              Find the right
              <span> service for you.</span>
            </h1>

            <p className="services-hero-description">
              Discover carefully selected beauty and
              grooming services. Search, filter and
              compare services before choosing your
              perfect appointment.
            </p>

            <div className="services-hero-meta">
              <span>
                {services.length || 8} curated services
              </span>

              <span className="services-hero-dot">
                •
              </span>

              <span>
                Easy online booking
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================
          FILTER / TOOLBAR
      ======================================== */}

      <section className="services-toolbar-section">
        <div className="services-container">

          <div className="services-toolbar">

            {/* Search */}

            <div className="services-search">
              <Search size={18} />

              <input
                type="text"
                value={search}
                placeholder="Search services..."
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>


            {/* Category */}

            <div className="services-filter">
              <SlidersHorizontal size={17} />

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>


            {/* Sort */}

            <div className="services-filter">
              <ArrowUpDown size={17} />

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
              >
                <option value="default">
                  Sort by Price
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>
              </select>
            </div>

          </div>


          {/* ========================================
              CATEGORY PILLS
          ======================================== */}

          <div className="services-category-list">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "service-category active"
                    : "service-category"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

        </div>
      </section>


      {/* ========================================
          SERVICES LIST
      ======================================== */}

      <section className="services-list-section">
        <div className="services-container">

          {/* Section heading */}

          <div className="services-section-heading">

            <div>
              <p className="services-section-label">
                OUR SERVICES
              </p>

              <h2>
                Beauty, care & confidence.
              </h2>

              <p className="services-heading-description">
                Choose from our carefully selected
                salon experiences designed around
                your beauty and grooming needs.
              </p>
            </div>

            {!loading && !error && (
              <div className="services-count-box">
                <strong>
                  {filteredServices.length}
                </strong>

                <span>
                  {filteredServices.length === 1
                    ? "service available"
                    : "services available"}
                </span>
              </div>
            )}

          </div>


          {/* ========================================
              LOADING
          ======================================== */}

          {loading && (
            <div className="services-grid">

              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="service-card skeleton-card"
                >
                  <div className="skeleton-service-image" />

                  <div className="skeleton-service-content">
                    <div className="skeleton-service-line small" />
                    <div className="skeleton-service-line title" />
                    <div className="skeleton-service-line" />
                    <div className="skeleton-service-line" />

                    <div className="skeleton-service-bottom" />
                  </div>
                </div>
              ))}

            </div>
          )}


          {/* ========================================
              ERROR
          ======================================== */}

          {!loading && error && (
            <div className="services-message">

              <div className="services-message-icon">
                !
              </div>

              <h3>
                Something went wrong
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="services-message-button"
              >
                Try Again
              </button>

            </div>
          )}


          {/* ========================================
              EMPTY
          ======================================== */}

          {!loading &&
            !error &&
            filteredServices.length === 0 && (
              <div className="services-message">

                <div className="services-message-icon">
                  <Search size={20} />
                </div>

                <h3>
                  No services found
                </h3>

                <p>
                  Try another search keyword or
                  choose a different category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory(
                      "All Categories"
                    );
                    setSort("default");
                  }}
                  className="services-message-button"
                >
                  Clear Filters
                </button>

              </div>
            )}


          {/* ========================================
              SERVICE CARDS
          ======================================== */}

          {!loading &&
            !error &&
            filteredServices.length > 0 && (
              <div className="services-grid">

                {filteredServices.map(
                  (service) => (
                    <article
                      key={service._id}
                      className="service-card"
                    >

                      {/* Image */}

                      <div className="service-card-image">

                        <img
                          src={service.image}
                          alt={service.name}
                        />

                        <div className="service-card-overlay" />

                        <span className="service-card-category">
                          {service.category}
                        </span>

                      </div>


                      {/* Content */}

                      <div className="service-card-content">

                        <h3>
                          {service.name}
                        </h3>

                        <p className="service-card-description">
                          {service.description}
                        </p>


                        {/* Meta */}

                        <div className="service-card-meta">

                          <span className="service-duration">
                            <Clock3 size={15} />
                            {service.duration} min
                          </span>

                          <div className="service-price">
                            <small>
                              Starting from
                            </small>

                            <strong>
                              ৳{service.price.toLocaleString()}
                            </strong>
                          </div>

                        </div>


                        {/* Details */}

                        <Link
                          href={`/services/${service._id}`}
                          className="service-card-button"
                        >
                          <span>
                            View Details
                          </span>

                          <ArrowRight
                            size={16}
                          />
                        </Link>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

        </div>
      </section>


      {/* ========================================
          BOTTOM CTA
      ======================================== */}

      <section className="services-bottom-cta">
        <div className="services-container">

          <div className="services-bottom-cta-inner">

            <div className="services-cta-icon">
              <Sparkles size={20} />
            </div>

            <p className="services-cta-label">
              YOUR NEXT EXPERIENCE
            </p>

            <h2>
              Ready for your next
              <span> salon experience?</span>
            </h2>

            <p className="services-cta-description">
              Choose your favorite service and take
              the first step toward feeling your best.
            </p>

            <Link
              href="/"
              className="services-back-home"
            >
              <span>
                Back to Home
              </span>

              <ArrowRight size={17} />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}