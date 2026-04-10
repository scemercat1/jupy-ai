import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// încărcăm Chat dinamic ca să nu fie SSR
const Chat = dynamic(() => import("./chat"), { ssr: false });

export default function Home() {
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("jupy_name") || "";
    setName(savedName);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Jupy AI</h1>
      <p>Simple AI chat with memory per name, no login required.</p>
      <Chat />
    </div>
  );
}
