import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef();

  // 🔐 check name
  useEffect(() => {
    const savedName = localStorage.getItem("jupy_name");

    if (!savedName) {
      router.push("/");
    } else {
      setName(savedName);
    }
  }, []);

  // 🔽 auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🚀 send message
  const handleSend = async () => {
    if (!input.trim() || !name || loading) return;

    const userMsg = input;

    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://jupyai.junethecat07.workers.dev/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg,
          name: name,
        }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "No response",
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Error connecting to server",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>🤖 Jupy AI</div>
        <div style={{ fontSize: 14, opacity: 0.7 }}>
          {name}
        </div>
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
                  ? "linear-gradient(135deg, #4f8cff, #6ea8ff)"
                  : "#2a2a2a",
              color: m.role === "user" ? "#fff" : "#eee",
            }}
          >
            {m.text}
          </div>
        ))}

        {/* 🤔 thinking animation */}
        {loading && (
          <div style={{ ...styles.bubble, background: "#2a2a2a" }}>
            <span className="typing">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button style={styles.sendBtn} onClick={handleSend}>
          ➤
        </button>
      </div>

      {/* CSS animation */}
      <style>{`
        .typing {
          display: flex;
          gap: 4px;
        }

        .typing span {
          width: 6px;
          height: 6px;
          background: #aaa;
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }

        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// 🎨 styles
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f0f0f",
    color: "#fff",
    fontFamily: "system-ui",
  },

  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #222",
    display: "flex",
    justifyContent: "space-between",
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 20,
  },

  bubble: {
    padding: "10px 14px",
    borderRadius: 14,
    maxWidth: "75%",
    lineHeight: 1.4,
    fontSize: 14,
    animation: "fadeIn 0.2s ease",
  },

  inputBox: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #222",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: "none",
    outline: "none",
    background: "#1e1e1e",
    color: "#fff",
  },

  sendBtn: {
    padding: "0 16px",
    borderRadius: 8,
    border: "none",
    background: "#4f8cff",
    color: "#fff",
    cursor: "pointer",
    fontSize: 18,
  },
};
