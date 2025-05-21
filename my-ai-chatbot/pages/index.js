import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { sender: "user", text: message }]);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();

      if (data.reply) {
        setChat((prev) => [...prev, { sender: "bot", text: data.reply }]);
      }
    } catch (e) {
      setChat((prev) => [...prev, { sender: "bot", text: "Σφάλμα στην επικοινωνία." }]);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>AI Chatbot με n8n Workflow</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300 }}>
        {chat.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender === "user" ? "Εσύ" : "Bot"}:</b> {msg.text}
          </p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Γράψε μήνυμα..."
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />
      <button onClick={sendMessage} style={{ marginTop: 10 }}>
        Στείλε
      </button>
    </div>
  );
}