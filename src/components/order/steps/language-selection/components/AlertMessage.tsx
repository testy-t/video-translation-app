
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AlertMessageProps {
  type: "error" | "warning" | "info";
  message: string;
}

/**
 * Компонент уведомления
 */
const AlertMessage: React.FC<AlertMessageProps> = ({ type, message }) => {
  if (!message) {
    return null;
  }
  
  return (
    <Alert className="mb-4" variant={type === "error" ? "destructive" : "default"}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
