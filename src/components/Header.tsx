import { useEffect, useState } from "react";

export default function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  /**
   * Listen for online/offline events to update the status in real-time. This is important for user feedback, especially when they are making changes that will be queued for syncing later.
   * We use the `navigator.onLine` property to set the initial state, and then add event listeners for "online" and "offline" to update the state accordingly. This allows us to show a banner or status indicator in the UI that reflects the current connectivity status.
   */
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header
      className="
      w-full
      bg-white
      p-3 sm:p-4
      rounded-none sm:rounded-lg
      shadow-md
    "
    >
      <div
        className="
        flex
        flex-col
        xs:flex-row
        sm:flex-row
        justify-between
        items-start
        sm:items-center
        gap-3
      "
      >
        {/* Title */}
        <h1
          className="
          text-lg
          sm:text-xl
          md:text-2xl
          font-bold
          text-gray-800
          truncate
        "
        >
          Expense Tracker
        </h1>

        {/* Status */}
        <div
          role="status"
          aria-live="polite"
          className="
            flex items-center
          "
        >
          <span
            className={`
              px-3 py-1
              rounded-full
              text-xs sm:text-sm
              font-medium
              whitespace-nowrap
              ${
                isOnline
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            `}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
