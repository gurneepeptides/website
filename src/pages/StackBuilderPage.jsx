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
    description: "Support for body composition and weight control"
  },
  {
    id: "appetite-control",
    label: "Appetite Control",
    icon: "🍽️",
    description: "Help manage hunger and eating patterns"
  },
  {
    id: "recovery",
    label: "Recovery & Healing",
    icon: "💪",
    description: "Support tissue repair and recovery"
  },
  {
    id: "cognitive",
    label: "Cognitive Enhancement",
    icon: "🧠",
    description: "Memory, focus, and mental clarity"
  },
  {
    id: "anti-aging",
    label: "Anti-Aging",
    icon: "✨",
    description: "Cellular health and longevity support"
  },
  {
    id: "energy",
    label: "Energy & Vitality",
    icon: "⚡",
    description: "Enhanced energy and endurance"
  },
  {
    id: "performance",
    label: "Performance",
    icon: "🏃",
    description: "Athletic and physical performance"
  },
  {
    id: "metabolism",
    label: "Metabolism",
    icon: "🔥",
    description: "Metabolic health and efficiency"
  }
];

// Experience levels
const experienceLevels = [
  {
    id: "beginner",
    label: "Beginner",
    description: "New to peptide research",
    icon: "🌱"
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Some research experience",
    icon: "📊"
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Experienced researcher",
    icon: "🔬"
  }
];

