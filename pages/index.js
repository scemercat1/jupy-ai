import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const start = () => {
    if (!name.trim()) return alert("Enter your name");

    // salvăm numele
    localStorage.setItem("jupy_name", name);

    // mergem la chat
    router.push("/chat");
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <h1>Jupy AI 🤖</h1>

      <input
        placeholder="Enter your name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "10px", marginTop: "10px" }}
      />

      <button onClick={start} style={{ marginTop: "10px", padding: "10px" }}>
        Start Session
      </button>
    </div>
  );
}
