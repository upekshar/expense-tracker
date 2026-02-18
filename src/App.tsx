import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import { useOfflineSync } from "./hooks/useOfflineSync";
import { SyncBanner } from "./pages/ScanBanner";

function App() {
  const isOnline = useOfflineSync();

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {!isOnline && (
          <div className="bg-yellow-500 text-white text-center p-2">
            You are offline. Changes will sync automatically.
          </div>
        )}
         <SyncBanner />
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </div>
    </Router>
  );
}


export default App;
