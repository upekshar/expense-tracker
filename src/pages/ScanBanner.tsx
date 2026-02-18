import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useOfflineSync } from "../hooks/useOfflineSync";

export function SyncBanner() {
  const syncStatus = useSelector((state: RootState) => state.sync.status);
  const isOnline = useOfflineSync();

  if (isOnline && syncStatus === "syncing") {
    return (
      <div className="bg-blue-500 text-white text-center p-2">
        Syncing changes…
      </div>
    );
  }

  if (syncStatus === "done") {
    return (
      <div className="bg-green-500 text-white text-center p-2">
        All changes synced!
      </div>
    );
  }

  return null;
}
