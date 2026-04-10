import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("https://jupyai.junethecat07.workers.dev/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("jupy_token", data.token);

      // optional expiry (7 days)
      localStorage.setItem("jupy_login_time", Date.now());

      router.push("/chat");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="password" type="password" onChange={e => setPassword(e.target.value)} />

      <button onClick={login}>Login</button>
    </div>
  );
}
