import React from "react";

export default function App() {
  const pageStyles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
      color: "#0f172a",
    },
    content: {
      padding: 24,
      paddingBottom: 16,
      maxWidth: 800,
      width: "100%",
      margin: "0 auto",
    },
    headerImageWrapper: {
      width: "100%",
      height: 280,
      overflow: "hidden",
      borderRadius: 12,
      backgroundColor: "#e2e8f0",
    },
    headerImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
    title: {
      marginTop: 16,
      marginBottom: 8,
      fontSize: 28,
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    description: {
      marginTop: 0,
      marginBottom: 0,
      fontSize: 16,
      lineHeight: 1.6,
      color: "#334155",
    },
    ctaBar: {
      marginTop: "auto",
      position: "sticky",
      bottom: 0,
      background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 12%)",
      padding: 16,
      backdropFilter: "blur(2px)",
    },
    ctaInner: {
      maxWidth: 800,
      margin: "0 auto",
    },
    ctaButton: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: 10,
      border: "none",
      outline: "none",
      backgroundColor: "#14a89c",
      color: "#ffffff",
      fontSize: 16,
      fontWeight: 700,
      letterSpacing: 0.3,
      cursor: "pointer",
      boxShadow: "0 6px 14px rgba(20, 168, 156, 0.25)",
    },
    srOnly: {
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: 0,
    },
  };

  const safariElephantImageUrl =
    "https://images.unsplash.com/photo-1464773329917-1f17d81e16c3?q=80&w=1470&auto=format&fit=crop";

  return (
    <div style={pageStyles.container}>
      <main style={pageStyles.content}>
        <div style={pageStyles.headerImageWrapper}>
          <img
            src={safariElephantImageUrl}
            alt="Safari landscape with an elephant"
            style={pageStyles.headerImage}
          />
        </div>

        <h1 style={pageStyles.title}>Camping at Port Lympne</h1>
        <p style={pageStyles.description}>
          Experience an unforgettable night under the stars at Port Lympne. Wake to
          the sounds of the savannah, explore the reserve by day, and unwind in a
          cozy tent with stunning views. Perfect for families, couples, and
          adventurers seeking something truly special.
        </p>
      </main>

      <div style={pageStyles.ctaBar}>
        <div style={pageStyles.ctaInner}>
          <button type="button" style={pageStyles.ctaButton}>
            request availability
          </button>
        </div>
      </div>
    </div>
  );
}
