import { useContext, useEffect } from "react";
import { AlertContext } from "../context/AlertContext";
import "./Alert.scss";

export default function Alert() {
  const { alerts, removeAlert } = useContext(AlertContext);

  useEffect(() => {
    setTimeout(() => {
        removeAlert(alerts[0]);
        }
    , 1000)
    }, [alerts, removeAlert]);

  return (
    <div className="alert">
      {alerts.map((alert) => (
        <div className={`alert-${alert.type}`}>
          <p>{alert.message}</p>
        </div>
      ))}
    </div>
  );
}
