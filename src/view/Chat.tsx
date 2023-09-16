import React, { useState, useEffect, useRef, useContext } from "react";
import "./Chat.scss";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../context/AlertContext";
interface Message {
  id: string;
  content: string;
  name_owner: string;
  timestamp: string;
}

let ws: WebSocket;

export type useRunOnceProps = {
  fn: () => any;
  sessionKey?: string;
};

function timestampToString(timestamp: string):string{
  const date = new Date(parseInt(timestamp) * 1000)
  const now = new Date();
  if (date.getFullYear() === now.getFullYear() && now.getDate() === date.getDate() && now.getMonth() === date.getMonth()){
    return date.getHours() +":"+date.getMinutes();
  }
  return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}

const useRunOnce: React.FC<useRunOnceProps> = ({ fn, sessionKey }) => {
  const triggered = useRef<boolean>(false);

  useEffect(() => {
    const hasBeenTriggered = sessionKey
      ? sessionStorage.getItem(sessionKey)
      : triggered.current;

    if (!hasBeenTriggered) {
      fn();
      triggered.current = true;

      if (sessionKey) {
        sessionStorage.setItem(sessionKey, "true");
      }
    }
  }, [fn, sessionKey]);

  return null;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const { addAlert } = useContext(AlertContext);

  const navigate = useNavigate();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ws.send(input);
    setInput("");
  }

  function disconnect(e: React.MouseEvent<HTMLButtonElement>) {
    localStorage.clear();
    addAlert({
      type: "info",
      message: "Vous avez été déconnecté",
    });
    navigate("/");
  }

  useRunOnce({
    fn: () => {
      ws = new WebSocket(process.env.REACT_APP_WS_HOST || "");
      ws.onopen = () => {
        console.log(localStorage.getItem("token"));
        ws.send(localStorage.getItem("token") || "");
      };
    },
  });

  useEffect(() => {
    ws.onmessage = (event: { data: any }) => {
      console.log(event.data);
      setMessages([...JSON.parse(event.data), ...messages]);
    };
    window.scrollTo({
      top: document.body.clientHeight,
      behavior: "smooth",
    });
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
        <div>
          <p>{localStorage.getItem("username")}</p>
          <button onClick={disconnect}>Leave &gt;</button>
        </div>
      </header>
      {messages.length === 0 ? (
        <div className="loader">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
            height={50}
            width={50}
            alt="loading animation"
          />
        </div>
      ) : (
        <ul>
          {messages.map((mess, index) => {
            let full_round_class = "";
            if (index > 0) {
              if (mess.name_owner === messages[index - 1].name_owner) {
                full_round_class = " full-round";
              }
            }
            let show_name_owner = true;
            if (index < messages.length - 1) {
              if (mess.name_owner === messages[index + 1].name_owner) {
                show_name_owner = false;
              }
            }

            return (
              <li
                key={mess.id}
                className={
                  mess.name_owner === localStorage.getItem("username")
                    ? "myself"
                    : ""
                }
              >
                <div className="user-info">
                  {full_round_class === "" ? (
                    <img
                      height={24}
                      width={24}
                      alt={`profile of ${mess.name_owner}`}
                      src={`https://vercel.com/api/www/avatar?u=${mess.name_owner}&s=24`}
                    ></img>
                  ) : (
                    <div className="placeholder-pp"></div>
                  )}
                </div>
                <div className="message-info">
                  {show_name_owner ? 
                  <p className="message-header"><b>{mess.name_owner}</b> {timestampToString(mess.timestamp)}</p> 
                  : null}
                  <div className={"message" + full_round_class}>
                    <p>{mess.content}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

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
