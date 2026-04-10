import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const register = async () => {
    const res = await fetch("https://jupyai.junethecat07.workers.dev/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.ok) {
      alert("Account created! Please login");
      router.push("/login");
    } else {
      alert("Error creating account");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Register Jupy AI</h1>

      <input placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="password" type="password" onChange={e => setPassword(e.target.value)} />

      <button onClick={register}>Create account</button>
    </div>
  );
}

const styles = {
  container: { padding: 40, fontFamily: "Arial" }
};
