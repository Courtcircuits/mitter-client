import { Alert } from "../context/AlertContext";

interface AlertProps{
    alert: Alert
}

export default function AlertModal(props: AlertProps){
   return(
        <div key={props.alert.message} className={`alert-${props.alert.type}`}>
          <p>{props.alert.message}</p>
        </div>
   )
}