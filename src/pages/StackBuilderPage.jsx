import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import products from "../products.js";

const Placeholder = "/placeholder.svg";

// Research goals with descriptions
const researchGoals = [
  {
    id: "weight-management",
    label: "Weight Management",
    icon: "⚖️",
    description: "Support for body composition and weight control",
  },
  {
    id: "appetite-control",
    label: "Appetite Control",
    icon: "🍽️",
    description: "Help manage hunger and eating patterns",
  },
  {
    id: "recovery",
    label: "Recovery & Healing",
    icon: "💪",
    description: "Support tissue repair and recovery",
  },
  {
    id: "cognitive",
    label: "Cognitive Enhancement",
    icon: "🧠",
    description: "Memory, focus, and mental clarity",
  },
  {
    id: "anti-aging",
    label: "Anti-Aging",
    icon: "✨",
    description: "Cellular health and longevity support",
  },
  {
    id: "energy",
    label: "Energy & Vitality",
    icon: "⚡",
    description: "Enhanced energy and endurance",
  },
  {
    id: "performance",
    label: "Performance",
    icon: "🏃",
    description: "Athletic and physical performance",
  },
  {
    id: "metabolism",
    label: "Metabolism",
    icon: "🔥",
    description: "Metabolic health and efficiency",
  },
];

// Experience levels
const experienceLevels = [
  {
    id: "beginner",
    label: "Beginner",
    description: "New to peptide research",
    icon: "🌱",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Some research experience",
    icon: "📊",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Experienced researcher",
    icon: "🔬",
  },
];

