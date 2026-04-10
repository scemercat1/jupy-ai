import { useEffect, useState } from "react";

export default function Chat() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("jupy_name");
    setName(savedName || "User");
  }, []);

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
        { role: "assistant", text: "Error connecting to Jupy AI." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>🤖 Jupy AI Chat</h2>

      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}

        {loading && <p>⏳ Jupy is thinking...</p>}
      </div>

      <div style={styles.inputBox}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />

        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
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
  chatBox: {
    minHeight: 300,
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  inputBox: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  button: {
    padding: 10,
    cursor: "pointer",
  },
};
