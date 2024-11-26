import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).apiUrl = import.meta.env.VITE_API_URL;

// console.log(import.meta.env.VITE_API_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
