import { useLocation, useNavigate } from "react-router-dom";

export default function Scoreboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative", // needed for absolute child
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #77a4adee, #041116ee)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        backdropFilter: "blur(12px)",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Developer credit at the very top */}
      <div
        style={{
          position: "absolute",
          top: "10px", // distance from top
          width: "100%",
          textAlign: "center",
          fontSize: "14px",
          color: "rgba(255, 255, 255, 0.8)",
          textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        Developed by Chiranth Gowda
      </div>

      {/* Main content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "8px",
            textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          You can do better!
        </h1>
        <h2
          style={{
            fontSize: "18px",
            marginBottom: "30px",
            textShadow: "1px 1px 5px rgba(0,0,0,0.4)",
          }}
        >
          Your Score: {score}
        </h2>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 30px",
            fontSize: "15px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #00f5a0, #00c3f5)",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 8px 15px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px) scale(1.05)";
            e.target.style.boxShadow = "0 12px 20px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = "0 8px 15px rgba(0,0,0,0.3)";
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