export default function StackBuilderPage() {
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);

  // Toggle goal selection
  const toggleGoal = (goalId) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  // Calculate recommendations based on selected goals and experience
  const recommendations = useMemo(() => {
    if (!experience || selectedGoals.length === 0) return [];

    // Score each product based on matching goals
    const scored = products
      .filter(p => p.researchGoals && p.researchGoals.length > 0)
      .filter(p => !p.tags.includes("Out of Stock")) // Filter out out of stock items
      .map(product => {
        let score = 0;
        const matchedGoals = [];

        // Calculate match score
        selectedGoals.forEach(goal => {
          if (product.researchGoals.includes(goal)) {
            score += 1;
            matchedGoals.push(goal);
          }
        });

        // Bonus for combo products if multiple recovery/performance goals selected
        if (product.tags.includes("combo") && 
            (selectedGoals.includes("recovery") || selectedGoals.includes("performance"))) {
          score += 0.5;
        }

        // Adjust dosage preference based on experience
        if (experience === "beginner") {
          // Prefer lower dosages for beginners
          if (product.id.includes("-10") || product.id.includes("-5")) {
            score += 0.3;
          }
        } else if (experience === "advanced") {
          // Advanced users might prefer higher dosages or combo products
          if (product.id.includes("-15") || product.id.includes("-20") || product.tags.includes("combo")) {
            score += 0.3;
          }
        }

        return {
          ...product,
          score,
          matchedGoals,
          matchPercentage: selectedGoals.length > 0 ? (matchedGoals.length / selectedGoals.length) * 100 : 0
        };
      })
      .filter(p => p.score > 0) // Only include products with at least one matching goal
      .sort((a, b) => {
        // Sort by score first, then by number of matched goals, then by price
        if (b.score !== a.score) return b.score - a.score;
        if (b.matchedGoals.length !== a.matchedGoals.length) return b.matchedGoals.length - a.matchedGoals.length;
        return a.price - b.price;
      });

    // Return top 3 unique products (avoid duplicates of same compound at different dosages)
    const uniqueRecommendations = [];
    const seenCompounds = new Set();

    for (const product of scored) {
      // Extract base compound name (e.g., "Tirzepatide" from "Tirzepatide 10mg")
      const baseName = product.name.split(" ")[0];
      
      if (!seenCompounds.has(baseName) && uniqueRecommendations.length < 3) {
        uniqueRecommendations.push(product);
        seenCompounds.add(baseName);
      }
      
      if (uniqueRecommendations.length === 3) break;
    }

    return uniqueRecommendations;
  }, [experience, selectedGoals]);

  // Reset and start over
  const resetBuilder = () => {
    setStep(1);
    setExperience("");
    setSelectedGoals([]);
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0e1a2e 100%)",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {/* Header */}
        <header style={{ 
          textAlign: "center",
          marginBottom: "40px",
          paddingTop: "20px"
        }}>
          <h1 style={{ 
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "12px",
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🧬 Peptide Stack Builder
          </h1>
          <p style={{ 
            color: "var(--sub)",
            fontSize: "16px",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Build your personalized research stack based on your goals and experience level
          </p>
        </header>

        {/* Progress Indicator */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
          marginBottom: "40px"
        }}>
          {[1, 2, 3].map(num => (
            <React.Fragment key={num}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: step >= num ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.1)",
                border: step === num ? "2px solid #60a5fa" : "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}>
                {num}
              </div>
              {num < 3 && (
                <div style={{
                  width: "60px",
                  height: "2px",
                  background: step > num ? "linear-gradient(90deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.1)"
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Experience Level */}
        {step === 1 && (
          <div style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px",
            animation: "fadeIn 0.3s ease"
          }}>
            <h2 style={{ 
              fontSize: "24px",
              marginBottom: "8px",
              textAlign: "center"
            }}>
              Select Your Experience Level
            </h2>
            <p style={{ 
              color: "var(--sub)",
              textAlign: "center",
              marginBottom: "32px"
            }}>
              This helps us recommend appropriate dosages and complexity
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px"
            }}>
              {experienceLevels.map(level => (
                <button
                  key={level.id}
                  onClick={() => setExperience(level.id)}
                  style={{
                    background: experience === level.id ? "linear-gradient(135deg, #1e3a5f, #2d4a6f)" : "rgba(15,26,43,0.65)",
                    border: experience === level.id ? "2px solid #60a5fa" : "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "24px",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    transform: experience === level.id ? "scale(1.02)" : "scale(1)"
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                    {level.icon}
                  </div>
                  <div style={{ 
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px"
                  }}>
                    {level.label}
                  </div>
                  <div style={{ 
                    color: "var(--sub)",
                    fontSize: "14px"
                  }}>
                    {level.description}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ 
              display: "flex",
              justifyContent: "center",
              marginTop: "32px"
            }}>
              <button
                onClick={() => experience && setStep(2)}
                disabled={!experience}
                style={{
                  background: experience ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.1)",
                  color: experience ? "#fff" : "var(--sub)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 32px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: experience ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease"
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Research Goals */}
        {step === 2 && (
          <div style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px",
            animation: "fadeIn 0.3s ease"
          }}>
            <h2 style={{ 
              fontSize: "24px",
              marginBottom: "8px",
              textAlign: "center"
            }}>
              Select Your Research Goals
            </h2>
            <p style={{ 
              color: "var(--sub)",
              textAlign: "center",
              marginBottom: "32px"
            }}>
              Choose all that apply - we'll match you with the best peptides
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "32px"
            }}>
              {researchGoals.map(goal => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      background: isSelected ? "linear-gradient(135deg, #1e3a5f, #2d4a6f)" : "rgba(15,26,43,0.65)",
                      border: isSelected ? "2px solid #60a5fa" : "1px solid var(--border)",
                      borderRadius: "12px",
                      padding: "16px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                      transform: isSelected ? "scale(1.02)" : "scale(1)"
                    }}
                  >
                    <div style={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px"
                    }}>
                      <span style={{ fontSize: "20px" }}>{goal.icon}</span>
                      <span style={{ 
                        fontWeight: "600",
                        fontSize: "14px"
                      }}>
                        {goal.label}
                      </span>
                    </div>
                    <div style={{ 
                      color: "var(--sub)",
                      fontSize: "12px"
                    }}>
                      {goal.description}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ 
              display: "flex",
              justifyContent: "space-between",
              gap: "16px"
            }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "var(--ink)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "14px 32px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => selectedGoals.length > 0 && setStep(3)}
                disabled={selectedGoals.length === 0}
                style={{
                  background: selectedGoals.length > 0 ? "linear-gradient(135deg, #60a5fa, #a78bfa)" : "rgba(255,255,255,0.1)",
                  color: selectedGoals.length > 0 ? "#fff" : "var(--sub)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "14px 32px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: selectedGoals.length > 0 ? "pointer" : "not-allowed"
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
            <div style={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px",
              textAlign: "center"
            }}>
              <h2 style={{ 
                fontSize: "24px",
                marginBottom: "8px"
              }}>
                Your Personalized Stack
              </h2>
              <p style={{ 
                color: "var(--sub)",
                marginBottom: "16px"
              }}>
                Based on your {experience} experience level and selected goals
              </p>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center"
              }}>
                {selectedGoals.map(goalId => {
                  const goal = researchGoals.find(g => g.id === goalId);
                  return (
                    <span
                      key={goalId}
                      style={{
                        background: "rgba(96, 165, 250, 0.2)",
                        border: "1px solid #60a5fa",
                        borderRadius: "999px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        color: "#60a5fa",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      {goal.icon} {goal.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "48px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
                <h3 style={{ marginBottom: "8px" }}>No matches found</h3>
                <p style={{ color: "var(--sub)", marginBottom: "24px" }}>
                  Try selecting different research goals
                </p>
                <button
                  onClick={resetBuilder}
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Start Over
                </button>
              </div>
            ) : (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                  marginBottom: "24px"
                }}>
                  {recommendations.map((product, index) => (
                    <div
                      key={product.id}
                      style={{
                        background: "var(--panel)",
                        border: "2px solid var(--border)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        position: "relative"
                      }}
                    >
                      {/* Rank Badge */}
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "700",
                        zIndex: 1
                      }}>
                        #{index + 1} Match
                      </div>

                      <Link
                        to={`/product/${product.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div style={{
                          aspectRatio: "1/1",
                          display: "grid",
                          placeItems: "center",
                          background: "#101c31",
                          padding: "20px"
                        }}>
                          <img
                            src={product.image || Placeholder}
                            alt={product.name}
                            style={{ 
                              width: "70%",
                              height: "70%",
                              objectFit: "contain"
                            }}
                          />
                        </div>

                        <div style={{ padding: "20px" }}>
                          <h3 style={{ 
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "8px"
                          }}>
                            {product.name}
                          </h3>
                          
                          <div style={{ 
                            color: "var(--sub)",
                            fontSize: "13px",
                            marginBottom: "12px"
                          }}>
                            {[product.dosage, product.volume].filter(Boolean).join(" • ")}
                          </div>

                          <div style={{
                            background: "rgba(96, 165, 250, 0.1)",
                            border: "1px solid rgba(96, 165, 250, 0.3)",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "12px"
                          }}>
                            <div style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              marginBottom: "6px",
                              color: "#60a5fa"
                            }}>
                              Why this peptide:
                            </div>
                            <div style={{
                              fontSize: "12px",
                              color: "var(--sub)"
                            }}>
                              Matches {product.matchedGoals.length} of your goals ({Math.round(product.matchPercentage)}%)
                            </div>
                          </div>

                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}>
                            <div style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              color: "#60a5fa"
                            }}>
                              ${product.price}
                            </div>
                            <div style={{
                              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                              color: "#fff",
                              borderRadius: "8px",
                              padding: "8px 16px",
                              fontSize: "14px",
                              fontWeight: "600"
                            }}>
                              View Details
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center"
                }}>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--ink)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "14px 32px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    ← Adjust Goals
                  </button>
                  <button
                    onClick={resetBuilder}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--ink)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      padding: "14px 32px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer"
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
