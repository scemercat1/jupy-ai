import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("jupy_name");
    if (!saved) router.push("/");
    else setName(saved);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");

    // user bubble
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("https://jupyai.junethecat07.workers.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, name }),
      });

      const data = await res.json();
      const reply = data.reply || "No response";

      // 💬 fake streaming effect
      let streamed = "";
      setMessages(prev => [...prev, { role: "assistant", text: "" }]);

      for (let i = 0; i < reply.length; i++) {
        streamed += reply[i];

        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            text: streamed,
          };
          return copy;
        });

        await sleep(8);
      }

    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "⚠️ Connection error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* animated background blobs */}
      <div className="bg"></div>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>⚡ Jupy AI</div>
        <div style={styles.name}>{name}</div>
      </div>

      {/* CHAT */}
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user"
                  ? "linear-gradient(135deg,#4f8cff,#6ea8ff)"
                  : "rgba(255,255,255,0.08)",
              boxShadow:
                m.role === "user"
                  ? "0 10px 30px rgba(79,140,255,0.3)"
                  : "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            {m.text}
          </div>
        ))}

        {loading && (
          <div style={styles.thinking}>
            <span></span><span></span><span></span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Jupy something..."
          style={styles.input}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />

        <button onClick={handleSend} style={styles.button}>
          ➤
        </button>
      </div>

      {/* STYLE */}
      <style>{`
        body {
          margin: 0;
          background: #0a0a0f;
        }

        .bg {
          position: fixed;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 20%, #4f8cff33, transparent 40%),
                      radial-gradient(circle at 80% 70%, #ff4fd833, transparent 40%);
          animation: move 10s infinite alternate;
          z-index: -1;
        }

        @keyframes move {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    color: "white",
    fontFamily: "system-ui",
    background: "#0a0a0f",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },

  logo: {
    fontWeight: "bold",
    letterSpacing: 1,
  },

  name: {
    opacity: 0.7,
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  bubble: {
    padding: "12px 14px",
    borderRadius: 16,
    maxWidth: "75%",
    fontSize: 14,
    lineHeight: 1.4,
    backdropFilter: "blur(10px)",
    animation: "float 3s ease-in-out infinite",
  },

  inputBox: {
    display: "flex",
    padding: 12,
    gap: 10,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
  },

  button: {
    padding: "0 16px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#4f8cff,#6ea8ff)",
    color: "white",
    cursor: "pointer",
    fontSize: 18,
  },

  thinking: {
    display: "flex",
    gap: 5,
    padding: 10,
  },
};
