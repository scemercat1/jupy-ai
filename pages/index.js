import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const start = () => {
    if (!name) return;

    localStorage.setItem("jupy_name", name);
    router.push("/chat");
  };

  return (
    <div style={styles.container}>
      <h1>🤖 Jupy AI</h1>

      <p>Enter your name</p>

      <input
        style={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Andrei"
      />

      <button style={styles.button} onClick={start}>
        Create session
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: 120,
    fontFamily: "Arial"
  },
  input: {
    padding: 10,
    fontSize: 16,
    marginTop: 10
  },
  button: {
    padding: 10,
    marginTop: 20,
    cursor: "pointer"
  }
};
