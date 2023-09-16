import { useContext, useEffect } from "react";
import { AlertContext } from "../context/AlertContext";
import "./Alert.scss";
import AlertModal from "./AlertModal";


export default function AlertManager() {
  const { alerts, removeAlert } = useContext(AlertContext);

  useEffect(() => {
    setTimeout(() => {
        removeAlert(alerts[0]);
        }
    , 2000)
    }, [alerts, removeAlert]);

  return (
    <div className="alert">
      {
        alerts[0] ?
        <AlertModal alert={alerts[0]}/> 
        : null
      }
    </div>
  );
}
