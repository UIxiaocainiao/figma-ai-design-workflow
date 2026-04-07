import HomePage from "./pages/HomePage";
import { useDeployVersionRefresh } from "./hooks/useDeployVersionRefresh";

function App() {
  useDeployVersionRefresh();
  return <HomePage />;
}

export default App;
