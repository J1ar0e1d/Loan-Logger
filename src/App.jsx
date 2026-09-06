import { ClientsProvider } from "./context/ClientsContext";
import AddClients from "./pages/AddClients";
import "./App.css";
function App() {
  return (
    <ClientsProvider>
      <AddClients />
    </ClientsProvider>
  );
}

export default App;
