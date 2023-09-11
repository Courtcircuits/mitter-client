import { createContext, useState } from "react";

export type Alert = {
    type : "success" | "error" | "info";
    message: string;
}

export const AlertContext = createContext<{
    alerts: Alert[];
    addAlert: (alert: Alert) => void;
    removeAlert: (alert: Alert) => void;
}>({
    alerts: [],
    addAlert: () => {},
    removeAlert: () => {}
})

export function AlertContextProvider({
    children,
}:{
    children: React.ReactNode;
}) {
    const [alerts, setAlerts] = useState<Alert[]>([])

    function addAlert(alert: Alert){
        setAlerts((alerts) => [...alerts, alert])
    }

    function removeAlert(alert: Alert){
        setAlerts((alerts) => alerts.filter((a) => a !== alert))
    }

    return (
        <AlertContext.Provider value={{alerts, addAlert, removeAlert}}>
            {children}
        </AlertContext.Provider>
    )
}