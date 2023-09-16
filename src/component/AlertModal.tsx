import { useState } from "react";
import { Alert } from "../context/AlertContext";

interface AlertProps{
    alert: Alert
}

type animation_type = "appear" | "disappear";

export default function AlertModal(props: AlertProps){
  const [animation, setAnimation] = useState<animation_type>("appear")
   return(
        <div key={props.alert.message} className={`alert-${props.alert.type} ` + animation}>
          <p>{props.alert.message}</p>
        </div>
   )
}