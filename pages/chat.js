import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem("jupy_name");
    setName(savedName || "User");
  }, []);

  // auto scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://jupyai.junethecat07.workers.dev/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            name: name,
          }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "No response" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error connecting to Jupy AI." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        🤖 Jupy AI
      </div>

      {/* CHAT AREA */}
      <div ref={chatRef} style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background:
                m.role === "user" ? "#4f46e5" : "#2a2a2a",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {m.role === "user" ? name : "Jupy"}
            </div>
            <div>{m.text}</div>
          </div>
        ))}

        {/* typing indicator */}
        {loading && (
          <div style={{ ...styles.bubble, background: "#2a2a2a" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Jupy</div>
            <div>⏳ Jupy is thinking...</div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Jupy..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#111",
    color: "white",
    fontFamily: "Arial",
  },

  header: {
    padding: 15,
    fontSize: 18,
    borderBottom: "1px solid #222",
    textAlign: "center",
  },

  chatBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 15,
    overflowY: "auto",
  },

  bubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 12,
    color: "white",
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
  },

  button: {
    padding: "10px 15px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#4f46e5",
    color: "white",
  },
};
