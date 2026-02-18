import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { store } from "./redux/store"; 
import { Provider } from "react-redux";
import { queryClient } from "./api/queryClient";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
     <Provider store={store}>
     <App />
     </Provider>
    
  </QueryClientProvider>
);
