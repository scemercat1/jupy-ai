import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  const token = typeof window !== "undefined"
    ? localStorage.getItem("jupy_token")
    : null;

  useEffect(() => {
    if (!token) router.push("/login");
  }, []);

  const send = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);

    const res = await fetch("https://jupyai.junethecat07.workers.dev/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        token
      })
    });

    const data = await res.json();

    setMessages(prev => [...prev, { role: "assistant", text: data.reply }]);

    setInput("");
  };

  const logout = () => {
    localStorage.removeItem("jupy_token");
    router.push("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Jupy AI Chat</h2>

      <button onClick={logout}>Logout</button>

      <div style={{ minHeight: 300 }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}
      </div>

      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
