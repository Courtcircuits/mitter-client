import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Chat.scss";
import axios from "axios";
import { AlertContext } from "../context/AlertContext";

interface Message {
  author: string;
  content: string;
  timestamp: string;
  id: number;
}

interface MessageResponse {
  data: Message[];
}

export default function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Map<number, Message>>(new Map());
  const [lastDate, setLastDate] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { addAlert } = useContext(AlertContext);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const fetchMessages = () => {
    if (lastDate === "") {
      axios
        .get(`${process.env.REACT_APP_HOST}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response: MessageResponse) => {
          let lastDate = response.data.reduce(
            (acc: string, message: Message) => {
              if (acc === "") {
                return message.timestamp;
              } else {
                if (parseInt(acc) < parseInt(message.timestamp)) {
                  return message.timestamp;
                } else {
                  return acc;
                }
              }
            },
            ""
          );
          setLastDate(lastDate);

          let map = new Map<number, Message>();
          response.data.forEach((message) => {
            map.set(message.id, message);
          });

          setMessages(map);
        })
        .catch((error) => {
          addAlert({ type: "error", message: error.response.data.message });
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_HOST}/messages?since=${lastDate}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          let lastDate = response.data.reduce(
            (acc: string, message: Message) => {
              if (acc === "") {
                return message.timestamp;
              } else {
                if (parseInt(acc) < parseInt(message.timestamp)) {
                  return message.timestamp;
                } else {
                  return acc;
                }
              }
            },
            ""
          );
          setLastDate(lastDate);
          console.log(response.data);

          let newMessages = messages;

          response.data.forEach((message: Message) => {
            newMessages.set(message.id, message);
          });
          if (
            JSON.stringify(Array.from(newMessages.values())) !=
            JSON.stringify(Array.from(messages.values()))
          ) {
            setMessages(newMessages);
          }
        })
        .catch((error) => {
          addAlert({ type: "error", message: error.response.data.message });
        });
    }
  };

  useEffect(() => {
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_HOST}/send`,
        {
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        addAlert({ type: "error", message: error.response.data.message });
      });
    fetchMessages();
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setContent(event.target.value);
  };

  if (!localStorage.getItem("token")) {
    navigate("/");
  }

  let messagesArray = Array.from(messages.values()).sort(
    (a: Message, b: Message) => {
      if (parseInt(a.timestamp) < parseInt(b.timestamp)) {
        return -1;
      } else if (parseInt(a.timestamp) > parseInt(b.timestamp)) {
        return 1;
      }
      return 0;
    }
  );
  return (
    <div className="chat">
      <div className="chat-container">
        {messagesArray.map((message: Message) => (
          <div
            key={message.id}
            className={
              localStorage.getItem("username") === message.author
                ? "message myself"
                : "message"
            }
          >
            <div className="message-header">
              <p className="message-author">{message.author}</p>
              <p className="message-timestamp">
                {new Date(parseInt(message.timestamp)).toLocaleTimeString()}
              </p>
            </div>
            <p className="message-content">{message.content}</p>
          </div>
        ))}
      </div>
      <form className="user-input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Message"
          className="user-input"
          value={content}
          onChange={handleInput}
        />
        <input type="submit" className="submit-button" value="envoyer" />
      </form>
    </div>
  );
}
