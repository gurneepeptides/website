import React, { useState, useMemo, useLayoutEffect } from "react";
import reviewsData from "../reviews.js";

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState("all");
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = reviewsData.length;
    const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);
    
    const breakdown = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviewsData.filter(r => r.rating === rating).length,
      percentage: ((reviewsData.filter(r => r.rating === rating).length / total) * 100).toFixed(0)
    }));

    return { total, average, breakdown };
  }, []);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (selectedRating === "all") return reviewsData;
    return reviewsData.filter(r => r.rating === parseInt(selectedRating));
  }, [selectedRating]);

  // Toggle expanded text
  const toggleExpanded = (id) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Star component
  const Stars = ({ rating, size = "20px", showNumber = false }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            style={{
              color: star <= rating ? "#fbbf24" : "rgba(255,255,255,0.2)",
              fontSize: size,
              lineHeight: "1"
            }}
          >
            ★
          </span>
        ))}
      </div>
      {showNumber && (
        <span style={{ 
          fontSize: "clamp(14px, 3vw, 16px)", 
          color: "#e5e7eb",
          fontWeight: "600"
        }}>
          {rating}.0
        </span>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0e1a2e 100%)",
      padding: "16px"
    }}>
      <div style={{ 
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <header style={{
          background: "rgba(17, 24, 39, 0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "clamp(24px, 5vw, 32px)",
          marginBottom: "24px",
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 40px)",
            fontWeight: "700",
            marginBottom: "12px",
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: "1.2"
          }}>
            Customer Reviews
          </h1>
          <p style={{
            color: "#e5e7eb",
            fontSize: "clamp(14px, 3vw, 16px)",
            margin: "0",
            lineHeight: "1.5"
          }}>
            See what researchers are saying about our products and service
          </p>
        </header>

        {/* Rating Summary */}
        <div style={{
          background: "rgba(17, 24, 39, 0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "clamp(20px, 5vw, 28px)",
          marginBottom: "24px"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            alignItems: "center"
          }}>
            {/* Average Rating */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(48px, 10vw, 64px)",
                fontWeight: "800",
                color: "#f9fafb",
                lineHeight: "1",
                marginBottom: "8px"
              }}>
                {stats.average}
              </div>
              <Stars rating={Math.round(stats.average)} size="clamp(24px, 5vw, 28px)" />
              <div style={{
                color: "#e5e7eb",
                fontSize: "clamp(14px, 3vw, 16px)",
                marginTop: "8px"
              }}>
                Based on {stats.total} reviews
              </div>
            </div>

            {/* Rating Breakdown */}
            <div style={{ flex: 1 }}>
              {stats.breakdown.map(({ rating, count, percentage }) => (
                <div
                  key={rating}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px"
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    minWidth: "80px"
                  }}>
                    <span style={{
                      color: "#e5e7eb",
                      fontSize: "clamp(13px, 3vw, 14px)",
                      fontWeight: "600"
                    }}>
                      {rating}
                    </span>
                    <span style={{ color: "#fbbf24", fontSize: "16px" }}>★</span>
                  </div>
                  <div style={{
                    flex: 1,
                    height: "8px",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${percentage}%`,
                      background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                      borderRadius: "4px",
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                  <span style={{
                    color: "#e5e7eb",
                    fontSize: "clamp(13px, 3vw, 14px)",
                    minWidth: "40px",
                    textAlign: "right"
                  }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          overflowX: "auto",
          paddingBottom: "8px",
          WebkitOverflowScrolling: "touch"
        }}>
          <button
            onClick={() => setSelectedRating("all")}
            style={{
              background: selectedRating === "all" ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.05)",
              color: "#f9fafb",
              border: selectedRating === "all" ? "2px solid #60a5fa" : "2px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "12px 20px",
              fontSize: "clamp(14px, 3vw, 15px)",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap",
              minHeight: "48px",
              transition: "all 0.2s ease"
            }}
          >
            All Reviews
          </button>
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating.toString())}
              style={{
                background: selectedRating === rating.toString() ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.05)",
                color: "#f9fafb",
                border: selectedRating === rating.toString() ? "2px solid #60a5fa" : "2px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                padding: "12px 20px",
                fontSize: "clamp(14px, 3vw, 15px)",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
                minHeight: "48px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease"
              }}
            >
              {rating} <span style={{ color: "#fbbf24" }}>★</span>
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div style={{
          display: "grid",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {filteredReviews.map(review => {
            const isExpanded = expandedReviews.has(review.id);
            const shouldTruncate = review.text.length > 200;
            const displayText = shouldTruncate && !isExpanded 
              ? review.text.slice(0, 200) + "..." 
              : review.text;

            return (
              <div
                key={review.id}
                style={{
                  background: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  padding: "clamp(20px, 5vw, 24px)",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "12px",
                  gap: "12px",
                  flexWrap: "wrap"
                }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px"
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: "clamp(16px, 3.5vw, 18px)",
                        fontWeight: "700",
                        color: "#f9fafb"
                      }}>
                        {review.name}
                      </h3>
                      {review.verified && (
                        <span style={{
                          background: "rgba(34, 197, 94, 0.2)",
                          border: "1px solid rgba(34, 197, 94, 0.5)",
                          borderRadius: "6px",
                          padding: "2px 8px",
                          fontSize: "clamp(11px, 2.5vw, 12px)",
                          fontWeight: "700",
                          color: "#22c55e"
                        }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div style={{
                      color: "#e5e7eb",
                      fontSize: "clamp(13px, 3vw, 14px)"
                    }}>
                      {review.role}
                    </div>
                  </div>
                  <Stars rating={review.rating} size="clamp(18px, 4vw, 20px)" />
                </div>

                {/* Review Text */}
                <p style={{
                  color: "#e5e7eb",
                  fontSize: "clamp(14px, 3vw, 16px)",
                  lineHeight: "1.6",
                  margin: "0 0 12px 0"
                }}>
                  "{displayText}"
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpanded(review.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#60a5fa",
                        cursor: "pointer",
                        padding: "0 0 0 4px",
                        fontSize: "clamp(14px, 3vw, 15px)",
                        fontWeight: "600",
                        textDecoration: "underline"
                      }}
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>

                {/* Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: "8px",
                    marginBottom: "12px"
                  }}>
                    {review.photos.map((photo, index) => (
                      <div
                        key={index}
                        onClick={() => setLightboxPhoto(photo)}
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: "12px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: "2px solid rgba(255,255,255,0.1)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <img
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Date */}
                <div style={{
                  color: "#9ca3af",
                  fontSize: "clamp(12px, 2.5vw, 13px)",
                  fontWeight: "500"
                }}>
                  {review.date}
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredReviews.length === 0 && (
          <div style={{
            background: "rgba(17, 24, 39, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "48px 24px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>⭐</div>
            <h3 style={{
              color: "#f9fafb",
              fontSize: "clamp(18px, 4vw, 24px)",
              marginBottom: "8px"
            }}>
              No reviews found
            </h3>
            <p style={{
              color: "#e5e7eb",
              fontSize: "clamp(14px, 3vw, 16px)"
            }}>
              Try selecting a different rating filter
            </p>
          </div>
        )}

        {/* Share Your Experience CTA */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f, #2d4a6f)",
          border: "2px solid rgba(96, 165, 250, 0.3)",
          borderRadius: "20px",
          padding: "clamp(24px, 5vw, 32px)",
          textAlign: "center"
        }}>
          <h3 style={{
            fontSize: "clamp(20px, 4vw, 24px)",
            fontWeight: "700",
            marginBottom: "12px",
            color: "#f9fafb"
          }}>
            Share Your Experience
          </h3>
          <p style={{
            color: "#e5e7eb",
            fontSize: "clamp(14px, 3vw, 16px)",
            marginBottom: "20px",
            lineHeight: "1.6"
          }}>
            We value feedback from our research community. Let us know about your experience with our products.
          </p>
          <a
            href="https://m.me/61580797282365"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "16px 40px",
              fontSize: "clamp(15px, 3.5vw, 18px)",
              fontWeight: "700",
              textDecoration: "none",
              cursor: "pointer",
              minHeight: "52px",
              lineHeight: "20px",
              transition: "all 0.2s ease"
            }}
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Photo Lightbox */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            cursor: "pointer"
          }}
        >
          <img
            src={lightboxPhoto}
            alt="Review photo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "12px"
            }}
          />
          <button
            onClick={() => setLightboxPhoto(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.9)",
              border: "none",
              borderRadius: "50%",
              width: "48px",
              height: "48px",
              fontSize: "24px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              color: "#000"
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
