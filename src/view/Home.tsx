import { FormEvent, useContext, useState } from "react";
import Form from "../component/Form";
import React from "react";
import "./Home.css";
import { AlertContext } from "../context/AlertContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

enum Steps {
  MAGIC_WORD,
  REGISTER,
  LOGIN,
}

export default function Home() {
  const [magicWord, setMagicWord] = useState("");
  const [step, setStep] = useState(Steps.MAGIC_WORD);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { addAlert } = useContext(AlertContext);

  const navigate = useNavigate();

  if(localStorage.getItem("token")) navigate("/chat")
  
  console.log("nb rendering")

  function toggleLogin() {
    if (step === Steps.LOGIN) {
      setStep(Steps.REGISTER);
    } else {
      setStep(Steps.LOGIN);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (magicWord === "rigalet") {
      addAlert({
        type: "success",
        message: "Bienvenue sur Mittier !",
      });
      setStep(Steps.REGISTER);
    }else{
      addAlert({
        type: "error",
        message: "Mauvais mot magique"
      })
    }
  }

  function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_HOST}/signup`, {
        "username": username,
        "password": password
    }).then((res) => {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("username", username)
        addAlert({
            type: "success",
            message: "Connexion réussie"
        })
        navigate("/chat")
    }).catch((err) => {
        console.log(err)
        addAlert({
            type: "error",
            message: "Erreur lors de la connexion"
        })
    })
  }

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_HOST}/login`, {
        "username": username,
        "password": password
    }).then((res) => {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("username", username)
        addAlert({
            type: "success",
            message: "Connexion réussie"
        })
        navigate("/chat")
    }).catch((err) => {
        console.log(err)
        addAlert({
            type: "error",
            message: "Erreur lors de la connexion"
        })
    })

  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setMagicWord(e.target?.value || "");
  }

  function handleUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target?.value || "");
  }

  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target?.value || "");
  }

  if (step === Steps.REGISTER)
    return (
      (document.title = "Mitter - Register"),
      (
        <div className="Home">
          <Form title="S'inscrire">
            <form onSubmit={handleRegister}>
              <div>
                <label htmlFor="username">Username*</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Entre ton nom d'utilisateur"
                  value={username}
                  onInput={handleUsername}
                />
              </div>
              <div>
                <label htmlFor="password">Password*</label>
                <input
                  type="text"
                  name="password"
                  value={password}
                  placeholder="Entre ton mot de passe"
                  onInput={handlePassword}
                />
              </div>
              <input
                className="link"
                type="button"
                value="Se connecter"
                onClick={toggleLogin}
              />
              <div className="legend">
                <p>Bon bah la frr tu connais</p>
                <input type="submit" value="Valider" />
              </div>
            </form>
          </Form>
        </div>
      )
    );

  if (step === Steps.LOGIN)
    return (
      (document.title = "Mitter - Login"),
      (
        <div className="Home">
          <Form title="Se connecter">
            <form onSubmit={handleLogin}>
              <div>
                <label htmlFor="username">Username*</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Entre un nom d'utilisateur"
                  value={username}
                  onInput={handleUsername}
                />
              </div>
              <div>
                <label htmlFor="password">Password*</label>
                <input
                  type="text"
                  name="password"
                  placeholder="Entre un mot de passe"
                  value={password}
                  onInput={handlePassword}
                />
              </div>
              <input
                className="link"
                type="button"
                value="S'inscrire"
                onClick={toggleLogin}
              />
              <div className="legend">
                <p>Bon bah la frr tu connais</p>
                <input type="submit" value="Valider" />
              </div>
            </form>
          </Form>
        </div>
      )
    );

  return (
    (document.title = "Mitter - Mittier than an IRC"),
    (
      <div className="Home">
        <p className="invisible-text">rigalet</p>
        <Form title="Welcome to Mittier">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={magicWord}
                placeholder="Entre le mot magique"
                onInput={handleInput}
              />
            </div>
            <div className="legend">
              <p>Dis le mot magique</p>
              <input type="submit" value="Valider" />
            </div>
          </form>
        </Form>
      </div>
    )
  );
}