export default function StackBuilderPage() {
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [showAlternatives, setShowAlternatives] = useState(false);

  // Toggle goal selection
  const toggleGoal = (goalId) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  // Enhanced recommendation algorithm
  const { recommendations, alternatives, excluded } = useMemo(() => {
    if (!experience || selectedGoals.length === 0) {
      return { recommendations: [], alternatives: [], excluded: [] };
    }

    // Score each product based on matching goals with enhanced algorithm
    const scored = products
      .filter((p) => p.researchGoals && p.researchGoals.length > 0)
      .filter((p) => !(p.tags || []).includes("Out of Stock"))
      .map((product) => {
        let score = 0;
        const matchedGoals = [];
        const reasons = [];

        // Experience level filtering
        if (!((product.experienceLevel || []).includes(experience))) {
          return {
            ...product,
            score: -1,
            excluded: true,
            excludeReason: "Not suitable for your experience level",
          };
        }

        // Calculate match score with priority weighting
        selectedGoals.forEach((goal, index) => {
          if ((product.researchGoals || []).includes(goal)) {
            // Priority weighting: first goal 2x, second 1.5x, rest 1x
            const weight = index === 0 ? 2 : index === 1 ? 1.5 : 1;
            score += weight;
            matchedGoals.push(goal);
          }
        });

        // Skip if no goals match
        if (matchedGoals.length === 0) {
          return {
            ...product,
            score: -1,
            excluded: true,
            excludeReason: "Doesn't match your research goals",
          };
        }

        // Synergy bonuses
        const relatedGoals = {
          recovery: ["performance", "tissue-repair"],
          performance: ["recovery", "energy"],
          "weight-management": ["metabolism", "appetite-control"],
          "anti-aging": ["longevity", "energy"],
          cognitive: ["focus", "energy"],
        };

        selectedGoals.forEach((goal) => {
          const related = relatedGoals[goal] || [];
          const hasRelated = related.some((r) => selectedGoals.includes(r));
          if (hasRelated && (product.tags || []).includes("combo")) {
            score += 0.8;
            reasons.push("Synergistic combo for your goals");
          }
        });

        // Confidence rating bonus (well-studied compounds)
        score += ((product.confidenceRating || 3) * 0.15);
        if (product.confidenceRating === 5) {
          reasons.push("Highly researched compound");
        }

        // Experience-based adjustments
        if (experience === "beginner") {
          // Prefer well-studied, single peptides
          if (product.confidenceRating === 5) score += 0.4;
          if (!(product.tags || []).includes("combo")) score += 0.3;
          // Prefer lower dosages
          if (
            (product.id || "").includes("-5") ||
            (product.id || "").includes("-10")
          ) {
            score += 0.3;
            reasons.push("Appropriate dosage for beginners");
          }
        } else if (experience === "advanced") {
          // Advanced users might prefer combo products or higher dosages
          if ((product.tags || []).includes("combo")) {
            score += 0.4;
            reasons.push("Advanced combo formulation");
          }
          if (
            (product.id || "").includes("-15") ||
            (product.id || "").includes("-20") ||
            (product.id || "").includes("-30") ||
            (product.id || "").includes("-50")
          ) {
            score += 0.2;
          }
        }

        // Calculate confidence score
        const matchPercentage = (matchedGoals.length / selectedGoals.length) * 100;
        const confidenceScore = Math.min(
          100,
          Math.round(matchPercentage * 0.6 + (product.confidenceRating || 3) * 8 + score * 2)
        );

        return {
          ...product,
          score,
          matchedGoals,
          matchPercentage,
          confidenceScore,
          reasons,
          excluded: false,
        };
      })
      .filter((p) => !p.excluded)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.confidenceScore !== a.confidenceScore) return b.confidenceScore - a.confidenceScore;
        return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER);
      });

    // Ensure diversity across categories and mechanisms
    const topRecommendations = [];
    const seenCategories = new Set();
    const seenMechanisms = new Set();
    const seenCompounds = new Set();

    // Select top 3 with diversity
    for (const product of scored) {
      if (topRecommendations.length >= 3) break;

      const baseName = (product.name || "").split(" ")[0];
      const category = product.category || "";
      const mechanism = product.mechanism || "";

      // Ensure diversity
      const isDiverse =
        !seenCompounds.has(baseName) &&
        (seenCategories.size < 2 || !seenCategories.has(category)) &&
        (seenMechanisms.size < 2 || !seenMechanisms.has(mechanism));

      if (isDiverse || topRecommendations.length === 0) {
        topRecommendations.push(product);
        seenCompounds.add(baseName);
        seenCategories.add(category);
        seenMechanisms.add(mechanism);
      }
    }

    // Get alternatives (next 3-5 products)
    const alternativesList = scored
      .filter((p) => !topRecommendations.find((r) => r.id === p.id))
      .slice(0, 5);

    // Get excluded products with reasons
    const excludedList = products
      .filter((p) => p.researchGoals && p.researchGoals.length > 0)
      .filter((p) => !((p.experienceLevel || []).includes(experience)))
      .map((p) => ({
        ...p,
        excludeReason: `Not recommended for ${experience} researchers`,
      }))
      .slice(0, 3);

    return {
      recommendations: topRecommendations,
      alternatives: alternativesList,
      excluded: excludedList,
    };
  }, [experience, selectedGoals]);

  // Reset and start over
  const resetBuilder = () => {
    setStep(1);
    setExperience("");
    setSelectedGoals([]);
    setShowAlternatives(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #0e1a2e 100%)",
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <header
          style={{
            textAlign: "center",
            marginBottom: "32px",
            paddingTop: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 36px)",
              fontWeight: "700",
              marginBottom: "12px",
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: "1.2",
            }}
          >
            🧬 Peptide Stack Builder
          </h1>
          <p
            style={{
              color: "#e5e7eb",
              fontSize: "clamp(14px, 3vw, 16px)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.5",
            }}
          >
            Build your personalized research stack based on your goals and experience level
          </p>
        </header>

        {/* Progress Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background:
                    step >= num
                      ? "linear-gradient(135deg, #60a5fa, #a78bfa)"
                      : "rgba(255,255,255,0.1)",
                  border: step === num ? "3px solid #60a5fa" : "2px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "18px",
                  transition: "all 0.3s ease",
                  color: step >= num ? "#fff" : "#9ca3af",
                }}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  style={{
                    width: "clamp(40px, 10vw, 60px)",
                    height: "3px",
                    background:
                      step > num ? "linear-gradient(90deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.1)",
                    borderRadius: "2px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Experience Level */}
        {step === 1 && (
          <div
            style={{
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "clamp(24px, 5vw, 40px)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(20px, 4vw, 28px)",
                marginBottom: "8px",
                textAlign: "center",
                color: "#f9fafb",
              }}
            >
              Select Your Experience Level
            </h2>
            <p
              style={{
                color: "#e5e7eb",
                textAlign: "center",
                marginBottom: "32px",
                fontSize: "clamp(14px, 3vw, 16px)",
                lineHeight: "1.6",
              }}
            >
              This helps us recommend appropriate dosages and complexity
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                gap: "16px",
              }}
            >
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setExperience(level.id)}
                  style={{
                    background:
                      experience === level.id
                        ? "linear-gradient(135deg, #1e3a5f, #2d4a6f)"
                        : "rgba(15,26,43,0.8)",
                    border:
                      experience === level.id ? "3px solid #60a5fa" : "2px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "24px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    transform: experience === level.id ? "scale(1.02)" : "scale(1)",
                    minHeight: "48px",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>{level.icon}</div>
                  <div
                    style={{
                      fontSize: "clamp(16px, 3.5vw, 20px)",
                      fontWeight: "700",
                      marginBottom: "8px",
                      color: "#f9fafb",
                    }}
                  >
                    {level.label}
                  </div>
                  <div
                    style={{
                      color: "#e5e7eb",
                      fontSize: "clamp(13px, 3vw, 15px)",
                      lineHeight: "1.4",
                    }}
                  >
                    {level.description}
                  </div>
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <button
                onClick={() => experience && setStep(2)}
                disabled={!experience}
                style={{
                  background: experience
                    ? "linear-gradient(135deg, #60a5fa, #a78bfa)"
                    : "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "16px 40px",
                  fontSize: "clamp(15px, 3.5vw, 18px)",
                  fontWeight: "700",
                  cursor: experience ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  minHeight: "52px",
                  opacity: experience ? 1 : 0.5,
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Research Goals */}
        {step === 2 && (
          <div
            style={{
              background: "rgba(17, 24, 39, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "clamp(24px, 5vw, 40px)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(20px, 4vw, 28px)",
                marginBottom: "8px",
                textAlign: "center",
                color: "#f9fafb",
              }}
            >
              Select Your Research Goals
            </h2>
            <p
              style={{
                color: "#e5e7eb",
                textAlign: "center",
                marginBottom: "8px",
                fontSize: "clamp(14px, 3vw, 16px)",
                lineHeight: "1.6",
              }}
            >
              Choose all that apply - we'll match you with the best peptides
            </p>
            <p
              style={{
                color: "#fbbf24",
                textAlign: "center",
                marginBottom: "32px",
                fontSize: "clamp(13px, 3vw, 15px)",
                fontWeight: "600",
                background: "rgba(251, 191, 36, 0.1)",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid rgba(251, 191, 36, 0.3)",
              }}
            >
              💡 Tip: Select goals in order of priority - your first choice carries the most weight
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              {researchGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                const selectionOrder = selectedGoals.indexOf(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, #1e3a5f, #2d4a6f)"
                        : "rgba(15,26,43,0.8)",
                      border: isSelected
                        ? "3px solid #60a5fa"
                        : "2px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      padding: "16px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      transform: isSelected ? "scale(1.02)" : "scale(1)",
                      position: "relative",
                      minHeight: "48px",
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "#60a5fa",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {selectionOrder + 1}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ fontSize: "clamp(20px, 4vw, 24px)" }}>{goal.icon}</span>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "clamp(13px, 3vw, 15px)",
                          color: "#f9fafb",
                          lineHeight: "1.3",
                        }}
                      >
                        {goal.label}
                      </span>
                    </div>
                    <div
                      style={{
                        color: "#e5e7eb",
                        fontSize: "clamp(12px, 2.5vw, 13px)",
                        lineHeight: "1.4",
                      }}
                    >
                      {goal.description}
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setStep(1)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#f9fafb",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "16px 32px",
                  fontSize: "clamp(14px, 3.5vw, 17px)",
                  fontWeight: "700",
                  cursor: "pointer",
                  minHeight: "52px",
                  flex: "1",
                  minWidth: "140px",
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => selectedGoals.length > 0 && setStep(3)}
                disabled={selectedGoals.length === 0}
                style={{
                  background:
                    selectedGoals.length > 0
                      ? "linear-gradient(135deg, #60a5fa, #a78bfa)"
                      : "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "16px 32px",
                  fontSize: "clamp(14px, 3.5vw, 17px)",
                  fontWeight: "700",
                  cursor: selectedGoals.length > 0 ? "pointer" : "not-allowed",
                  minHeight: "52px",
                  flex: "2",
                  minWidth: "180px",
                  opacity: selectedGoals.length > 0 ? 1 : 0.5,
                }}
              >
                Get Recommendations →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Summary Card */}
            <div
              style={{
                background: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "clamp(24px, 5vw, 32px)",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(20px, 4vw, 28px)",
                  marginBottom: "12px",
                  color: "#f9fafb",
                }}
              >
                Your Personalized Stack
              </h2>
              <p
                style={{
                  color: "#e5e7eb",
                  marginBottom: "20px",
                  fontSize: "clamp(14px, 3vw, 16px)",
                }}
              >
                Based on your <strong style={{ color: "#60a5fa" }}>{experience}</strong> experience
                level
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                {selectedGoals.map((goalId, index) => {
                  const goal = researchGoals.find((g) => g.id === goalId);
                  if (!goal) return null;
                  return (
                    <span
                      key={goalId}
                      style={{
                        background:
                          index === 0
                            ? "rgba(96, 165, 250, 0.3)"
                            : "rgba(96, 165, 250, 0.2)",
                        border: `2px solid ${
                          index === 0 ? "#60a5fa" : "rgba(96, 165, 250, 0.5)"
                        }`,
                        borderRadius: "999px",
                        padding: "8px 16px",
                        fontSize: "clamp(12px, 2.5vw, 14px)",
                        color: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: index === 0 ? "700" : "500",
                      }}
                    >
                      {index === 0 && "🎯 "}
                      {goal.icon} {goal.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div
                style={{
                  background: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
                <h3
                  style={{
                    marginBottom: "12px",
                    color: "#f9fafb",
                    fontSize: "clamp(18px, 4vw, 24px)",
                  }}
                >
                  No matches found
                </h3>
                <p
                  style={{
                    color: "#e5e7eb",
                    marginBottom: "24px",
                    fontSize: "clamp(14px, 3vw, 16px)",
                  }}
                >
                  Try selecting different research goals
                </p>
                <button
                  onClick={resetBuilder}
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px 40px",
                    fontSize: "clamp(15px, 3.5vw, 18px)",
                    fontWeight: "700",
                    cursor: "pointer",
                    minHeight: "52px",
                  }}
                >
                  Start Over
                </button>
              </div>
            ) : (
              <>
                {/* Top Recommendations */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                    gap: "20px",
                    marginBottom: "24px",
                  }}
                >
                  {recommendations.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        background: "rgba(17, 24, 39, 0.9)",
                        border: "2px solid rgba(96, 165, 250, 0.3)",
                        borderRadius: "20px",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        position: "relative",
                        display: "block",
                      }}
                    >
                      {/* Rank Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                          borderRadius: "10px",
                          padding: "8px 14px",
                          fontSize: "clamp(11px, 2.5vw, 13px)",
                          fontWeight: "800",
                          zIndex: 1,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        #{index + 1}
                      </div>

                      {/* Confidence Score */}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background:
                            product.confidenceScore >= 80
                              ? "rgba(34, 197, 94, 0.9)"
                              : product.confidenceScore >= 60
                              ? "rgba(59, 130, 246, 0.9)"
                              : "rgba(249, 115, 22, 0.9)",
                          borderRadius: "10px",
                          padding: "8px 12px",
                          fontSize: "clamp(11px, 2.5vw, 13px)",
                          fontWeight: "800",
                          zIndex: 1,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        {product.confidenceScore}%
                      </div>

                      <div
                        style={{
                          aspectRatio: "1/1",
                          display: "grid",
                          placeItems: "center",
                          background: "#0f172a",
                          padding: "24px",
                        }}
                      >
                        <img
                          src={product.image || Placeholder}
                          alt={product.name}
                          style={{
                            width: "75%",
                            height: "75%",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <div style={{ padding: "20px" }}>
                        <h3
                          style={{
                            fontSize: "clamp(16px, 3.5vw, 19px)",
                            fontWeight: "700",
                            marginBottom: "8px",
                            color: "#f9fafb",
                            lineHeight: "1.3",
                          }}
                        >
                          {product.name}
                        </h3>

                        <div
                          style={{
                            color: "#e5e7eb",
                            fontSize: "clamp(13px, 3vw, 14px)",
                            marginBottom: "12px",
                          }}
                        >
                          {[product.dosage, product.volume].filter(Boolean).join(" • ")}
                        </div>

                        {/* Why This Peptide */}
                        <div
                          style={{
                            background: "rgba(96, 165, 250, 0.15)",
                            border: "1px solid rgba(96, 165, 250, 0.3)",
                            borderRadius: "12px",
                            padding: "12px",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "clamp(12px, 2.5vw, 13px)",
                              fontWeight: "700",
                              marginBottom: "6px",
                              color: "#60a5fa",
                            }}
                          >
                            Why this peptide:
                          </div>
                          <div
                            style={{
                              fontSize: "clamp(12px, 2.5vw, 13px)",
                              color: "#e5e7eb",
                              lineHeight: "1.4",
                            }}
                          >
                            Matches {product.matchedGoals.length} of {selectedGoals.length} goals
                            {product.reasons && product.reasons.length > 0 && ` • ${product.reasons[0]}`}
                          </div>
                        </div>

                        {/* Price & Tags Row */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              color: "#f9fafb",
                              fontWeight: 800,
                              fontSize: "clamp(14px, 3vw, 16px)",
                            }}
                          >
                            {typeof product.price === "number" ? `$${product.price.toFixed(2)}` : ""}
                          </div>

                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {(product.tags || [])
                              .slice(0, 2)
                              .map((tag) => (
                                <span
                                  key={tag}
                                  style={{
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    color: "#e5e7eb",
                                    fontSize: "11px",
                                    padding: "6px 8px",
                                    borderRadius: "999px",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Alternatives Toggle */}
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                  <button
                    onClick={() => setShowAlternatives((v) => !v)}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: "12px",
                      padding: "12px 20px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {showAlternatives ? "Hide Alternatives" : "Show Alternatives"}
                  </button>
                </div>

                {/* Alternatives List */}
                {showAlternatives && (
                  <div
                    style={{
                      background: "rgba(17, 24, 39, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "20px",
                      padding: "20px",
                      marginBottom: "24px",
                    }}
                  >
                    <h4
                      style={{
                        color: "#f9fafb",
                        marginBottom: "12px",
                        fontSize: "clamp(16px, 3vw, 18px)",
                      }}
                    >
                      Other Good Matches
                    </h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                        gap: "14px",
                      }}
                    >
                      {alternatives.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "14px",
                            padding: "14px",
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={p.image || Placeholder}
                            alt={p.name}
                            style={{
                              width: 54,
                              height: 54,
                              objectFit: "contain",
                              borderRadius: "10px",
                              background: "#0f172a",
                              padding: 8,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                color: "#f9fafb",
                                fontWeight: 700,
                                fontSize: "clamp(13px, 3vw, 15px)",
                                marginBottom: 4,
                              }}
                            >
                              {p.name}
                            </div>
                            <div
                              style={{
                                color: "#9ca3af",
                                fontSize: "12px",
                              }}
                            >
                              Confidence: {p.confidenceScore}%
                            </div>
                          </div>
                          <div
                            style={{
                              color: "#f9fafb",
                              fontWeight: 700,
                              fontSize: "12px",
                            }}
                          >
                            {typeof p.price === "number" ? `$${p.price.toFixed(2)}` : ""}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Excluded (brief) */}
                {excluded.length > 0 && (
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px",
                      padding: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        color: "#f9fafb",
                        fontWeight: 700,
                        marginBottom: "8px",
                        fontSize: "clamp(14px, 3vw, 16px)",
                      }}
                    >
                      Not Recommended for Your Experience
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "18px", color: "#e5e7eb" }}>
                      {excluded.map((p) => (
                        <li key={p.id} style={{ marginBottom: "4px", fontSize: "14px" }}>
                          {p.name} — {p.excludeReason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "#f9fafb",
                      border: "2px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      padding: "14px 28px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    ← Adjust Goals
                  </button>
                  <button
                    onClick={resetBuilder}
                    style={{
                      background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "14px 28px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Start Over
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
