import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    const savedName = localStorage.getItem("jupy_name");
    setName(savedName || "");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://jupyai.junethecat07.workers.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, name }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply || "No response" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Error connecting" }]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>🤖 Jupy AI Chat</h2>

      {!name && (
        <div style={styles.nameBox}>
          <input
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button style={styles.button} onClick={() => localStorage.setItem("jupy_name", name)}>Save</button>
        </div>
      )}

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: m.role === "user" ? "#dcf8c6" : "#f1f0f0",
            }}
          >
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.message, backgroundColor: "#f1f0f0" }}>
            ⏳ Jupy is thinking...
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button style={styles.button} onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: 420,
    margin: "auto",
    marginTop: 40,
    fontFamily: "Arial",
  },
  nameBox: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },
  chatBox: {
    minHeight: 400,
    maxHeight: 500,
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: 10,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputBox: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    borderRadius: 4,
    cursor: "pointer",
  },
  message: {
    padding: 8,
    borderRadius: 8,
    maxWidth: "80%",
    wordBreak: "break-word",
  },
};
