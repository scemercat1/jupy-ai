import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const start = () => {
    if (!name.trim()) return;

    localStorage.setItem("jupy_name", name.trim());
    router.push("/chat");
  };

  return (
    <div style={styles.page}>
      {/* background glow */}
      <div className="bg"></div>

      <div style={styles.card}>
        <div style={styles.logo}>⚡ Jupy AI</div>

        <p style={styles.subtitle}>
          Your intelligent assistant powered by memory & AI
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && start()}
        />

        <button onClick={start} style={styles.button}>
          Start Session →
        </button>

        <div style={styles.footer}>
          Powered by Scemercat1 in association with ChromaticNetwork
        </div>
      </div>

      {/* CSS */}
      <style>{`
        body {
          margin: 0;
          background: #0a0a0f;
        }

        .bg {
          position: fixed;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 20% 20%, #4f8cff55, transparent 40%),
            radial-gradient(circle at 80% 70%, #ff4fd855, transparent 40%);
          animation: floatbg 8s infinite alternate;
          z-index: -1;
        }

        @keyframes floatbg {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "system-ui",
    color: "white",
  },

  card: {
    width: 320,
    padding: 30,
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: 15,
    textAlign: "center",
  },

  logo: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.7,
  },

  input: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    textAlign: "center",
  },

  button: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg,#4f8cff,#6ea8ff)",
    color: "white",
    fontWeight: "bold",
    transition: "0.2s",
  },

  footer: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 5,
  },
};
