import React, { useState, useMemo, useLayoutEffect } from "react";

export default function CalculatorPage() {
  const [peptideType, setPeptideType] = useState("standard");
  const [vialStrength, setVialStrength] = useState("10");
  const [bacWater, setBacWater] = useState("3");
  const [desiredDose, setDesiredDose] = useState("0.25");
  const [doseUnit, setDoseUnit] = useState("mg");

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Peptide type presets
  const peptideTypes = {
    "glp1": { label: "GLP-1 Agonist", defaultBac: "2.5", examples: "Tirzepatide, Retatrutide, Cagrilintide" },
    "standard": { label: "Standard Peptide", defaultBac: "3", examples: "BPC-157, TB-500, Ipamorelin" },
    "nad": { label: "NAD+", defaultBac: "5", examples: "NAD+ 500mg" }
  };

  // Update BAC water when peptide type changes
  const handlePeptideTypeChange = (type) => {
    setPeptideType(type);
    setBacWater(peptideTypes[type].defaultBac);
  };

  // Calculate all values
  const calculations = useMemo(() => {
    const vialStrengthNum = parseFloat(vialStrength) || 0;
    const bacWaterNum = parseFloat(bacWater) || 0;
    const desiredDoseNum = parseFloat(desiredDose) || 0;

    if (vialStrengthNum === 0 || bacWaterNum === 0 || desiredDoseNum === 0) {
      return null;
    }

    // Convert dose to mg if in mcg
    const doseInMg = doseUnit === "mcg" ? desiredDoseNum / 1000 : desiredDoseNum;

    // Concentration (mg/mL)
    const concentration = vialStrengthNum / bacWaterNum;

    // Dose in mL
    const doseInML = doseInMg / concentration;

    // Dose in units (1mL = 100 units on insulin syringe)
    const doseInUnits = doseInML * 100;

    // Total doses in vial
    const totalDoses = Math.floor(vialStrengthNum / doseInMg);

    // Peptide per unit
    const peptidePerUnit = concentration / 100;

    // Syringe fill percentage (max 100 units = 1mL)
    const syringeFillPercent = Math.min((doseInUnits / 100) * 100, 100);

    return {
      concentration: concentration.toFixed(2),
      doseInML: doseInML.toFixed(3),
      doseInUnits: doseInUnits.toFixed(1),
      totalDoses,
      peptidePerUnit: peptidePerUnit.toFixed(4),
      syringeFillPercent,
      isValid: doseInUnits <= 100
    };
  }, [vialStrength, bacWater, desiredDose, doseUnit]);

  // Syringe Component
  const Syringe = ({ fillPercent, units }) => (
    <div style={{
      position: "relative",
      width: "100%",
      maxWidth: "300px",
      margin: "0 auto",
      padding: "20px 0"
    }}>
      {/* Syringe Body */}
      <div style={{
        position: "relative",
        width: "80px",
        height: "300px",
        margin: "0 auto",
        background: "rgba(255,255,255,0.05)",
        border: "3px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)"
      }}>
        {/* Scale Markings */}
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(mark => (
          <div
            key={mark}
            style={{
              position: "absolute",
              bottom: `${mark}%`,
              left: 0,
              right: 0,
              height: mark % 10 === 0 ? "3px" : "2px",
              background: mark % 50 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)",
              zIndex: 1
            }}
          >
            {/* Unit Label - styled like real syringe markings */}
            <span style={{
              position: "absolute",
              left: "50%",
              top: "-2px",
              transform: "translate(-50%, -100%)",
              fontSize: "clamp(12px, 2.5vw, 14px)",
              color: "#f9fafb",
              fontWeight: "800",
              textShadow: "0 1px 3px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)",
              padding: "2px 4px",
              background: mark % 50 === 0 ? "rgba(96, 165, 250, 0.3)" : "transparent",
              borderRadius: "3px",
              whiteSpace: "nowrap"
            }}>
              {mark}
            </span>
          </div>
        ))}

        {/* Liquid Fill */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${fillPercent}%`,
          background: fillPercent > 75 
            ? "linear-gradient(180deg, #ef4444, #dc2626)" 
            : fillPercent > 50 
            ? "linear-gradient(180deg, #f59e0b, #d97706)"
            : "linear-gradient(180deg, #60a5fa, #3b82f6)",
          transition: "height 0.5s ease, background 0.3s ease",
          boxShadow: "0 -2px 10px rgba(96, 165, 250, 0.5)"
        }}>
          {/* Meniscus Effect */}
          <div style={{
            position: "absolute",
            top: "-2px",
            left: 0,
            right: 0,
            height: "4px",
            background: "rgba(255,255,255,0.3)",
            borderRadius: "50%"
          }} />
        </div>

        {/* Current Level Indicator */}
        {fillPercent > 0 && (
          <div style={{
            position: "absolute",
            bottom: `${fillPercent}%`,
            right: "-60px",
            transform: "translateY(50%)",
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "700",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            {units} units
          </div>
        )}
      </div>

      {/* Plunger */}
      <div style={{
        width: "60px",
        height: "40px",
        margin: "10px auto 0",
        background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        border: "2px solid rgba(255,255,255,0.2)",
        borderRadius: "8px 8px 20px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          width: "20px",
          height: "80px",
          background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
          borderRadius: "4px"
        }} />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0e1a2e 100%)",
      padding: "16px"
    }}>
      <div style={{
        maxWidth: "900px",
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
            💉 Peptide Dosage Calculator
          </h1>
          <p style={{
            color: "#e5e7eb",
            fontSize: "clamp(14px, 3vw, 16px)",
            margin: "0",
            lineHeight: "1.5"
          }}>
            Calculate precise dosing for your research peptides
          </p>
        </header>

        {/* Calculator Inputs */}
        <div style={{
          background: "rgba(17, 24, 39, 0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "clamp(24px, 5vw, 32px)",
          marginBottom: "24px"
        }}>
          <h2 style={{
            fontSize: "clamp(20px, 4vw, 24px)",
            fontWeight: "700",
            marginBottom: "24px",
            color: "#f9fafb"
          }}>
            Input Parameters
          </h2>

          {/* Peptide Type */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              color: "#e5e7eb",
              fontSize: "clamp(14px, 3vw, 16px)",
              fontWeight: "600",
              marginBottom: "12px"
            }}>
              Peptide Type
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px"
            }}>
              {Object.entries(peptideTypes).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => handlePeptideTypeChange(key)}
                  style={{
                    background: peptideType === key 
                      ? "linear-gradient(135deg, #60a5fa, #a78bfa)" 
                      : "rgba(255,255,255,0.05)",
                    color: "#f9fafb",
                    border: peptideType === key 
                      ? "2px solid #60a5fa" 
                      : "2px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    padding: "14px",
                    fontSize: "clamp(14px, 3vw, 15px)",
                    fontWeight: "700",
                    cursor: "pointer",
                    minHeight: "52px",
                    transition: "all 0.2s ease"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{
              color: "#9ca3af",
              fontSize: "clamp(12px, 2.5vw, 13px)",
              marginTop: "8px",
              fontStyle: "italic"
            }}>
              {peptideTypes[peptideType].examples}
            </p>
          </div>

          {/* Vial Strength */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              color: "#e5e7eb",
              fontSize: "clamp(14px, 3vw, 16px)",
              fontWeight: "600",
              marginBottom: "12px"
            }}>
              Vial Strength (mg)
            </label>
            <input
              type="number"
              value={vialStrength}
              onChange={(e) => setVialStrength(e.target.value)}
              step="0.1"
              min="0"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "clamp(16px, 3.5vw, 18px)",
                fontWeight: "600",
                color: "#f9fafb",
                minHeight: "56px"
              }}
            />
            <div style={{
              display: "flex",
              gap: "8px",
              marginTop: "12px",
              flexWrap: "wrap"
            }}>
              {["5", "10", "15", "20", "30", "50", "500"].map(preset => (
                <button
                  key={preset}
                  onClick={() => setVialStrength(preset)}
                  style={{
                    background: "rgba(96, 165, 250, 0.1)",
                    border: "1px solid rgba(96, 165, 250, 0.3)",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "clamp(13px, 3vw, 14px)",
                    fontWeight: "600",
                    color: "#60a5fa",
                    cursor: "pointer",
                    minHeight: "36px"
                  }}
                >
                  {preset}mg
                </button>
              ))}
            </div>
          </div>

          {/* BAC Water */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              color: "#e5e7eb",
              fontSize: "clamp(14px, 3vw, 16px)",
              fontWeight: "600",
              marginBottom: "12px"
            }}>
              BAC Water Amount (mL)
            </label>
            <input
              type="number"
              value={bacWater}
              onChange={(e) => setBacWater(e.target.value)}
              step="0.1"
              min="0"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "clamp(16px, 3.5vw, 18px)",
                fontWeight: "600",
                color: "#f9fafb",
                minHeight: "56px"
              }}
            />
          </div>

          {/* Desired Dose */}
          <div style={{ marginBottom: "0" }}>
            <label style={{
              display: "block",
              color: "#e5e7eb",
              fontSize: "clamp(14px, 3vw, 16px)",
              fontWeight: "600",
              marginBottom: "12px"
            }}>
              Desired Dose
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="number"
                value={desiredDose}
                onChange={(e) => setDesiredDose(e.target.value)}
                step="0.01"
                min="0"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "clamp(16px, 3.5vw, 18px)",
                  fontWeight: "600",
                  color: "#f9fafb",
                  minHeight: "56px"
                }}
              />
              <select
                value={doseUnit}
                onChange={(e) => setDoseUnit(e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "2px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  padding: "16px",
                  fontSize: "clamp(16px, 3.5vw, 18px)",
                  fontWeight: "600",
                  color: "#f9fafb",
                  minHeight: "56px",
                  minWidth: "100px",
                  cursor: "pointer"
                }}
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Syringe */}
        {calculations && (
          <div style={{
            background: "rgba(17, 24, 39, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "clamp(24px, 5vw, 32px)",
            marginBottom: "24px"
          }}>
            <h2 style={{
              fontSize: "clamp(20px, 4vw, 24px)",
              fontWeight: "700",
              marginBottom: "8px",
              color: "#f9fafb",
              textAlign: "center"
            }}>
              Visual Guide
            </h2>
            <p style={{
              color: "#9ca3af",
              fontSize: "clamp(13px, 3vw, 14px)",
              marginBottom: "24px",
              textAlign: "center"
            }}>
              100-unit insulin syringe (1mL capacity)
            </p>
            
            <Syringe 
              fillPercent={calculations.syringeFillPercent} 
              units={calculations.doseInUnits}
            />

            {!calculations.isValid && (
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "2px solid rgba(239, 68, 68, 0.5)",
                borderRadius: "12px",
                padding: "16px",
                marginTop: "20px",
                textAlign: "center"
              }}>
                <p style={{
                  color: "#f87171",
                  fontSize: "clamp(14px, 3vw, 15px)",
                  fontWeight: "600",
                  margin: 0
                }}>
                  ⚠️ Warning: Dose exceeds 100 units (1mL syringe capacity)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {calculations && (
          <div style={{
            display: "grid",
            gap: "16px",
            marginBottom: "24px"
          }}>
            {/* Primary Result */}
            <div style={{
              background: "linear-gradient(135deg, #1e3a5f, #2d4a6f)",
              border: "2px solid rgba(96, 165, 250, 0.3)",
              borderRadius: "20px",
              padding: "clamp(24px, 5vw, 32px)",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "clamp(16px, 3.5vw, 18px)",
                color: "#60a5fa",
                fontWeight: "600",
                marginBottom: "8px"
              }}>
                📍 DRAW SYRINGE TO:
              </div>
              <div style={{
                fontSize: "clamp(40px, 8vw, 56px)",
                fontWeight: "800",
                color: "#f9fafb",
                lineHeight: "1",
                marginBottom: "8px"
              }}>
                {calculations.doseInUnits} <span style={{ fontSize: "clamp(24px, 5vw, 32px)" }}>units</span>
              </div>
              <div style={{
                color: "#e5e7eb",
                fontSize: "clamp(14px, 3vw, 16px)"
              }}>
                ({calculations.doseInML} mL)
              </div>
            </div>

            {/* Additional Info Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px"
            }}>
              <div style={{
                background: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "clamp(14px, 3vw, 15px)",
                  color: "#9ca3af",
                  marginBottom: "8px"
                }}>
                  💉 Concentration
                </div>
                <div style={{
                  fontSize: "clamp(24px, 5vw, 32px)",
                  fontWeight: "800",
                  color: "#f9fafb"
                }}>
                  {calculations.concentration}
                </div>
                <div style={{
                  fontSize: "clamp(13px, 3vw, 14px)",
                  color: "#9ca3af"
                }}>
                  mg/mL
                </div>
              </div>

              <div style={{
                background: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "clamp(14px, 3vw, 15px)",
                  color: "#9ca3af",
                  marginBottom: "8px"
                }}>
                  📦 Total Doses
                </div>
                <div style={{
                  fontSize: "clamp(24px, 5vw, 32px)",
                  fontWeight: "800",
                  color: "#f9fafb"
                }}>
                  {calculations.totalDoses}
                </div>
                <div style={{
                  fontSize: "clamp(13px, 3vw, 14px)",
                  color: "#9ca3af"
                }}>
                  in vial
                </div>
              </div>

              <div style={{
                background: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "20px",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "clamp(14px, 3vw, 15px)",
                  color: "#9ca3af",
                  marginBottom: "8px"
                }}>
                  ⚗️ Per Unit
                </div>
                <div style={{
                  fontSize: "clamp(24px, 5vw, 32px)",
                  fontWeight: "800",
                  color: "#f9fafb"
                }}>
                  {calculations.peptidePerUnit}
                </div>
                <div style={{
                  fontSize: "clamp(13px, 3vw, 14px)",
                  color: "#9ca3af"
                }}>
                  mg/unit
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          background: "rgba(251, 191, 36, 0.1)",
          border: "2px solid rgba(251, 191, 36, 0.3)",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center"
        }}>
          <p style={{
            color: "#fbbf24",
            fontSize: "clamp(13px, 3vw, 14px)",
            fontWeight: "600",
            margin: 0,
            lineHeight: "1.6"
          }}>
            ⚠️ For Research Purposes Only • Not for Human Consumption • Always verify calculations independently
          </p>
        </div>
      </div>
    </div>
  );
}
