// src/hooks/useOfflineSync.ts
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useOfflineSync = () => {
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      dispatch({ type: "sync/triggerSync" });
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (navigator.onLine) dispatch({ type: "sync/triggerSync" });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  return isOnline;
};
