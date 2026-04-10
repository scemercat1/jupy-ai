import { useEffect, useState } from "react";

export default function Chat() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setName(localStorage.getItem("jupy_name") || "User");
  }, []);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [
      ...messages,
      { role: "user", text: input }
    ];

    setMessages(newMessages);

const res = await fetch("https://jupyai.junethecat07.workers.dev/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: input,
    name: name
  })
});

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", text: data.reply }
    ]);

    setInput("");
  };

  return (
    <div style={styles.container}>
      <h2>💬 Jupy Chat</h2>

      <div style={styles.box}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}
      </div>

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
  );
}

const styles = {
  container: {
    width: 420,
    margin: "auto",
    marginTop: 50,
    fontFamily: "Arial"
  },
  box: {
    border: "1px solid #ccc",
    minHeight: 300,
    padding: 10,
    marginBottom: 10
  },
  input: {
    width: "70%",
    padding: 10
  },
  button: {
    padding: 10,
    marginLeft: 10
  }
};
