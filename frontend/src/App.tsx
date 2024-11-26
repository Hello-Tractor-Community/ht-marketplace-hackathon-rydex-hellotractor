import { BrowserRouter } from "react-router-dom";
import MasterProvider from "./context/MasterProvider";
import AppRouter from "./pages/router";

function App() {
  return (
    <MasterProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </MasterProvider>
  );
}

export default App;
