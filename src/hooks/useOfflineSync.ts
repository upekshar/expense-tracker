import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useOfflineSync = () => {
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  /**
   * Listen for online/offline events to update the status in real-time. When the app goes back online,
   * we trigger a sync action to process any queued changes. This ensures that users get immediate feedback and
   * their data stays consistent across devices. We use the `navigator.onLine` property to set the initial state,
   * and then add event listeners for "online" and "offline" to update the state accordingly.
   *  This allows us to show a banner or status indicator in the UI that reflects the current connectivity status.
   */

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
