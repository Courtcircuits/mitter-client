import React, { useState, useEffect } from "react";
import "./Chat.scss";
interface Message {
  id: string;
  content: string;
  name_owner: string;
}

const ws = new WebSocket(process.env.REACT_APP_WS_HOST || "");

ws.onopen = () => {
  console.log(localStorage.getItem("token"));
  ws.send(localStorage.getItem("token") || "");
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ws.send(input);
    setInput("");
  }

  useEffect(() => {
    ws.onmessage = (event: { data: any }) => {
      console.log(event.data);
      setMessages([...JSON.parse(event.data), ...messages]);
    };
    window.scrollTo({
      top: document.body.clientHeight,
      behavior: "smooth"
    })
  }, [messages]); // Include messages in the dependency array

  return (
    <div className="chat">
      <header>
        <img
          height={48}
          width={48}
          src={`https://vercel.com/api/www/avatar?u=${localStorage.getItem(
            "username"
          )}&s=48`}
          alt="my profile"
        ></img>
        <p>{localStorage.getItem("username")}</p>
      </header>
      <ul>
        {messages.map((mess) => (
          <li key={mess.id} className={mess.name_owner === localStorage.getItem("username") ? "myself" : ""}>
            <div className="user-info">
              <img
                height={24}
                width={24}
                alt={`profile of ${mess.name_owner}`}
                src={`https://vercel.com/api/www/avatar?u=${mess.name_owner}&s=24`}
              ></img>
            </div>
            <div className="message-info">
              <p>{mess.name_owner}</p>
              <div className="message">
                <p>{mess.content}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
